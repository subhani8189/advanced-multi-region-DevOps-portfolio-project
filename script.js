// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Scroll Progress Bar
  const scrollProgress = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScroll > 0) {
      const percentage = (window.scrollY / totalScroll) * 100;
      scrollProgress.style.width = percentage + '%';
    }
  });

  // 2. Header Style & Active Nav Tracker
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    // Add border and background blur on scroll
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Highlight active nav item
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // 3. Mobile Navigation Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const icon = menuToggle.querySelector('i');
    if (navMenu.classList.contains('open')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
    } else {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }
  });

  // Close menu when clicking nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      const icon = menuToggle.querySelector('i');
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    });
  });

  // 4. Skills Filtering System
  const tabButtons = document.querySelectorAll('.tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');
  
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      // Filter cards
      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 5. Scroll Reveal Animation using IntersectionObserver
  const revealSections = document.querySelectorAll('.fade-in-section');
  
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Trigger once
      }
    });
  }, {
    threshold: 0.15
  });
  
  revealSections.forEach(section => {
    sectionObserver.observe(section);
  });

  // 6. Resume Export / Print Event Handler
  const resumeBtn = document.getElementById('btn-cta-resume');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      // Direct print layout trigger
      window.print();
    });
  }

  // 7. LinkedIn Post Carousel Slider
  const slider = document.getElementById('linkedin-slider');
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  
  if (slider && slides.length > 0) {
    let currentSlide = 0;
    const slideCount = slides.length;
    
    function updateSlider() {
      // Translate the slider container
      slider.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Toggle active classes on slides
      slides.forEach((slide, idx) => {
        if (idx === currentSlide) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
      
      // Toggle active classes on dots
      dots.forEach((dot, idx) => {
        if (idx === currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
    
    function nextSlide() {
      currentSlide = (currentSlide + 1) % slideCount;
      updateSlider();
    }
    
    function prevSlide() {
      currentSlide = (currentSlide - 1 + slideCount) % slideCount;
      updateSlider();
    }
    
    // Set up click events for arrows
    if (nextBtn && prevBtn) {
      nextBtn.addEventListener('click', nextSlide);
      prevBtn.addEventListener('click', prevSlide);
    }
    
    // Set up click events for dots
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        currentSlide = parseInt(e.target.getAttribute('data-index'));
        updateSlider();
      });
    });
    
    // Auto-slide every 6 seconds
    let autoSlideInterval = setInterval(nextSlide, 6000);
    
    // Pause auto-sliding on hover
    const sliderWrapper = document.querySelector('.slider-wrapper');
    if (sliderWrapper) {
      sliderWrapper.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
      });
      sliderWrapper.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(nextSlide, 6000);
      });
    }
  }
});
