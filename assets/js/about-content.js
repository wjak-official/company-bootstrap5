/**
 * About Content Module
 * Populates about page with content from content.json
 * Security: All content is properly escaped before insertion
 */

/**
 * Populate introduction section
 */
function populateIntroduction(content) {
  if (!content || !content.about || !content.about.introduction) return;
  
  const intro = content.about.introduction;
  
  const title = document.getElementById('about-title');
  if (title) {
    title.textContent = window.escapeHtml(intro.title);
  }
  
  const subtitle = document.getElementById('about-subtitle');
  if (subtitle) {
    subtitle.textContent = window.escapeHtml(intro.subtitle);
  }
  
  const contentEl = document.getElementById('about-content');
  if (contentEl) {
    contentEl.textContent = window.escapeHtml(intro.content);
  }
  
  console.log('[Security] Introduction section populated');
}

/**
 * Populate journey and drive sections
 */
function populateJourneyDrive(content) {
  if (!content || !content.about) return;
  
  // Journey
  if (content.about.journey) {
    const journeyTitle = document.getElementById('journey-title');
    if (journeyTitle) {
      journeyTitle.textContent = window.escapeHtml(content.about.journey.title);
    }
    
    const journeyContent = document.getElementById('journey-content');
    if (journeyContent) {
      journeyContent.textContent = window.escapeHtml(content.about.journey.content);
    }
  }
  
  // Drive
  if (content.about.drive) {
    const driveTitle = document.getElementById('drive-title');
    if (driveTitle) {
      driveTitle.textContent = window.escapeHtml(content.about.drive.title);
    }
    
    const driveContent = document.getElementById('drive-content');
    if (driveContent) {
      driveContent.textContent = window.escapeHtml(content.about.drive.content);
    }
  }
  
  console.log('[Security] Journey and drive sections populated');
}

/**
 * Populate expertise list
 */
function populateExpertiseList(content) {
  if (!content || !content.about || !content.about.expertise) return;
  
  const container = document.getElementById('expertise-list');
  if (!container) return;
  
  container.innerHTML = '';
  
  content.about.expertise.forEach(item => {
    const li = document.createElement('li');
    li.className = 'animate-on-scroll';
    li.textContent = window.escapeHtml(item);
    container.appendChild(li);
  });
  
  console.log('[Security] Expertise list populated');
}

/**
 * Populate SAL Framework
 */
function populateSALFramework(content) {
  if (!content || !content.about || !content.about.sal_framework) return;
  
  const container = document.getElementById('sal-framework');
  if (!container) return;
  
  container.innerHTML = '';
  
  content.about.sal_framework.forEach(phase => {
    const card = document.createElement('div');
    card.className = 'sal-card animate-on-scroll';
    
    card.innerHTML = `
      <div class="sal-phase">${window.escapeHtml(phase.phase)}</div>
      <h4 class="sal-title">${window.escapeHtml(phase.title)}</h4>
      <p class="sal-description">${window.escapeHtml(phase.description)}</p>
    `;
    
    container.appendChild(card);
  });
  
  console.log('[Security] SAL Framework populated');
}

/**
 * Initialize about content
 */
function initAboutContent() {
  console.log('[Security] Waiting for content to load...');
  
  document.addEventListener('contentLoaded', (event) => {
    const content = event.detail;
    
    console.log('[Security] Populating about page...');
    
    populateIntroduction(content);
    populateJourneyDrive(content);
    populateExpertiseList(content);
    populateSALFramework(content);
    
    // Re-initialize animations for dynamically added elements
    if (window.initScrollAnimations) {
      setTimeout(() => window.initScrollAnimations(), 100);
    }
    
    console.log('[Security] About page populated successfully');
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAboutContent);
} else {
  initAboutContent();
}
