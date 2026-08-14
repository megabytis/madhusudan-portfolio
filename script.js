document.addEventListener("DOMContentLoaded", () => {
    // Scroll Reveal Animation using vanilla IntersectionObserver
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe fade-in sections, hero stagger items, and timeline items
    document.querySelectorAll(".fade-in-section, .hero-stagger, .timeline-item").forEach(el => {
        observer.observe(el);
    });

    // Project cards staggered reveal (index * 0.1s)
    const projectCards = document.querySelectorAll(".project-card");
    projectCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Typewriter effect
    const phrases = ["Backend Engineer", "AI Systems Architecture", "Node.js & Python Specialist"];
    let currentPhraseIndex = 0;
    let isDeleting = false;
    let text = "";
    let typeSpeed = 100;
    
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
            
            typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && text === currentPhrase) {
                typeSpeed = 1500; // Pause at end
                isDeleting = true;
            } else if (isDeleting && text === "") {
                isDeleting = false;
                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                typeSpeed = 500; // Pause before typing next
            }
            
            setTimeout(type, typeSpeed);
        }
        
        setTimeout(type, 1000);
    }
});
