/* =========================================================
   KOMLAN MISSODEY — PORTFOLIO V2
   JavaScript principal
   ========================================================= */

"use strict";

/* =========================================================
   UTILITAIRES
   ========================================================= */

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

/* =========================================================
   ÉLÉMENTS DOM
   ========================================================= */

const header = $("#header");
const menuButton = $("#menuButton");
const nav = $("#nav");

const themeToggle = $("#themeToggle");
const themeIcon = $("#themeIcon");

const contactForm = $("#contactForm");
const formMessage = $("#formMessage");

const messagingWidget = $("#messagingWidget");
const messagingButton = $("#messagingButton");
const messagingMenu = $("#messagingMenu");

const backTop = $("#backTop");

const yearElement = $("#year");

/* =========================================================
   HEADER
   ========================================================= */

function initHeader() {
    if (!header) return;

    const updateHeader = () => {
        header.classList.toggle("scrolled", window.scrollY > 40);
    };

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });
}

/* =========================================================
   MENU MOBILE
   ========================================================= */

function initMobileMenu() {
    if (!menuButton || !nav) return;

    menuButton.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("active");

        menuButton.classList.toggle("active", isOpen);

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        document.body.classList.toggle("menu-open", isOpen);
    });

    /* Fermer le menu après clic sur un lien */
    $$(".nav-link", nav).forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");
            menuButton.classList.remove("active");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            document.body.classList.remove("menu-open");
        });
    });

    /* Fermer avec Escape */
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            nav.classList.remove("active");
            menuButton.classList.remove("active");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            document.body.classList.remove("menu-open");
        }
    });
}

/* =========================================================
   NAVIGATION ACTIVE
   ========================================================= */

function initActiveNavigation() {
    const sections = $$("section[id]");
    const navLinks = $$(".nav-link");

    if (!sections.length || !navLinks.length) return;

    const updateActiveLink = () => {
        const scrollPosition = window.scrollY + 180;

        let currentSection = "";

        sections.forEach((section) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;

            if (
                scrollPosition >= top &&
                scrollPosition < top + height
            ) {
                currentSection = section.id;
            }
        });

        navLinks.forEach((link) => {
            const href = link.getAttribute("href");

            link.classList.toggle(
                "active",
                href === `#${currentSection}`
            );
        });
    };

    updateActiveLink();

    window.addEventListener(
        "scroll",
        updateActiveLink,
        { passive: true }
    );
}

/* =========================================================
   THÈME
   MODE SOMBRE = MODE PAR DÉFAUT
   ========================================================= */

function getPreferredTheme() {
    const savedTheme = localStorage.getItem("komlan-theme");

    if (
        savedTheme === "light" ||
        savedTheme === "dark"
    ) {
        return savedTheme;
    }

    /* Mode sombre par défaut */
    return "dark";
}

function applyTheme(theme) {
    const isLight = theme === "light";

    document.body.classList.toggle(
        "light-mode",
        isLight
    );

    if (themeIcon) {
        themeIcon.className = isLight
            ? "fas fa-moon"
            : "fas fa-sun";
    }

    if (themeToggle) {
        themeToggle.setAttribute(
            "aria-label",
            isLight
                ? "Activer le mode sombre"
                : "Activer le mode clair"
        );

        themeToggle.setAttribute(
            "title",
            isLight
                ? "Activer le mode sombre"
                : "Activer le mode clair"
        );

        themeToggle.setAttribute(
            "aria-pressed",
            String(isLight)
        );
    }
}

function initTheme() {
    if (!themeToggle) return;

    const initialTheme = getPreferredTheme();

    applyTheme(initialTheme);

    themeToggle.addEventListener("click", () => {
        const currentTheme =
            document.body.classList.contains("light-mode")
                ? "light"
                : "dark";

        const newTheme =
            currentTheme === "dark"
                ? "light"
                : "dark";

        localStorage.setItem(
            "komlan-theme",
            newTheme
        );

        applyTheme(newTheme);
    });
}

/* =========================================================
   COMPTEURS
   ========================================================= */

function initCounters() {
    const counters = $$("[data-counter]");

    if (!counters.length) return;

    const animateCounter = (element) => {
        if (element.dataset.animated === "true") {
            return;
        }

        const target = Number(
            element.dataset.counter
        );

        if (!Number.isFinite(target)) return;

        element.dataset.animated = "true";

        const duration = 1600;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed =
                currentTime - startTime;

            const progress = Math.min(
                elapsed / duration,
                1
            );

            /* Ease-out */
            const eased =
                1 - Math.pow(1 - progress, 3);

            const currentValue =
                Math.floor(target * eased);

            element.textContent =
                currentValue.toLocaleString("fr-FR");

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent =
                    target.toLocaleString("fr-FR");
            }
        };

        requestAnimationFrame(update);
    };

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.4
            }
        );

        counters.forEach((counter) => {
            observer.observe(counter);
        });
    } else {
        counters.forEach(animateCounter);
    }
}

/* =========================================================
   ANIMATIONS AU SCROLL
   ========================================================= */

function initReveal() {
    const elements = $$(
        ".reveal, .reveal-left, .reveal-right, .fade-up"
    );

    if (!elements.length) return;

    if (!("IntersectionObserver" in window)) {
        elements.forEach((element) => {
            element.classList.add("visible");
        });

        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");

                    obs.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    elements.forEach((element) => {
        observer.observe(element);
    });
}

/* =========================================================
   FORMULAIRE WEB3FORMS
   ========================================================= */

function initContactForm() {
    if (!contactForm) return;

    let formOpenedAt = Date.now();

    contactForm.addEventListener("focusin", () => {
        if (!formOpenedAt) {
            formOpenedAt = Date.now();
        }
    });

    contactForm.addEventListener(
        "submit",
        async (event) => {
            event.preventDefault();

            /* -----------------------------------------
               Vérification HTML
            ----------------------------------------- */

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            /* -----------------------------------------
               Honeypot
            ----------------------------------------- */

            const botCheck =
                contactForm.querySelector(
                    '[name="botcheck"]'
                );

            if (
                botCheck &&
                botCheck.checked
            ) {
                return;
            }

            /* -----------------------------------------
               Protection contre soumission trop rapide
            ----------------------------------------- */

            const elapsed =
                Date.now() - formOpenedAt;

            if (elapsed < 2500) {
                showFormMessage(
                    "Veuillez prendre quelques secondes pour remplir le formulaire.",
                    "error"
                );

                return;
            }

            const submitButton =
                contactForm.querySelector(
                    'button[type="submit"]'
                );

            const originalButtonText =
                submitButton
                    ? submitButton.innerHTML
                    : "";

            if (submitButton) {
                submitButton.disabled = true;

                submitButton.innerHTML =
                    '<i class="fas fa-spinner fa-spin"></i> Envoi...';
            }

            showFormMessage(
                "Envoi de votre message...",
                "loading"
            );

            try {
                const formData =
                    new FormData(contactForm);

                const response =
                    await fetch(
                        "https://api.web3forms.com/submit",
                        {
                            method: "POST",
                            body: formData,
                            headers: {
                                Accept:
                                    "application/json"
                            }
                        }
                    );

                const result =
                    await response.json();

                if (
                    response.ok &&
                    result.success
                ) {
                    showFormMessage(
                        result.message ||
                            "Votre message a bien été envoyé. Merci !",
                        "success"
                    );

                    contactForm.reset();

                    formOpenedAt = Date.now();
                } else {
                    showFormMessage(
                        result.message ||
                            "Une erreur est survenue. Veuillez réessayer.",
                        "error"
                    );
                }
            } catch (error) {
                console.error(
                    "Erreur Web3Forms :",
                    error
                );

                showFormMessage(
                    "Impossible d'envoyer le message pour le moment. Vérifiez votre connexion puis réessayez.",
                    "error"
                );
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;

                    submitButton.innerHTML =
                        originalButtonText;
                }
            }
        }
    );
}

function showFormMessage(message, type = "success") {
    if (!formMessage) return;

    /* textContent = pas d'injection HTML */
    formMessage.textContent = message;

    formMessage.className =
        `form-message ${type}`;

    formMessage.setAttribute(
        "role",
        type === "error"
            ? "alert"
            : "status"
    );
}

/* =========================================================
   MENU WHATSAPP / SIGNAL / CALENDLY
   ========================================================= */

function initMessaging() {
    if (
        !messagingWidget ||
        !messagingButton ||
        !messagingMenu
    ) {
        return;
    }

    const closeMessaging = () => {
        messagingWidget.classList.remove(
            "open"
        );

        messagingButton.setAttribute(
            "aria-expanded",
            "false"
        );
    };

    messagingButton.addEventListener(
        "click",
        (event) => {
            event.stopPropagation();

            const isOpen =
                messagingWidget.classList.toggle(
                    "open"
                );

            messagingButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        }
    );

    messagingMenu.addEventListener(
        "click",
        (event) => {
            event.stopPropagation();
        }
    );

    document.addEventListener(
        "click",
        (event) => {
            if (
                !messagingWidget.contains(
                    event.target
                )
            ) {
                closeMessaging();
            }
        }
    );

    document.addEventListener(
        "keydown",
        (event) => {
            if (event.key === "Escape") {
                closeMessaging();
            }
        }
    );

    /* Fermer le menu après sélection */
    $$(".messaging-option", messagingMenu)
        .forEach((option) => {
            option.addEventListener(
                "click",
                () => {
                    setTimeout(
                        closeMessaging,
                        150
                    );
                }
            );
        });
}

/* =========================================================
   RETOUR EN HAUT
   ========================================================= */

function initBackTop() {
    if (!backTop) return;

    const updateBackTop = () => {
        backTop.classList.toggle(
            "visible",
            window.scrollY > 500
        );
    };

    updateBackTop();

    window.addEventListener(
        "scroll",
        updateBackTop,
        {
            passive: true
        }
    );

    backTop.addEventListener(
        "click",
        () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );
}

/* =========================================================
   ANNÉE AUTOMATIQUE
   ========================================================= */

function initYear() {
    if (!yearElement) return;

    yearElement.textContent =
        new Date().getFullYear();
}

/* =========================================================
   LIENS EXTERNES
   ========================================================= */

function initExternalLinks() {
    $$('a[target="_blank"]').forEach(
        (link) => {
            const rel =
                link.getAttribute("rel") || "";

            const values =
                new Set(
                    rel
                        .split(" ")
                        .filter(Boolean)
                );

            values.add("noopener");
            values.add("noreferrer");

            link.setAttribute(
                "rel",
                Array.from(values).join(" ")
            );
        }
    );
}

/* =========================================================
   SCROLL DOUX
   ========================================================= */

function initSmoothScroll() {
    $$('a[href^="#"]').forEach((link) => {
        link.addEventListener(
            "click",
            (event) => {
                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(
                        targetId
                    );

                if (!target) return;

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        );
    });
}

/* =========================================================
   ACCESSIBILITÉ
   ========================================================= */

function initAccessibility() {
    if (menuButton) {
        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );
    }

    if (themeToggle) {
        themeToggle.setAttribute(
            "type",
            "button"
        );
    }

    if (messagingButton) {
        messagingButton.setAttribute(
            "type",
            "button"
        );

        messagingButton.setAttribute(
            "aria-expanded",
            "false"
        );
    }
}

/* =========================================================
   INITIALISATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        initAccessibility();

        initHeader();
        initMobileMenu();
        initActiveNavigation();

        /* 🌙 Sombre par défaut */
        initTheme();

        initCounters();
        initReveal();

        initContactForm();

        /* WhatsApp / Signal / Calendly */
        initMessaging();

        initBackTop();
        initYear();

        initExternalLinks();
        initSmoothScroll();
    }
);