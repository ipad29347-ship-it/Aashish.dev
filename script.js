// Loading Screen Logic
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.remove();
    }, 500); // Wait for the CSS transition to finish before removing
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("year").textContent = new Date().getFullYear();

  // Logo click to scroll top
  const logo = document.querySelector(".logo");
  logo.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  mobileMenuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });

  // Header scroll effect and Back to Top
  const header = document.querySelector("header");
  const backToTop = document.getElementById("backToTop");
  
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    if (window.scrollY > 500) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // Cursor Glow & Custom Cursor
  const cursorGlow = document.querySelector(".cursor-glow");
  const customCursor = document.querySelector(".custom-cursor");
  
  if (cursorGlow || customCursor) {
    document.addEventListener("mousemove", (e) => {
      if (cursorGlow) {
        cursorGlow.style.opacity = "1";
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
      }
      if (customCursor) {
        customCursor.style.opacity = "1";
        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;
      }
    });

    document.addEventListener("mouseleave", () => {
      if (cursorGlow) cursorGlow.style.opacity = "0";
      if (customCursor) customCursor.style.opacity = "0";
    });
  }

  // Hover effect for custom cursor
  const interactables = document.querySelectorAll('a, button, input, textarea, .project-card, .social-icon');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => customCursor?.classList.add('hovering'));
    el.addEventListener('mouseleave', () => customCursor?.classList.remove('hovering'));
  });

  // Click Ripple Effect
  document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.classList.add('click-ripple');
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);

    // Remove ripple after animation completes
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });

  // Project Card Spotlight Effect
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // Parallax Background Words
  const bgWords = document.querySelectorAll('.bg-words span');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    bgWords.forEach((word, index) => {
      const speed = 0.05 + (index % 4) * 0.03;
      word.style.marginTop = `-${scrollY * speed}px`;
    });
  });

  // Intersection Observer for Scroll Animations
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        // Handle staggered children if any
        const staggerItems = entry.target.querySelectorAll(".stagger-item");
        staggerItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add("visible");
          }, index * 150); // 150ms delay between each item
        });

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".section-reveal").forEach((section) => {
    revealObserver.observe(section);
  });

  // Active Nav Link Highlight
  const sections = document.querySelectorAll("section");
  const navItems = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute("id");
      }
    });

    navItems.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(current)) {
        link.classList.add("active");
      }
    });
  });

  // Form Submission
  const contactForm = document.getElementById("contactForm");
  const submitBtn = contactForm.querySelector(".submit-btn");
  const btnText = submitBtn.querySelector(".btn-text");
  const loader = submitBtn.querySelector(".loader");
  const formStatus = document.getElementById("formStatus");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    // Basic client-side validation
    if (!data.name.trim() || !data.email.trim() || !data.message.trim()) {
      showStatus("Please fill out all required fields.", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showStatus("Please enter a valid email address.", "error");
      return;
    }

    // Update UI to loading state
    btnText.style.display = "none";
    loader.style.display = "block";
    submitBtn.disabled = true;
    formStatus.classList.remove("show", "success", "error");

    try {
      const response = await fetch("https://formspree.io/f/mvzwjnoe", {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: formData,
      });

      if (response.ok) {
        showStatus(
          "Message sent successfully! I will get back to you soon.",
          "success",
        );
        contactForm.reset();
      } else {
        throw new Error(`Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showStatus(
        `Failed to send message. ${error.message || "Please try again later."}`,
        "error",
      );
    } finally {
      // Restore UI
      btnText.style.display = "block";
      loader.style.display = "none";
      submitBtn.disabled = false;
    }
  });

  function showStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    // Small delay to allow display:block to apply before opacity transition
    setTimeout(() => {
      formStatus.classList.add("show");
    }, 10);

    // Auto hide after 5 seconds
    setTimeout(() => {
      formStatus.classList.remove("show");
    }, 5000);
  }

  // Copy to Clipboard Functionality
  const copyableItems = document.querySelectorAll(".copyable");

  copyableItems.forEach((item) => {
    item.addEventListener("click", () => {
      const textToCopy = item.getAttribute("data-copy");
      const badge = item.querySelector(".copy-badge");

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          const originalText = badge.textContent;
          badge.textContent = "Copied!";
          badge.classList.add("copied");

          setTimeout(() => {
            badge.textContent = originalText;
            badge.classList.remove("copied");
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    });
  });
});
