/**
 * Components Module
 * Handles loading header/footer components and content.json data
 * Implements security features: HTML sanitization, XSS prevention
 */

let siteContent = null;

/**
 * HTML Escape - Prevent XSS by escaping HTML special characters
 */
function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;'
  };
  return text.replace(/[&<>"'\/]/g, (char) => map[char]);
}

/**
 * Sanitize HTML - Remove potentially dangerous HTML elements and attributes
 */
function sanitizeHtml(html) {
  if (typeof html !== 'string') return '';
  
  // Remove script tags and their content (handles variations with spaces)
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>/gi, '');
  
  // Remove event handlers (onclick, onerror, etc.)
  // More comprehensive pattern to catch variations
  html = html.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  html = html.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');
  
  // Remove javascript:, data:, and vbscript: protocols
  html = html.replace(/javascript\s*:/gi, 'blocked:');
  html = html.replace(/data\s*:/gi, 'blocked:');
  html = html.replace(/vbscript\s*:/gi, 'blocked:');
  
  return html;
}

/**
 * Load and inject header component
 */
async function loadHeader() {
  try {
    const response = await fetch('includes/header.html');
    if (!response.ok) {
      throw new Error(`Failed to load header: ${response.status}`);
    }
    
    const headerHtml = await response.text();
    const headerPlaceholder = document.getElementById('header-placeholder');
    
    if (headerPlaceholder) {
      headerPlaceholder.innerHTML = sanitizeHtml(headerHtml);
    }
    
    console.log('[Security] Header loaded and sanitized');
  } catch (error) {
    console.error('[Security] Error loading header:', error);
    // Fallback header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
      headerPlaceholder.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
          <div class="container">
            <a class="navbar-brand" href="index.html">
              <i class="bi bi-shield-check"></i> Ifreelance4u
            </a>
          </div>
        </nav>
      `;
    }
  }
}

/**
 * Load and inject footer component
 */
async function loadFooter() {
  try {
    const response = await fetch('includes/footer.html');
    if (!response.ok) {
      throw new Error(`Failed to load footer: ${response.status}`);
    }
    
    const footerHtml = await response.text();
    const footerPlaceholder = document.getElementById('footer-placeholder');
    
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = sanitizeHtml(footerHtml);
    }
    
    console.log('[Security] Footer loaded and sanitized');
  } catch (error) {
    console.error('[Security] Error loading footer:', error);
    // Fallback footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = `
        <footer class="bg-dark text-white py-4 mt-5">
          <div class="container">
            <p class="text-center mb-0">© 2026 Ifreelance4u. All rights reserved.</p>
          </div>
        </footer>
      `;
    }
  }
}

/**
 * Load and validate content.json
 */
async function loadContent() {
  try {
    const response = await fetch('data/content.json');
    if (!response.ok) {
      throw new Error(`Failed to load content: ${response.status}`);
    }
    
    const content = await response.json();
    
    // Validate JSON structure
    if (!content || typeof content !== 'object') {
      throw new Error('Invalid content structure');
    }
    
    if (!content.site || !content.navigation) {
      throw new Error('Missing required content fields');
    }
    
    siteContent = content;
    console.log('[Security] Content loaded and validated');
    
    // Populate navigation
    populateNavigation();
    
    // Populate footer
    populateFooter();
    
    // Update meta tags
    updateMetaTags();
    
    // Dispatch custom event to notify other scripts
    document.dispatchEvent(new CustomEvent('contentLoaded', { detail: content }));
    
    return content;
  } catch (error) {
    console.error('[Security] Error loading content:', error);
    
    // Fallback content
    siteContent = {
      site: {
        title: 'Ifreelance4u',
        email: 'info.ifreelance4u@gmail.com'
      },
      navigation: [],
      social: {},
      footer: {
        copyright: '© 2026 Ifreelance4u. All rights reserved.',
        links: []
      }
    };
    
    document.dispatchEvent(new CustomEvent('contentLoaded', { detail: siteContent }));
    return siteContent;
  }
}

/**
 * Populate navigation menu
 */
function populateNavigation() {
  if (!siteContent || !siteContent.navigation) return;
  
  const navMenu = document.getElementById('nav-menu');
  if (!navMenu) return;
  
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  navMenu.innerHTML = '';
  
  siteContent.navigation.forEach(item => {
    const li = document.createElement('li');
    li.className = 'nav-item';
    
    const a = document.createElement('a');
    a.className = 'nav-link';
    a.href = escapeHtml(item.href);
    a.textContent = escapeHtml(item.name);
    
    // Set active state
    if (item.href === currentPage || 
        (currentPage === '' && item.href === 'index.html')) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
    
    li.appendChild(a);
    navMenu.appendChild(li);
  });
  
  console.log('[Security] Navigation populated with sanitized content');
}

/**
 * Populate footer content
 */
function populateFooter() {
  if (!siteContent || !siteContent.footer) return;
  
  // Update copyright
  const copyrightEl = document.getElementById('footer-copyright');
  if (copyrightEl) {
    copyrightEl.textContent = escapeHtml(siteContent.footer.copyright);
  }
  
  // Update footer links
  const footerLinks = document.getElementById('footer-links');
  if (footerLinks && siteContent.footer.links) {
    footerLinks.innerHTML = '';
    
    siteContent.footer.links.forEach(link => {
      const li = document.createElement('li');
      li.className = 'list-inline-item';
      
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = escapeHtml(link.name);
      
      li.appendChild(a);
      footerLinks.appendChild(li);
    });
  }
  
  // Update social links
  const footerSocial = document.getElementById('footer-social');
  if (footerSocial && siteContent.social) {
    footerSocial.innerHTML = '';
    
    const socialDiv = document.createElement('div');
    socialDiv.className = 'social-links justify-content-center';
    
    const socialLinks = [
      { name: 'GitHub', icon: 'github', url: siteContent.social.github },
      { name: 'LinkedIn', icon: 'linkedin', url: siteContent.social.linkedin },
      { name: 'Twitter', icon: 'twitter', url: siteContent.social.twitter },
      { name: 'Email', icon: 'envelope', url: siteContent.social.email }
    ];
    
    socialLinks.forEach(social => {
      if (social.url) {
        const a = document.createElement('a');
        a.href = escapeHtml(social.url);
        a.className = 'social-link';
        a.setAttribute('aria-label', social.name);
        a.setAttribute('rel', 'noopener noreferrer');
        if (!social.url.startsWith('mailto:')) {
          a.setAttribute('target', '_blank');
        }
        
        const i = document.createElement('i');
        i.className = `bi bi-${social.icon}`;
        
        a.appendChild(i);
        socialDiv.appendChild(a);
      }
    });
    
    footerSocial.appendChild(socialDiv);
  }
  
  console.log('[Security] Footer populated with sanitized content');
}

/**
 * Update meta tags from content
 */
function updateMetaTags() {
  if (!siteContent || !siteContent.site) return;
  
  // Update title if not already set
  const titleEl = document.querySelector('title');
  if (titleEl && !titleEl.textContent.trim()) {
    titleEl.textContent = escapeHtml(siteContent.site.title);
  }
  
  // Update description
  const descEl = document.querySelector('meta[name="description"]');
  if (descEl && siteContent.site.description) {
    descEl.setAttribute('content', escapeHtml(siteContent.site.description));
  }
  
  // Update keywords
  const keywordsEl = document.querySelector('meta[name="keywords"]');
  if (keywordsEl && siteContent.site.keywords) {
    keywordsEl.setAttribute('content', escapeHtml(siteContent.site.keywords));
  }
  
  // Update author
  const authorEl = document.querySelector('meta[name="author"]');
  if (authorEl && siteContent.site.author) {
    authorEl.setAttribute('content', escapeHtml(siteContent.site.author));
  }
  
  console.log('[Security] Meta tags updated');
}

/**
 * Get site content
 */
function getContent() {
  return siteContent;
}

/**
 * Initialize components
 */
async function initComponents() {
  console.log('[Security] Initializing components...');
  
  try {
    // Load components in parallel
    await Promise.all([
      loadHeader(),
      loadFooter(),
      loadContent()
    ]);
    
    console.log('[Security] All components initialized');
  } catch (error) {
    console.error('[Security] Error initializing components:', error);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initComponents);
} else {
  initComponents();
}

// Export functions for use in other modules
window.escapeHtml = escapeHtml;
window.sanitizeHtml = sanitizeHtml;
window.getContent = getContent;
