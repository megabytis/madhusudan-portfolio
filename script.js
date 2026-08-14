document.addEventListener("DOMContentLoaded", () => {
    // 1. Project Modal Data Store
    const projectDataMap = {
        "project-kyh": {
            badge: "Flagship Agent Architecture",
            title: "Project KYH — AI Fitness Agent",
            subtitle: "Asynchronous multi-agent health coach using LangGraph, orchestrating 7 graph nodes and microservices deployed on AWS EC2.",
            img: "img/project-kyh-ui.png",
            highlights: [
                "Architected an asynchronous multi-agent health coach utilizing LangGraph, orchestrating 7 discrete graph nodes and conditional subgraphs to decouple intake tracking from macro planning logic.",
                "Containerized and orchestrated split Node.js and Python microservices alongside persistent state layers via Docker Compose, deploying the multi-runtime system onto a dedicated AWS EC2 cloud instance.",
                "Implemented multi-day user session persistence using LangGraph checkpointing synced with MongoDB Atlas to track and evaluate dietary behavior trends across a 30-day window."
            ],
            tags: ["Python", "LangGraph", "Node.js", "Docker Compose", "AWS EC2", "MongoDB Atlas"],
            demoLink: "https://kyh.bhuktatech.in/",
            githubLink: "https://github.com/megabytis/project-kyh"
        },
        "rag-documentqna": {
            badge: "RAG Document Intelligence",
            title: "RAG-DocumentQnA — AI Search System",
            subtitle: "Dual-service architecture supporting multi-format document parsing with Hybrid Search and Cross-Encoder re-ranking.",
            img: "img/RAG_documenQnA.gif",
            highlights: [
                "Built dual-service architecture (Node.js API gateway + Python AI backend) supporting PDF, TXT, and DOCX parsing with per-user session isolation.",
                "Reduced LLM hallucinations by implementing Hybrid Search (Dense embeddings + BM25 sparse search) with a Cross-Encoder re-ranker, improving retrieval precision across document queries."
            ],
            tags: ["Node.js", "Python", "ChromaDB", "LangChain", "Hybrid Search", "BM25", "Cross-Encoders"],
            demoLink: "https://github.com/megabytis/RAG-DocumentQnA",
            githubLink: "https://github.com/megabytis/RAG-DocumentQnA"
        },
        "shopnexus": {
            badge: "3.1k+ req/s Micro-Burst Benchmark",
            title: "ShopNexus — High-Concurrency E-Commerce",
            subtitle: "High-concurrency backend system load-tested under micro-burst concurrency with Stripe payment lifecycle and RBAC.",
            img: "img/shopnexus-ui.png",
            highlights: [
                "Load-tested with k6 at 3,100+ requests under peak 50 virtual user concurrency to identify database bottlenecks and infrastructure compute constraints.",
                "Built complete Stripe payment lifecycle (checkout, webhooks, refunds) with idempotency handling and 12+ domain-driven MongoDB models.",
                "Implemented JWT authentication with refresh token rotation, RBAC middleware, and rate limiting across 25+ API routes."
            ],
            tags: ["Node.js", "Express", "MongoDB", "Redis", "Stripe", "k6 Load Testing"],
            demoLink: "https://shop-nexus-beta.vercel.app",
            githubLink: "https://github.com/megabytis/shopnexus"
        },
        "devtinder": {
            badge: "Developer Matchmaking System",
            title: "DevTinder — Developer Matchmaking",
            subtitle: "Full-stack developer networking application enabling profile discovery and connection request lifecycles.",
            img: "",
            highlights: [
                "Engineered matchmaking request pipeline (send, accept, ignore) with indexed MongoDB query filtering.",
                "Implemented secure JWT authentication cookies, refresh token rotation, and sanitized user profile schemas."
            ],
            tags: ["Node.js", "Express", "MongoDB", "React", "JWT & RBAC"],
            demoLink: "https://github.com/megabytis",
            githubLink: "https://github.com/megabytis"
        },
        "learnsphere": {
            badge: "EdTech Learning Engine",
            title: "LearnSphere — Interactive Course Platform",
            subtitle: "Interactive learning management backend for course distribution and student progress tracking.",
            img: "",
            highlights: [
                "Designed modular RESTful endpoints for lesson sequencing and real-time student progress state updates.",
                "Optimized MongoDB schema architecture for sub-50ms query response times across course structures and user stats."
            ],
            tags: ["Node.js", "Express", "MongoDB", "REST APIs"],
            demoLink: "https://github.com/megabytis",
            githubLink: "https://github.com/megabytis"
        }
    };

    // Modal Drawer Logic
    const modalOverlay = document.getElementById("project-modal");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modalBadge = document.getElementById("modal-badge");
    const modalTitle = document.getElementById("modal-title");
    const modalSubtitle = document.getElementById("modal-subtitle");
    const modalPreviewContainer = document.getElementById("modal-preview-container");
    const modalImg = document.getElementById("modal-img");
    const modalHighlights = document.getElementById("modal-highlights");
    const modalTags = document.getElementById("modal-tags");
    const modalActions = document.getElementById("modal-actions");

    function openModal(projectId) {
        const data = projectDataMap[projectId];
        if (!data) return;

        modalBadge.textContent = data.badge;
        modalTitle.textContent = data.title;
        modalSubtitle.textContent = data.subtitle;

        if (data.img) {
            modalImg.src = data.img;
            modalImg.alt = data.title;
            modalPreviewContainer.style.display = "block";
        } else {
            modalPreviewContainer.style.display = "none";
        }

        modalHighlights.innerHTML = data.highlights.map(h => `<li>${h}</li>`).join("");
        modalTags.innerHTML = data.tags.map(t => `<span class="tech-tag">${t}</span>`).join("");

        modalActions.innerHTML = `
            ${data.demoLink ? `<a href="${data.demoLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Live Demo ↗</a>` : ''}
            ${data.githubLink ? `<a href="${data.githubLink}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">GitHub Source ↗</a>` : ''}
        `;

        modalOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        modalOverlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    document.querySelectorAll(".open-modal-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const projectId = btn.getAttribute("data-project-id");
            openModal(projectId);
        });
    });

    document.querySelectorAll(".project-flagship-card, .project-grid-card").forEach(card => {
        card.addEventListener("click", () => {
            const projectId = card.getAttribute("data-project-id");
            if (projectId) openModal(projectId);
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
            closeModal();
        }
    });

    // 2. Dynamic Spotlight Cursor & 3D Tilt Micro-Interaction
    const spotlightCards = document.querySelectorAll(
        ".hero-stat-card, .hero-image-wrapper, .project-flagship-card, .project-grid-card, .spotlight-card, .bento-card, .timeline-content-card, .terminal-card"
    );

    spotlightCards.forEach(card => {
        card.addEventListener("mousemove", e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -3; // Max 3 deg
            const rotateY = ((x - centerX) / centerX) * 3;  // Max 3 deg

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
        });
    });

    // 3. Scroll Reveal Animations via IntersectionObserver
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

    // Hero staggered reveal on load
    const heroElements = document.querySelectorAll(".hero-stagger");
    heroElements.forEach((el, idx) => {
        setTimeout(() => {
            el.classList.add("visible");
        }, 100 + idx * 100);
    });

    // 4. Floating Navbar Active Link ScrollSpy
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

    // 5. Typewriter Effect
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

    // 6. Dynamic Current Year
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
