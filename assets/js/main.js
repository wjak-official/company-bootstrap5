/**
 * Main JavaScript Module
 * Handles navbar functionality, scroll effects, and animations
 * Security: No inline event handlers, proper event delegation
 */

/**
 * Initialize navbar functionality
 */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  
  // Add shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  
  // Close mobile navbar when clicking on a link
  const navLinks = document.querySelectorAll('.nav-link');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });
  
  console.log('[Security] Navbar initialized');
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#" or empty
      if (!href || href === '#') {
        e.preventDefault();
        return;
      }
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  console.log('[Security] Smooth scroll initialized');
}

/**
 * Intersection Observer for fade-in animations
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  if (animatedElements.length === 0) return;
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
  
  console.log('[Security] Scroll animations initialized');
}

/**
 * Security logging utility
 */
function logSecurityEvent(event, details) {
  const timestamp = new Date().toISOString();
  console.log(`[Security] ${timestamp} - ${event}:`, details);
}

/**
 * Validate external links security attributes
 */
function validateExternalLinks() {
  const externalLinks = document.querySelectorAll('a[href^="http"]');
  
  externalLinks.forEach(link => {
    const href = link.getAttribute('href');
    const currentDomain = window.location.hostname;
    
    try {
      const linkUrl = new URL(href);
      
      // Only allow http and https protocols
      if (linkUrl.protocol !== 'http:' && linkUrl.protocol !== 'https:') {
        console.warn('[Security] Invalid protocol detected:', linkUrl.protocol);
        link.removeAttribute('href');
        return;
      }
      
      // If external domain, ensure security attributes
      if (linkUrl.hostname !== currentDomain) {
        if (!link.hasAttribute('rel')) {
          link.setAttribute('rel', 'noopener noreferrer');
        } else {
          const rel = link.getAttribute('rel');
          if (!rel.includes('noopener')) {
            link.setAttribute('rel', rel + ' noopener');
          }
          if (!rel.includes('noreferrer')) {
            link.setAttribute('rel', link.getAttribute('rel') + ' noreferrer');
          }
        }
        
        if (!link.hasAttribute('target')) {
          link.setAttribute('target', '_blank');
        }
      }
    } catch (error) {
      console.warn('[Security] Invalid URL:', href);
      link.removeAttribute('href');
    }
  });
  
  console.log('[Security] External links validated');
}

/**
 * Initialize all functionality
 */
function initMain() {
  console.log('[Security] Initializing main functionality...');
  
  try {
    initNavbar();
    initSmoothScroll();
    initScrollAnimations();
    validateExternalLinks();
    
    logSecurityEvent('Main initialized', 'All features loaded successfully');
  } catch (error) {
    console.error('[Security] Error initializing main:', error);
    logSecurityEvent('Initialization error', error.message);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMain);
} else {
  initMain();
}

// Export utility functions
window.logSecurityEvent = logSecurityEvent;
