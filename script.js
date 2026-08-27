/* =====================================================
   KOMLAN MISSODEY PORTFOLIO
===================================================== */


/* =====================================================
   HEADER SCROLL
===================================================== */

const header = document.getElementById("header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});


/* =====================================================
   MENU MOBILE
===================================================== */

const menuButton =
    document.getElementById("menuButton");

const nav =
    document.querySelector(".nav");


menuButton.addEventListener("click", () => {

    nav.classList.toggle("open");

    const icon =
        menuButton.querySelector("i");

    if (nav.classList.contains("open")) {

        icon.classList.remove("fa-bars");

        icon.classList.add("fa-xmark");

    } else {

        icon.classList.remove("fa-xmark");

        icon.classList.add("fa-bars");

    }

});


/* Fermer le menu */

document.querySelectorAll(".nav-link")
    .forEach(link => {

        link.addEventListener("click", () => {

            nav.classList.remove("open");

            const icon =
                menuButton.querySelector("i");

            icon.classList.remove("fa-xmark");

            icon.classList.add("fa-bars");

        });

    });


/* =====================================================
   ACTIVE NAVIGATION
===================================================== */

const sections =
    document.querySelectorAll("section[id]");

const navLinks =
    document.querySelectorAll(".nav-link");


window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY <
            sectionTop + section.offsetHeight
        ) {

            current =
                section.getAttribute("id");

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            `#${current}`
        ) {

            link.classList.add("active");

        }

    });

});


/* =====================================================
   COMPTEURS
===================================================== */

const counters =
    document.querySelectorAll(".counter");


let counterStarted = false;


function startCounters() {

    if (counterStarted) return;

    counterStarted = true;


    counters.forEach(counter => {

        const target =
            Number(counter.dataset.target);

        let current = 0;

        const increment =
            target / 80;


        function update() {

            current += increment;

            if (current < target) {

                counter.textContent =
                    Math.ceil(current);

                requestAnimationFrame(update);

            } else {

                counter.textContent =
                    target;

            }

        }


        update();

    });

}


const aboutSection =
    document.querySelector("#apropos");


const counterObserver =
    new IntersectionObserver(
        entries => {

            if (entries[0].isIntersecting) {

                startCounters();

                counterObserver.disconnect();

            }

        },
        {
            threshold: .3
        }
    );


counterObserver.observe(aboutSection);


/* =====================================================
   SCROLL REVEAL
===================================================== */

const revealElements =
    document.querySelectorAll(
        ".skill-card, .project-card, .certificate, .timeline-item, .about-card"
    );


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";

                    entry.target.style.transform =
                        "translateY(0)";

                    revealObserver
                        .unobserve(entry.target);

                }

            });

        },
        {
            threshold: .12
        }
    );


revealElements.forEach(element => {

    element.style.opacity = "0";

    element.style.transform =
        "translateY(25px)";

    element.style.transition =
        "opacity .7s ease, transform .7s ease";

    revealObserver.observe(element);

});


/* ==========================================
   FORMULAIRE DE CONTACT - WEB3FORMS
========================================== */

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const submitButton = document.getElementById("submitButton");

if (contactForm) {

    contactForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        // État du bouton
        submitButton.disabled = true;

        submitButton.innerHTML = `
            <span>Envoi en cours...</span>
            <i class="fa-solid fa-spinner fa-spin"></i>
        `;

        formMessage.className = "form-message loading";
        formMessage.innerHTML = "Envoi de votre message...";

        try {

            // Récupération des données du formulaire
            const formData = new FormData(contactForm);

            // Conversion en objet JSON
            const object = Object.fromEntries(formData);

            const json = JSON.stringify(object);

            // Envoi vers Web3Forms
            const response = await fetch(
                "https://api.web3forms.com/submit",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },

                    body: json
                }
            );

            const result = await response.json();

            console.log("Réponse Web3Forms :", result);

            if (response.status === 200) {

                formMessage.className =
                    "form-message success";

                formMessage.innerHTML = `
                    <i class="fa-solid fa-circle-check"></i>
                    ${result.message || "Votre message a bien été envoyé !"}
                `;

                contactForm.reset();

            } else {

                formMessage.className =
                    "form-message error";

                formMessage.innerHTML = `
                    <i class="fa-solid fa-circle-exclamation"></i>
                    ${result.message || "Une erreur est survenue lors de l'envoi."}
                `;

            }

        } catch (error) {

            console.error(
                "Erreur Web3Forms :",
                error
            );

            formMessage.className =
                "form-message error";

            formMessage.innerHTML = `
                <i class="fa-solid fa-circle-exclamation"></i>
                Une erreur de connexion est survenue.
                Vérifiez votre connexion Internet et réessayez.
            `;

        }

        // Restaurer le bouton
        submitButton.disabled = false;

        submitButton.innerHTML = `
            <span>Envoyer le message</span>
            <i class="fa-solid fa-paper-plane"></i>
        `;

    });

}

/* =====================================================
   BACK TO TOP
===================================================== */

const backTop =
    document.getElementById("backTop");


window.addEventListener("scroll", () => {

    if (window.scrollY > 600) {

        backTop.classList.add("show");

    } else {

        backTop.classList.remove("show");

    }

});


backTop.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});


/* =====================================================
   ANNÉE AUTOMATIQUE
===================================================== */

document.getElementById("year").textContent =
    new Date().getFullYear();

    /* =====================================================
   MESSAGERIE FLOTTANTE
===================================================== */

const messagingWidget =
    document.getElementById("messagingWidget");

const messagingButton =
    document.getElementById("messagingButton");


if (messagingButton && messagingWidget) {

    messagingButton.addEventListener("click", () => {

        messagingWidget.classList.toggle("open");


        const isOpen =
            messagingWidget.classList.contains("open");


        messagingButton.setAttribute(
            "aria-expanded",
            isOpen
        );


        const icon =
            messagingButton.querySelector("i");


        if (isOpen) {

            icon.classList.remove(
                "fa-comments"
            );

            icon.classList.add(
                "fa-xmark"
            );

        } else {

            icon.classList.remove(
                "fa-xmark"
            );

            icon.classList.add(
                "fa-comments"
            );

        }

    });


    /* Fermer si on clique ailleurs */

    document.addEventListener("click", event => {

        if (
            !messagingWidget.contains(event.target)
        ) {

            messagingWidget.classList.remove(
                "open"
            );


            messagingButton.setAttribute(
                "aria-expanded",
                "false"
            );


            const icon =
                messagingButton.querySelector("i");


            icon.classList.remove(
                "fa-xmark"
            );

            icon.classList.add(
                "fa-comments"
            );

        }

    });

}

/* =====================================================
   MODE SOMBRE / MODE CLAIR
===================================================== */

const themeToggle =
    document.getElementById("themeToggle");


if (themeToggle) {

    const themeIcon =
        themeToggle.querySelector("i");


    /* =================================================
       CHARGER LE THEME SAUVEGARDE
    ================================================= */

    const savedTheme =
        localStorage.getItem("portfolio-theme");


    if (savedTheme === "light") {

        document.body.classList.add("light-mode");

    }


    /* =================================================
       METTRE A JOUR L'ICONE
    ================================================= */

    function updateThemeIcon() {

        if (
            document.body.classList.contains(
                "light-mode"
            )
        ) {

            themeIcon.className =
                "fa-solid fa-moon";

            themeToggle.setAttribute(
                "aria-label",
                "Activer le mode sombre"
            );

            themeToggle.setAttribute(
                "title",
                "Mode sombre"
            );

        } else {

            themeIcon.className =
                "fa-solid fa-sun";

            themeToggle.setAttribute(
                "aria-label",
                "Activer le mode clair"
            );

            themeToggle.setAttribute(
                "title",
                "Mode clair"
            );

        }

    }


    /* =================================================
       INITIALISATION
    ================================================= */

    updateThemeIcon();


    /* =================================================
       CHANGEMENT DE THEME
    ================================================= */

    themeToggle.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "light-mode"
            );


            const isLight =
                document.body.classList.contains(
                    "light-mode"
                );


            /* Sauvegarder */

            localStorage.setItem(
                "portfolio-theme",
                isLight
                    ? "light"
                    : "dark"
            );


            /* Actualiser l'icone */

            updateThemeIcon();

        }
    );

}