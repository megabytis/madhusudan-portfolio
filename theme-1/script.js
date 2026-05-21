document.addEventListener("DOMContentLoaded", () => {
    // Scroll Reveal Animation for fade-in sections
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
    
    document.querySelectorAll(".fade-in-section").forEach(section => {
        observer.observe(section);
    });

    // Typewriter effect
    const phrases = ["Backend Developer", "GenAI Enthusiast", "System Architect"];
    let currentPhraseIndex = 0;
    let isDeleting = false;
    let text = "";
    let typeSpeed = 100;
    
    const typeWriterElement = document.getElementById("typewriter");
    if(typeWriterElement) {
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
