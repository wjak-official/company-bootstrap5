/**
 * Home Content Module
 * Populates home page with content from content.json
 * Security: All content is properly escaped before insertion
 */

/**
 * Populate hero section
 */
function populateHero(content) {
  if (!content || !content.home || !content.home.hero) return;
  
  const hero = content.home.hero;
  
  // Populate hero title
  const heroTitle = document.getElementById('hero-title');
  if (heroTitle) {
    heroTitle.textContent = window.escapeHtml(hero.title);
  }
  
  // Populate hero subtitle
  const heroSubtitle = document.getElementById('hero-subtitle');
  if (heroSubtitle) {
    heroSubtitle.textContent = window.escapeHtml(hero.subtitle);
  }
  
  // Populate hero description
  const heroDescription = document.getElementById('hero-description');
  if (heroDescription) {
    heroDescription.textContent = window.escapeHtml(hero.description);
  }
  
  // Populate CTAs
  const primaryCTA = document.getElementById('hero-cta-primary');
  if (primaryCTA && hero.cta_primary) {
    primaryCTA.href = window.escapeHtml(hero.cta_primary.href);
    primaryCTA.textContent = window.escapeHtml(hero.cta_primary.text);
  }
  
  const secondaryCTA = document.getElementById('hero-cta-secondary');
  if (secondaryCTA && hero.cta_secondary) {
    secondaryCTA.href = window.escapeHtml(hero.cta_secondary.href);
    secondaryCTA.textContent = window.escapeHtml(hero.cta_secondary.text);
  }
  
  console.log('[Security] Hero section populated');
}

/**
 * Populate expertise cards
 */
function populateExpertise(content) {
  if (!content || !content.home || !content.home.expertise) return;
  
  const container = document.getElementById('expertise-cards');
  if (!container) return;
  
  container.innerHTML = '';
  
  content.home.expertise.forEach(item => {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4 animate-on-scroll';
    
    col.innerHTML = `
      <div class="card">
        <div class="card-body text-center">
          <i class="bi bi-${window.escapeHtml(item.icon)} card-icon"></i>
          <h3 class="card-title">${window.escapeHtml(item.title)}</h3>
          <p class="card-text">${window.escapeHtml(item.description)}</p>
        </div>
      </div>
    `;
    
    container.appendChild(col);
  });
  
  console.log('[Security] Expertise cards populated');
}

/**
 * Populate stats section
 */
function populateStats(content) {
  if (!content || !content.home || !content.home.stats) return;
  
  const container = document.getElementById('stats-cards');
  if (!container) return;
  
  container.innerHTML = '';
  
  content.home.stats.forEach(stat => {
    const col = document.createElement('div');
    col.className = 'col-md-3 col-sm-6 mb-4 mb-md-0 animate-on-scroll';
    
    col.innerHTML = `
      <div class="stat-card">
        <i class="bi bi-${window.escapeHtml(stat.icon)} stat-icon"></i>
        <span class="stat-number">${window.escapeHtml(stat.number)}</span>
        <p class="stat-label mb-0">${window.escapeHtml(stat.label)}</p>
      </div>
    `;
    
    container.appendChild(col);
  });
  
  console.log('[Security] Stats section populated');
}

/**
 * Populate social links
 */
function populateSocialLinks(content) {
  if (!content || !content.social) return;
  
  const container = document.getElementById('social-links');
  if (!container) return;
  
  container.innerHTML = '';
  
  const socialLinks = [
    { name: 'GitHub', icon: 'github', url: content.social.github },
    { name: 'LinkedIn', icon: 'linkedin', url: content.social.linkedin },
    { name: 'Twitter', icon: 'twitter', url: content.social.twitter },
    { name: 'Email', icon: 'envelope', url: content.social.email }
  ];
  
  socialLinks.forEach(social => {
    if (social.url) {
      const a = document.createElement('a');
      a.href = window.escapeHtml(social.url);
      a.className = 'social-link';
      a.setAttribute('aria-label', social.name);
      a.setAttribute('rel', 'noopener noreferrer');
      if (!social.url.startsWith('mailto:')) {
        a.setAttribute('target', '_blank');
      }
      
      const i = document.createElement('i');
      i.className = `bi bi-${social.icon}`;
      
      a.appendChild(i);
      container.appendChild(a);
    }
  });
  
  console.log('[Security] Social links populated');
}

/**
 * Initialize home content
 */
function initHomeContent() {
  console.log('[Security] Waiting for content to load...');
  
  document.addEventListener('contentLoaded', (event) => {
    const content = event.detail;
    
    console.log('[Security] Populating home page...');
    
    populateHero(content);
    populateExpertise(content);
    populateStats(content);
    populateSocialLinks(content);
    
    // Re-initialize animations for dynamically added elements
    if (window.initScrollAnimations) {
      setTimeout(() => window.initScrollAnimations(), 100);
    }
    
    console.log('[Security] Home page populated successfully');
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHomeContent);
} else {
  initHomeContent();
}
