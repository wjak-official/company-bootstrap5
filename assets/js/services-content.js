/**
 * Services Content Module
 * Populates services page with content from content.json
 * Security: All content is properly escaped before insertion
 */

/**
 * Populate services grid
 */
function populateServices(content) {
  if (!content || !content.services) return;
  
  const container = document.getElementById('services-grid');
  if (!container) return;
  
  container.innerHTML = '';
  
  content.services.forEach((service, index) => {
    const serviceCard = document.createElement('div');
    serviceCard.className = 'service-card animate-on-scroll';
    
    // Alternate layout: even indices have image on left, odd on right
    const isEven = index % 2 === 0;
    
    const imageDiv = `
      <div class="col-md-5">
        <div class="service-image">
          <i class="bi bi-${window.escapeHtml(service.icon)}"></i>
        </div>
      </div>
    `;
    
    const contentDiv = `
      <div class="col-md-7">
        <div class="service-content">
          <i class="bi bi-${window.escapeHtml(service.icon)} service-icon"></i>
          <h3 class="service-title">${window.escapeHtml(service.title)}</h3>
          <p class="service-description">${window.escapeHtml(service.description)}</p>
          <ul class="service-features">
            ${service.features.map(feature => 
              `<li>${window.escapeHtml(feature)}</li>`
            ).join('')}
          </ul>
          <p class="service-pricing">${window.escapeHtml(service.pricing)}</p>
          <a href="contact.html" class="btn btn-primary">Get Started</a>
        </div>
      </div>
    `;
    
    serviceCard.innerHTML = `
      <div class="row align-items-center">
        ${isEven ? imageDiv + contentDiv : contentDiv + imageDiv}
      </div>
    `;
    
    container.appendChild(serviceCard);
  });
  
  console.log('[Security] Services grid populated');
}

/**
 * Initialize services content
 */
function initServicesContent() {
  console.log('[Security] Waiting for content to load...');
  
  document.addEventListener('contentLoaded', (event) => {
    const content = event.detail;
    
    console.log('[Security] Populating services page...');
    
    populateServices(content);
    
    // Re-initialize animations for dynamically added elements
    if (window.initScrollAnimations) {
      setTimeout(() => window.initScrollAnimations(), 100);
    }
    
    console.log('[Security] Services page populated successfully');
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initServicesContent);
} else {
  initServicesContent();
}
