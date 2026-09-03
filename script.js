/* =====================================================
   KOMLAN MISSODEY — PORTFOLIO V2
   JavaScript propre et modulaire
===================================================== */

(() => {
    "use strict";

    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

    const body = document.body;
    const header = $("#header");
    const nav = $("#mainNav");
    const menuButton = $("#menuButton");
    const themeToggle = $("#themeToggle");
    const contactForm = $("#contactForm");
    const formMessage = $("#formMessage");
    const submitButton = $("#submitButton");
    const backTop = $("#backTop");
    const contactPopupButton = $("#contactPopupButton");
    const contactModal = $("#contactModal");
    const contactModalClose = $("#contactModalClose");
    const contactFormLink = $("#contactFormLink");
    const chatbotButton = $("#chatbotButton");
    const toast = $("#toast");

    /* =====================================================
       HEADER / SCROLL
    ===================================================== */
    function initHeader() {
        if (!header) return;

        const updateHeader = () => {
            header.classList.toggle("scrolled", window.scrollY > 30);
            backTop?.classList.toggle("show", window.scrollY > 600);
        };

        updateHeader();
        window.addEventListener("scroll", updateHeader, { passive: true });
    }

    /* =====================================================
       MENU MOBILE
    ===================================================== */
    function closeMobileMenu() {
        nav?.classList.remove("open");
        body.classList.remove("menu-open");
        menuButton?.setAttribute("aria-expanded", "false");

        const icon = menuButton?.querySelector("i");
        icon?.classList.remove("fa-xmark");
        icon?.classList.add("fa-bars");
    }

    function initMobileMenu() {
        if (!menuButton || !nav) return;

        menuButton.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("open");
            body.classList.toggle("menu-open", isOpen);
            menuButton.setAttribute("aria-expanded", String(isOpen));

            const icon = menuButton.querySelector("i");
            icon?.classList.toggle("fa-bars", !isOpen);
            icon?.classList.toggle("fa-xmark", isOpen);
        });

        $$(".nav-link").forEach(link => {
            link.addEventListener("click", closeMobileMenu);
        });

        document.addEventListener("click", event => {
            if (!nav.classList.contains("open")) return;
            if (nav.contains(event.target) || menuButton.contains(event.target)) return;
            closeMobileMenu();
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 780) closeMobileMenu();
        });
    }

    /* =====================================================
       NAVIGATION ACTIVE
    ===================================================== */
    function initActiveNavigation() {
        const sections = $$("main section[id]");
        const links = $$(".nav-link");
        if (!sections.length || !links.length) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                links.forEach(link => {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === `#${entry.target.id}`
                    );
                });
            });
        }, { rootMargin: "-30% 0px -55% 0px", threshold: 0 });

        sections.forEach(section => observer.observe(section));
    }

    /* =====================================================
       THÈME SOMBRE / CLAIR
    ===================================================== */
    function getPreferredTheme() {
        const saved = localStorage.getItem("komlan-theme");
        if (saved === "light" || saved === "dark") return saved;
        return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }

    function applyTheme(theme) {
        const isLight = theme === "light";
        body.classList.toggle("light-mode", isLight);

        if (themeToggle) {
            const icon = themeToggle.querySelector("i");
            icon?.classList.toggle("fa-sun", !isLight);
            icon?.classList.toggle("fa-moon", isLight);
            themeToggle.setAttribute("aria-label", isLight ? "Activer le mode sombre" : "Activer le mode clair");
            themeToggle.setAttribute("title", isLight ? "Mode sombre" : "Mode clair");
        }

        document.documentElement.style.colorScheme = isLight ? "light" : "dark";
    }

    function initTheme() {
        if (!themeToggle) return;

        applyTheme(getPreferredTheme());

        themeToggle.addEventListener("click", () => {
            const nextTheme = body.classList.contains("light-mode") ? "dark" : "light";
            localStorage.setItem("komlan-theme", nextTheme);
            applyTheme(nextTheme);
        });
    }

    /* =====================================================
       COMPTEURS
    ===================================================== */
    function initCounters() {
        const counters = $$(".counter");
        if (!counters.length) return;

        const animateCounter = counter => {
            const target = Number(counter.dataset.target || 0);
            const duration = 1300;
            const start = performance.now();

            const update = now => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = String(Math.round(target * eased));
                if (progress < 1) requestAnimationFrame(update);
            };

            requestAnimationFrame(update);
        };

        const observer = new IntersectionObserver(entries => {
            if (!entries.some(entry => entry.isIntersecting)) return;
            counters.forEach(animateCounter);
            observer.disconnect();
        }, { threshold: 0.25 });

        const section = $("#apropos");
        if (section) observer.observe(section);
    }

    /* =====================================================
       SCROLL REVEAL
    ===================================================== */
    function initReveal() {
        const elements = $$(".skill-card, .project-card, .certificate, .timeline-item, .about-card, .contact-box");
        if (!elements.length || !("IntersectionObserver" in window)) return;

        elements.forEach(element => element.classList.add("reveal-ready"));

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12 });

        elements.forEach(element => observer.observe(element));
    }

    /* =====================================================
       FORMULAIRE WEB3FORMS
    ===================================================== */
    function setFormMessage(type, message) {
        if (!formMessage) return;
        formMessage.className = `form-message ${type}`;
        formMessage.textContent = message;
    }

    function initContactForm() {
        if (!contactForm || !submitButton) return;

        const startedAt = Date.now();

        contactForm.addEventListener("submit", async event => {
            event.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            const honeypot = $("[name='botcheck']", contactForm);
            if (honeypot?.checked) return;

            // Bloque les soumissions automatisées trop rapides.
            if (Date.now() - startedAt < 2500) {
                setFormMessage("error", "Veuillez patienter quelques secondes avant d'envoyer votre message.");
                return;
            }

            const originalButton = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = `<span>Envoi en cours...</span><i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>`;
            setFormMessage("loading", "Envoi de votre message...");

            try {
                const formData = new FormData(contactForm);
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(Object.fromEntries(formData.entries()))
                });

                const result = await response.json().catch(() => ({}));

                if (!response.ok || result.success === false) {
                    throw new Error(result.message || "L'envoi du message a échoué.");
                }

                setFormMessage("success", result.message || "Votre message a bien été envoyé. Merci !");
                contactForm.reset();
            } catch (error) {
                console.error("Web3Forms:", error);
                setFormMessage("error", "Impossible d'envoyer le message pour le moment. Vous pouvez me contacter directement sur WhatsApp ou Signal.");
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButton;
            }
        });
    }

    /* =====================================================
       POPUP « ME CONTACTER »
    ===================================================== */
    function closeContactModal() {
        if (!contactModal) return;
        contactModal.classList.remove("open");
        contactModal.setAttribute("aria-hidden", "true");
        body.classList.remove("menu-open");
    }

    function openContactModal() {
        if (!contactModal) return;
        contactModal.classList.add("open");
        contactModal.setAttribute("aria-hidden", "false");
        body.classList.add("menu-open");
        setTimeout(() => contactModalClose?.focus(), 50);
    }

    function initContactModal() {
        if (!contactModal || !contactPopupButton) return;

        contactPopupButton.addEventListener("click", event => {
            event.preventDefault();
            openContactModal();
        });

        contactModalClose?.addEventListener("click", closeContactModal);
        contactModal.querySelector("[data-close-contact-modal]")?.addEventListener("click", closeContactModal);
        contactFormLink?.addEventListener("click", closeContactModal);

        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && contactModal.classList.contains("open")) {
                closeContactModal();
            }
        });
    }

    /* =====================================================
       CHATBOT — PRÊT À CONNECTER
    ===================================================== */
    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(showToast.timeout);
        showToast.timeout = setTimeout(() => toast.classList.remove("show"), 4500);
    }

    function initChatbot() {
        if (!chatbotButton) return;

        chatbotButton.addEventListener("click", () => {
            closeContactModal();
            showToast("L'Assistant IA FastBots est disponible via le bouton de chat affiché sur le site.");
        });
    }

    /* =====================================================
       BACK TO TOP
    ===================================================== */
    function initBackTop() {
        if (!backTop) return;
        backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    /* =====================================================
       ANNÉE FOOTER
    ===================================================== */
    function initYear() {
        const year = $("#year");
        if (year) year.textContent = String(new Date().getFullYear());
    }

    /* =====================================================
       INIT
    ===================================================== */
    document.addEventListener("DOMContentLoaded", () => {
        initHeader();
        initMobileMenu();
        initActiveNavigation();
        initTheme();
        initCounters();
        initReveal();
        initContactForm();
        initContactModal();
        initChatbot();
        initBackTop();
        initYear();
    });
})();
