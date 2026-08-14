document.addEventListener("DOMContentLoaded", () => {
    // 1. Mouse position tracking for Spotlight Card Glow Effect
    const cards = document.querySelectorAll(".spotlight-card");
    cards.forEach(card => {
        card.addEventListener("mousemove", e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });

    // 2. Scroll Reveal Animations via IntersectionObserver
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.12
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(".fade-in-section, .hero-stagger, .timeline-item").forEach(el => {
        observer.observe(el);
    });

    // Staggered reveal for Hero elements on load
    const heroElements = document.querySelectorAll(".hero-stagger");
    heroElements.forEach((el, idx) => {
        setTimeout(() => {
            el.classList.add("visible");
        }, 100 + idx * 120);
    });

    // 3. Floating Navbar Active Link ScrollSpy
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links .nav-link");

    const scrollSpyOptions = {
        root: null,
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0
    };

    const scrollSpyObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                navLinks.forEach(link => {
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    } else {
                        link.classList.remove("active");
                    }
                });
            }
        });
    }, scrollSpyOptions);

    sections.forEach(section => {
        scrollSpyObserver.observe(section);
    });

    // 4. Typewriter Effect
    const phrases = [
        "Full Stack & GenAI Engineer",
        "Node.js & Python Specialist",
        "LangGraph Agent Architect",
        "High-Concurrency REST APIs"
    ];
    let currentPhraseIndex = 0;
    let isDeleting = false;
    let text = "";
    let typeSpeed = 90;

    const typeWriterElement = document.getElementById("typewriter");
    if (typeWriterElement) {
        function type() {
            const currentPhrase = phrases[currentPhraseIndex];

            if (isDeleting) {
                text = currentPhrase.substring(0, text.length - 1);
            } else {
                text = currentPhrase.substring(0, text.length + 1);
            }

            typeWriterElement.textContent = text;

            typeSpeed = isDeleting ? 40 : 90;

            if (!isDeleting && text === currentPhrase) {
                typeSpeed = 1600; // Pause at end
                isDeleting = true;
            } else if (isDeleting && text === "") {
                isDeleting = false;
                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                typeSpeed = 400; // Pause before typing next
            }

            setTimeout(type, typeSpeed);
        }

        setTimeout(type, 800);
    }

    // 5. Dynamic Current Year
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
