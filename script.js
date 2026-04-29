document.addEventListener("DOMContentLoaded", () => {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".fade-in-section").forEach((section) => {
    observer.observe(section);
  });

  // Spotlight Effect for Cards
  const cards = document.querySelectorAll(".project-card");

  document.addEventListener("mousemove", (e) => {
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  // Scroll Progress Bar
  const scrollProgress = document.getElementById("scroll-progress");
  window.addEventListener("scroll", () => {
    const totalScroll = document.documentElement.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scroll = `${(totalScroll / windowHeight) * 100}%`;
    if (scrollProgress) scrollProgress.style.width = scroll;
  });

  // Typewriter Effect
  const typewriterElement = document.getElementById("typewriter");
  if (typewriterElement) {
    const phrases = [
      "Backend & GenAI Developer",
      "Building APIs & AI-powered systems",
      "Node.js & Python Integrator"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
      const currentPhrase = phrases[phraseIndex];
      
      if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 1500; // Pause at end of phrase
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500; // Pause before new phrase
      }

      setTimeout(type, typingSpeed);
    }
    
    // Start typing
    setTimeout(type, 1000);
  }
});
