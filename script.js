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


/* =====================================================
   CONTACT FORM - WEB3FORMS
===================================================== */

const contactForm =
    document.getElementById("contactForm");

const formMessage =
    document.getElementById("formMessage");

const submitButton =
    document.getElementById("submitButton");


if (contactForm) {

    contactForm.addEventListener("submit", async function(event) {

        event.preventDefault();


        /* État du bouton */

        submitButton.disabled = true;

        submitButton.innerHTML = `
            <span>Envoi en cours...</span>
            <i class="fa-solid fa-spinner fa-spin"></i>
        `;


        formMessage.className =
            "form-message loading";

        formMessage.textContent =
            "Votre message est en cours d'envoi...";


        try {

            const formData =
                new FormData(contactForm);


            const response =
                await fetch(
                    contactForm.action,
                    {
                        method: "POST",
                        body: formData,
                        headers: {
                            "Accept": "application/json"
                        }
                    }
                );


            const data =
                await response.json();


            if (response.ok) {

                formMessage.className =
                    "form-message success";

                formMessage.innerHTML = `
                    <i class="fa-solid fa-circle-check"></i>
                    Merci ! Votre message a bien été envoyé.
                    Je vous répondrai dans les meilleurs délais.
                `;


                contactForm.reset();


            } else {

                throw new Error(
                    data.message ||
                    "Une erreur est survenue."
                );

            }


        } catch (error) {

            console.error(error);


            formMessage.className =
                "form-message error";

            formMessage.innerHTML = `
                <i class="fa-solid fa-circle-exclamation"></i>
                Impossible d'envoyer le message.
                Veuillez réessayer ou me contacter directement
                sur WhatsApp.
            `;

        }


        /* Restaurer le bouton */

        submitButton.disabled = false;

        submitButton.innerHTML = `
            <span>Envoyer le message</span>
            <i class="fa-solid fa-paper-plane"></i>
        `;


        /* Masquer le message après 7 secondes */

        setTimeout(() => {

            formMessage.textContent = "";

            formMessage.className =
                "form-message";

        }, 7000);

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