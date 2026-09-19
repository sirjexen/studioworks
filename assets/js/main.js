"use strict";

(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const select = (selector, context = document) => context.querySelector(selector);
  const selectAll = (selector, context = document) => [...context.querySelectorAll(selector)];

  const config = window.SITE_CONFIG || {};
  const projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];

  const isHttpUrl = (value) => typeof value === "string" && /^https?:\/\//i.test(value.trim());
  const isEmail = (value) => typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  /* ---------- Navbar ---------- */
  function initNavbar() {
    const header = select("#site-header");
    const toggle = select(".menu-toggle");
    const panel = select("#main-menu");

    if (!header) return;

    let ticking = false;
    const updateHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 16);
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    updateHeader();

    if (!toggle || !panel) return;

    const setMenu = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Tutup menu navigasi" : "Buka menu navigasi");
      panel.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
    };

    toggle.addEventListener("click", () => {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    selectAll(".nav-link", panel).forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && panel.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        panel.classList.contains("is-open") &&
        !panel.contains(event.target) &&
        !toggle.contains(event.target)
      ) setMenu(false);
    });

    // Jika layar diperbesar saat menu terbuka, tutup menu agar scroll tidak terkunci.
    window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
      if (event.matches) setMenu(false);
    });
  }

  /* ---------- Navigasi anchor + scroll spy ---------- */
  function initNavigation() {
    selectAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const id = link.getAttribute("href");
        if (!id || id === "#") return;

        const target = select(id);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });

        // Pindahkan fokus keyboard ke tujuan (penting untuk skip link).
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });

        if (history.replaceState) history.replaceState(null, "", id);
      });
    });

    const sections = selectAll("main section[id]");
    const links = selectAll(".nav-link");

    if (!("IntersectionObserver" in window) || !sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      links.forEach((link) => {
        const active = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-30% 0px -55%", threshold: [0.1, 0.25, 0.5] });

    sections.forEach((section) => observer.observe(section));
  }

  /* ---------- Project ---------- */
  const CATEGORY_LABELS = { web: "Web", uiux: "UI/UX", tools: "Tools" };

  function createTextElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = text;
    return element;
  }

  function createProjectLink(url, activeLabel, inactiveLabel) {
    if (!isHttpUrl(url)) {
      const disabled = createTextElement("span", "project-link is-disabled", inactiveLabel);
      disabled.setAttribute("aria-disabled", "true");
      return disabled;
    }

    const link = createTextElement("a", "project-link", activeLabel);
    link.href = url.trim();
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return link;
  }

  function createProjectCard(project, allowFeatured) {
    const article = document.createElement("article");
    article.className = `project-card${project.featured && allowFeatured ? " is-featured" : ""}`;
    article.dataset.category = project.category;

    const imageWrap = document.createElement("div");
    imageWrap.className = "project-image-wrap";

    const image = document.createElement("img");
    image.className = "project-image";
    image.src = project.image || "assets/images/project-placeholder.svg";
    image.alt = `Pratinjau project ${project.title}`;
    image.loading = "lazy";
    image.width = 1200;
    image.height = 675;

    const category = createTextElement("span", "project-category", CATEGORY_LABELS[project.category] || project.category);
    imageWrap.append(image, category);

    const body = document.createElement("div");
    body.className = "project-body";

    const top = document.createElement("div");
    top.className = "project-top";
    top.append(
      createTextElement("h3", "project-title", project.title),
      createTextElement("span", "project-status", project.status || "")
    );

    const description = createTextElement("p", "project-description", project.description || "");

    const techList = document.createElement("ul");
    techList.className = "tech-list";
    techList.setAttribute("aria-label", `Teknologi ${project.title}`);
    (project.technologies || []).forEach((technology) => {
      techList.append(createTextElement("li", "", technology));
    });

    const actions = document.createElement("div");
    actions.className = "project-actions";
    actions.append(
      createProjectLink(project.demoUrl, "Live demo", "Demo belum tersedia"),
      createProjectLink(project.repositoryUrl, "Repository", "Repository belum tersedia")
    );

    body.append(top, description, techList, actions);
    article.append(imageWrap, body);
    return article;
  }

  function initProjects() {
    const grid = select("#project-grid");
    const empty = select("#project-empty");
    const buttons = selectAll(".filter-button");

    // Ringkasan di hero dihitung dari data, jadi selalu sesuai jumlah project asli.
    const countEl = select("#hero-project-count");
    const categoryEl = select("#hero-category-count");
    if (countEl) countEl.textContent = String(projects.length).padStart(2, "0");
    if (categoryEl) {
      const categories = new Set(projects.map((project) => project.category)).size;
      categoryEl.textContent = `Dalam ${categories} kategori`;
    }

    if (!grid) return;

    const render = (filter = "all") => {
      const filtered = filter === "all" ? projects : projects.filter((project) => project.category === filter);
      const allowFeatured = filter === "all";

      grid.replaceChildren();
      const fragment = document.createDocumentFragment();
      filtered.forEach((project) => fragment.append(createProjectCard(project, allowFeatured)));
      grid.append(fragment);

      if (empty) empty.hidden = filtered.length !== 0;
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        render(button.dataset.filter || "all");
      });
    });

    render();
  }

  /* ---------- Kontak ---------- */
  function initContact() {
    const socialList = select("#social-list");
    const fallback = select("#contact-fallback");
    const form = select("#contact-form");
    const social = config.social || {};

    // Daftar link sosial: hanya yang terisi dan valid yang ditampilkan.
    if (socialList) {
      const entries = [
        ["GitHub", social.github],
        ["LinkedIn", social.linkedin],
        ["Instagram", social.instagram]
      ].filter(([, url]) => isHttpUrl(url));

      if (isEmail(config.email)) entries.push(["Email", `mailto:${config.email.trim()}`]);

      entries.forEach(([label, url]) => {
        const link = createTextElement("a", "social-link", label);
        link.href = url;
        if (url.startsWith("http")) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
        socialList.append(link);
      });

      socialList.hidden = entries.length === 0;
    }

    const endpoint = isHttpUrl(config.formEndpoint) ? config.formEndpoint.trim() : "";
    const canSend = Boolean(endpoint || isEmail(config.email));

    if (!form) return;
    if (!canSend) return; // form tetap tersembunyi, pesan "segera tersedia" tetap tampil

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

    const setStatus = (message, isError = false) => {
      if (!status) return;
      status.textContent = message;
      status.classList.toggle("is-error", isError);
    };

    const showToast = (message, isError = false) => {
      if (!toast) return;
      toast.textContent = message;
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
      const firstInvalid = fields.find((_, index) => !results[index]);

      if (firstInvalid) {
        firstInvalid.focus();
        setStatus("Periksa kembali kolom yang ditandai.", true);
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      const button = select(".submit-button", form);
      const label = select(".button-label", form);

      // Honeypot terisi = kemungkinan bot. Pura-pura berhasil, tidak dikirim.
      if (data._gotcha) {
        resetForm();
        setStatus("Pesan terkirim.");
        return;
      }

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

  initNavbar();
  initNavigation();
  initProjects();
  initContact();
  setYear();
})();
