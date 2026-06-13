import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Progress Indicator
  const progressBar = document.getElementById('scroll-progress');
  const updateProgressBar = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const percentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
    }
  };

  window.addEventListener('scroll', updateProgressBar, { passive: true });
  updateProgressBar(); // Initial check

  // 2. Intersection Observer for Cinematic Fade Reveals
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserverOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -80px 0px' // Triggers slightly before the element enters the viewport
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Trigger only once for cleaner editorial feel
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // 3. Smooth Anchor Scrolling with Sticky Header Offset
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const header = document.querySelector('.header');
  const headerHeight = header ? header.offsetHeight : 80;

  anchorLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update active class on nav links
        anchorLinks.forEach(lnk => lnk.classList.remove('active'));
        if (this.classList.contains('nav-link')) {
          this.classList.add('active');
        }
      }
    });
  });

  // 4. Highlight Nav Links on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + headerHeight + 150; // buffer

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // 5. Hero Title Typing Animation in Loop
  const typingElement = document.getElementById('typing-hero');
  if (typingElement) {
    const text = 'SHIVANSH';
    let isDeleting = false;
    let charIndex = 0;
    
    const type = () => {
      const currentText = text.substring(0, charIndex);
      typingElement.textContent = currentText;
      
      let typeSpeed = isDeleting ? 100 : 200;
      
      if (!isDeleting && charIndex === text.length) {
        // Pause at full word
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        // Pause at empty word before typing again
        typeSpeed = 800;
        isDeleting = false;
      }
      
      charIndex += isDeleting ? -1 : 1;
      setTimeout(type, typeSpeed);
    };
    
    // Start typing loop
    type();
  }

  // 6. Custom Cursor Glow Tracking
  const cursorGlow = document.querySelector('.cursor-glow');
  if (cursorGlow) {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorGlow.style.opacity = '1';
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });

    const updateGlow = () => {
      // Smooth interpolation (lerp) for trailing effect
      const ease = 0.15;
      currentX += (mouseX - currentX) * ease;
      currentY += (mouseY - currentY) * ease;
      
      cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(updateGlow);
    };

    updateGlow();
  }
});
