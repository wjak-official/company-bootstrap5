/**
 * Portfolio Filter Module
 * Handles filtering of portfolio items by category
 * Security: Proper event handling without inline JavaScript
 */

let currentFilter = 'all';

/**
 * Filter portfolio items
 */
function filterPortfolio(category) {
  currentFilter = category;
  
  const portfolioItems = document.querySelectorAll('.portfolio-card');
  
  portfolioItems.forEach(item => {
    const itemCategory = item.getAttribute('data-category');
    
    if (category === 'all' || itemCategory === category) {
      item.classList.remove('hidden');
      // Add animation
      item.style.animation = 'fadeInUp 0.5s ease';
    } else {
      item.classList.add('hidden');
    }
  });
  
  // Update active state on filter buttons
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    if (btn.getAttribute('data-filter') === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  console.log(`[Security] Portfolio filtered by: ${category}`);
}

/**
 * Initialize filter buttons
 */
function initFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-filter');
      filterPortfolio(category);
    });
  });
  
  console.log('[Security] Portfolio filters initialized');
}

/**
 * Populate portfolio items from content.json (optional)
 */
function populatePortfolio(content) {
  if (!content || !content.portfolio) return;
  
  const container = document.getElementById('portfolio-grid');
  if (!container) return;
  
  // Check if portfolio is already populated with static content
  const existingItems = container.querySelectorAll('.portfolio-card');
  if (existingItems.length > 0) {
    console.log('[Security] Portfolio already has static content');
    return;
  }
  
  container.innerHTML = '';
  
  content.portfolio.forEach(project => {
    const col = document.createElement('div');
    col.className = 'col-md-4 col-sm-6';
    
    col.innerHTML = `
      <div class="portfolio-card animate-on-scroll" data-category="${window.escapeHtml(project.category)}">
        <div class="portfolio-image">
          <i class="bi bi-image"></i>
        </div>
        <div class="portfolio-overlay">
          <h4 class="portfolio-title">${window.escapeHtml(project.title)}</h4>
          <p class="portfolio-category">${window.escapeHtml(project.category)}</p>
          <p class="portfolio-description">${window.escapeHtml(project.description)}</p>
          <div class="portfolio-tags">
            ${project.tags.map(tag => 
              `<span class="portfolio-tag">${window.escapeHtml(tag)}</span>`
            ).join('')}
          </div>
        </div>
      </div>
    `;
    
    container.appendChild(col);
  });
  
  console.log('[Security] Portfolio items populated from JSON');
}

/**
 * Initialize portfolio filter
 */
function initPortfolioFilter() {
  console.log('[Security] Initializing portfolio filter...');
  
  // Initialize filter buttons immediately if they exist
  const filterNav = document.querySelector('.filter-nav');
  if (filterNav) {
    initFilterButtons();
  }
  
  // Wait for content to load for dynamic population
  document.addEventListener('contentLoaded', (event) => {
    const content = event.detail;
    
    populatePortfolio(content);
    
    // Re-initialize filter buttons if portfolio was populated dynamically
    if (content.portfolio && content.portfolio.length > 0) {
      initFilterButtons();
    }
    
    // Re-initialize animations
    if (window.initScrollAnimations) {
      setTimeout(() => window.initScrollAnimations(), 100);
    }
    
    console.log('[Security] Portfolio filter ready');
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolioFilter);
} else {
  initPortfolioFilter();
}
