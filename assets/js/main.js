"use strict";

(() => {
  const select = (s, c = document) => c.querySelector(s);
  const selectAll = (s, c = document) => [...c.querySelectorAll(s)];
  const config = window.SITE_CONFIG || {};

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = motionQuery.matches;

  const isHttpUrl = (v) => typeof v === "string" && /^https?:\/\//i.test(v.trim());
  const isEmail = (v) => typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  // Safari < 14 belum mendukung addEventListener pada MediaQueryList.
  const onMediaChange = (mql, handler) => {
    if (typeof mql.addEventListener === "function") mql.addEventListener("change", handler);
    else if (typeof mql.addListener === "function") mql.addListener(handler);
  };
  onMediaChange(motionQuery, (e) => { reducedMotion = e.matches; });

  /* ================= Tema ================= */
  function initTheme() {
    const toggle = select("#theme-toggle");
    if (!toggle) return;

    const sync = () => {
      const dark = document.documentElement.dataset.theme === "dark";
      toggle.setAttribute("aria-pressed", String(dark));
      toggle.setAttribute("aria-label", dark ? "Ubah ke mode terang" : "Ubah ke mode gelap");
    };

    sync();

    toggle.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem("sw-theme", next); } catch (e) { /* diabaikan */ }
      sync();
    });
  }

  /* ================= Progress bar ================= */
  function initProgress() {
    const bar = select("#read-progress span");
    if (!bar) return;

    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      bar.style.transform = `scaleX(${ratio})`;
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });

    update();
  }

  /* ================= Navbar ================= */
  function initNavbar() {
    const header = select("#site-header");
    const toggle = select(".menu-toggle");
    const panel = select("#main-menu");
    if (!header) return;

    let ticking = false;
    const update = () => { header.classList.toggle("is-scrolled", window.scrollY > 16); ticking = false; };
    window.addEventListener("scroll", () => {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();

    if (!toggle || !panel) return;

    const setMenu = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Tutup menu navigasi" : "Buka menu navigasi");
      panel.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
    };

    toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
    selectAll(".nav-link", panel).forEach((l) => l.addEventListener("click", () => setMenu(false)));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
    });

    document.addEventListener("click", (e) => {
      if (panel.classList.contains("is-open") && !panel.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
    });

    onMediaChange(window.matchMedia("(min-width: 961px)"), (e) => { if (e.matches) setMenu(false); });
  }

  /* ================= Anchor + scroll spy ================= */
  function initNavigation() {
    selectAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href");
        if (!id || id === "#") return;
        const target = select(id);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        if (history.replaceState) history.replaceState(null, "", id);
      });
    });

    const sections = selectAll("main section[id]");
    const links = selectAll(".nav-link");
    if (!("IntersectionObserver" in window) || !sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((en) => en.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;

      links.forEach((link) => {
        const active = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-30% 0px -55%", threshold: [0.1, 0.25, 0.5] });

    sections.forEach((s) => observer.observe(s));
  }

  /* ================= Reveal saat scroll ================= */
  function initReveal() {
    const items = selectAll(".reveal");
    if (!items.length) return;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay = `${Math.min(i * 70, 280)}ms`;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    items.forEach((el) => observer.observe(el));
  }

  /* ================= Penghitung angka ================= */
  function initCounters() {
    const counters = selectAll(".counter");
    if (!counters.length) return;

    const paint = (el, value) => {
      const pad = Number(el.dataset.pad || 0);
      el.textContent = pad ? String(value).padStart(pad, "0") : String(value);
    };

    const run = (el) => {
      const target = Number(el.dataset.target || 0);
      if (reducedMotion) { paint(el, target); return; }

      const duration = 1100;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        paint(el, Math.round(target * eased));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) { counters.forEach(run); return; }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        run(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    counters.forEach((el) => observer.observe(el));
  }

  /* ================= Ketikan di terminal ================= */
  function initTyping() {
    const el = select("#type-line");
    if (!el) return;

    const phrases = ["deploy --prod", "git push origin main", "lighthouse --view", "open studioworks.my.id"];
    if (reducedMotion) { el.textContent = phrases[0]; return; }

    let phrase = 0, char = 0, deleting = false;

    const tick = () => {
      const current = phrases[phrase];
      el.textContent = current.slice(0, char);

      if (!deleting && char < current.length) { char += 1; setTimeout(tick, 75); }
      else if (!deleting) { deleting = true; setTimeout(tick, 1600); }
      else if (char > 0) { char -= 1; setTimeout(tick, 35); }
      else { deleting = false; phrase = (phrase + 1) % phrases.length; setTimeout(tick, 350); }
    };

    setTimeout(tick, 900);
  }

  /* ================= Tilt + tombol magnetik ================= */
  function initPointerEffects() {
    if (reducedMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    selectAll(".tilt").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateZ(6px)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });

    selectAll(".magnetic").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.16}px, ${y * 0.24}px)`;
      });
      btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
    });
  }

  /* ================= Lab kriptografi ================= */
  function initLab() {
    const input = select("#lab-input");
    const output = select("#lab-output");
    const note = select("#lab-note");
    const tabs = selectAll(".lab-tab");
    const shift = select("#lab-shift");
    const shiftValue = select("#lab-shift-value");
    const keyInput = select("#lab-key");
    const controlShift = select("#control-shift");
    const controlKey = select("#control-key");
    const copyBtn = select("#lab-copy");
    const panel = select("#lab-panel");

    if (!input || !output) return;

    let mode = "caesar";

    const caesar = (text, amount) =>
      text.replace(/[a-z]/gi, (ch) => {
        const base = ch === ch.toUpperCase() ? 65 : 97;
        const pos = ch.charCodeAt(0) - base;
        return String.fromCharCode(((pos + amount) % 26 + 26) % 26 + base);
      });

    const toBase64 = (text) => {
      const bytes = new TextEncoder().encode(text);
      let binary = "";
      bytes.forEach((b) => { binary += String.fromCharCode(b); });
      return btoa(binary);
    };

    const toXorHex = (text, key) => {
      const safeKey = key && key.length ? key : "studioworks";
      const bytes = new TextEncoder().encode(text);
      const keyBytes = new TextEncoder().encode(safeKey);
      return [...bytes]
        .map((b, i) => (b ^ keyBytes[i % keyBytes.length]).toString(16).padStart(2, "0"))
        .join(" ");
    };

    const notes = {
      caesar: "Setiap huruf digeser sejumlah posisi dalam alfabet. Angka, spasi, dan tanda baca dibiarkan apa adanya.",
      base64: "Teks diubah menjadi 64 karakter aman transmisi. Ini pengkodean, bukan enkripsi: siapa pun bisa membalikkannya.",
      xor: "Setiap byte teks di-XOR dengan byte kunci yang diulang, lalu ditampilkan dalam heksadesimal."
    };

    const render = () => {
      const text = input.value;

      if (!text.trim()) {
        output.textContent = "Hasil akan muncul di sini setelah Anda mengetik.";
        return;
      }

      try {
        if (mode === "caesar") output.textContent = caesar(text, Number(shift.value));
        else if (mode === "base64") output.textContent = toBase64(text);
        else output.textContent = toXorHex(text, keyInput.value);
      } catch (e) {
        output.textContent = "Teks tidak dapat diproses.";
      }
    };

    const setMode = (next, tab) => {
      mode = next;
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      if (panel && tab) panel.setAttribute("aria-labelledby", tab.id);
      if (controlShift) controlShift.hidden = next !== "caesar";
      if (controlKey) controlKey.hidden = next !== "xor";
      if (note) note.textContent = notes[next];
      render();
    };

    tabs.forEach((tab) => tab.addEventListener("click", () => setMode(tab.dataset.mode, tab)));

    input.addEventListener("input", render);
    if (shift) shift.addEventListener("input", () => {
      if (shiftValue) shiftValue.textContent = shift.value;
      render();
    });
    if (keyInput) keyInput.addEventListener("input", render);

    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(output.textContent);
          copyBtn.textContent = "Tersalin";
          copyBtn.classList.add("is-done");
          setTimeout(() => { copyBtn.textContent = "Salin"; copyBtn.classList.remove("is-done"); }, 1800);
        } catch (e) {
          copyBtn.textContent = "Gagal";
          setTimeout(() => { copyBtn.textContent = "Salin"; }, 1800);
        }
      });
    }

    if (note) note.textContent = notes.caesar;
    render();
  }

  /* ================= Filter project ================= */
  function initProjects() {
    const grid = select("#project-grid");
    const empty = select("#project-empty");
    const announce = select("#project-announce");
    const buttons = selectAll(".filter-button");
    if (!grid) return;

    const cards = selectAll(".project-card", grid);

    const apply = (filter) => {
      let visible = 0;
      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.hidden = !match;
        if (match) visible += 1;
      });

      grid.classList.toggle("is-filtered", filter !== "all");
      if (empty) empty.hidden = visible !== 0;
      if (announce) {
        announce.textContent = visible === 0
          ? "Tidak ada project di kategori ini."
          : `Menampilkan ${visible} project.`;
      }
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        apply(button.dataset.filter || "all");
      });
    });
  }

  /* ================= Kontak ================= */
  function initContact() {
    const socialList = select("#social-list");
    const fallback = select("#contact-fallback");
    const form = select("#contact-form");
    const social = config.social || {};

    if (socialList) {
      const entries = [
        ["GitHub", social.github],
        ["LinkedIn", social.linkedin],
        ["Instagram", social.instagram],
        ["Telegram", social.telegram]
      ].filter(([, url]) => isHttpUrl(url));

      if (isEmail(config.email)) entries.push(["Email", `mailto:${config.email.trim()}`]);

      entries.forEach(([label, url]) => {
        const link = document.createElement("a");
        link.className = "social-link";
        link.href = url;

        const name = document.createElement("span");
        name.textContent = label;

        const value = document.createElement("small");
        value.textContent = url.startsWith("mailto:") ? url.replace("mailto:", "") : "Buka";

        link.append(name, value);
        if (url.startsWith("http")) { link.target = "_blank"; link.rel = "noopener noreferrer"; }
        socialList.append(link);
      });

      socialList.hidden = entries.length === 0;
    }

    const endpoint = isHttpUrl(config.formEndpoint) ? config.formEndpoint.trim() : "";
    const canSend = Boolean(endpoint || isEmail(config.email));
    if (!form || !canSend) return;

    form.hidden = false;
    if (fallback) fallback.hidden = true;

    const status = select("#form-status");
    const toast = select("#toast");
    const fields = selectAll(".field input, .field textarea", form);
    let isSubmitting = false;
    let toastTimer;

    const messages = {
      name: "Masukkan nama minimal 2 karakter.",
      email: "Masukkan alamat email yang valid.",
      subject: "Masukkan subjek minimal 3 karakter.",
      message: "Masukkan pesan minimal 10 karakter."
    };

    const setStatus = (msg, isError = false) => {
      if (!status) return;
      status.textContent = msg;
      status.classList.toggle("is-error", isError);
    };

    const validateField = (field) => {
      const error = select(`#${field.id}-error`);
      let valid = field.checkValidity() && field.value.trim() !== "";
      if (field.type === "email") valid = isEmail(field.value);

      field.setAttribute("aria-invalid", String(!valid));
      field.setAttribute("aria-describedby", `${field.id}-error`);
      if (error) error.textContent = valid ? "" : messages[field.id];
      return valid;
    };

    fields.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") validateField(field);
        if (status && status.classList.contains("is-error")) setStatus("");
      });
    });

    const showToast = (msg, isError = false) => {
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.toggle("is-error", isError);
      toast.classList.add("is-visible");
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 5000);
    };

    const resetForm = () => {
      form.reset();
      fields.forEach((field) => {
        field.removeAttribute("aria-invalid");
        const error = select(`#${field.id}-error`);
        if (error) error.textContent = "";
      });
    };

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (isSubmitting) return;

      const results = fields.map(validateField);
      const firstInvalid = fields.find((_, i) => !results[i]);
      if (firstInvalid) {
        firstInvalid.focus();
        setStatus("Periksa kembali kolom yang ditandai.", true);
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      const button = select(".submit-button", form);
      const label = select(".button-label", form);

      // Honeypot terisi = kemungkinan bot. Pura-pura berhasil, tidak dikirim.
      if (data._gotcha) { resetForm(); setStatus("Pesan terkirim."); return; }

      isSubmitting = true;
      if (button) button.disabled = true;
      if (label) label.textContent = "Mengirim...";
      setStatus("");

      try {
        if (endpoint) {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify(data)
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);

          resetForm();
          setStatus("Pesan terkirim. Terima kasih!");
          showToast("Pesan terkirim. Terima kasih!");
        } else {
          const body = `Nama: ${data.name}\nEmail: ${data.email}\n\n${data.message}`;
          const href = `mailto:${config.email.trim()}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
          window.location.href = href;

          resetForm();
          setStatus("Aplikasi email Anda akan terbuka. Kirim pesan dari sana.");
        }
      } catch (error) {
        setStatus("Pesan gagal dikirim. Periksa koneksi Anda lalu coba lagi.", true);
        showToast("Pesan gagal dikirim. Coba lagi.", true);
      } finally {
        isSubmitting = false;
        if (button) button.disabled = false;
        if (label) label.textContent = "Kirim pesan";
      }
    });
  }

  function setYear() {
    const year = select("#current-year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  initTheme();
  initProgress();
  initNavbar();
  initNavigation();
  initReveal();
  initCounters();
  initTyping();
  initPointerEffects();
  initLab();
  initProjects();
  initContact();
  setYear();
})();
