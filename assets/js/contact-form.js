/**
 * Contact Form Module
 * Implements secure form handling with CSRF protection, rate limiting, and validation
 * Security features: CSRF tokens, rate limiting, input sanitization, honeypot
 */

/**
 * Generate CSRF token (32-byte random hex string)
 */
function generateCSRFToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Initialize CSRF token
 */
function initCSRFToken() {
  let token = sessionStorage.getItem('csrf_token');
  
  if (!token) {
    token = generateCSRFToken();
    sessionStorage.setItem('csrf_token', token);
    console.log('[Security] CSRF token generated');
  }
  
  // Store token in hidden field
  const tokenField = document.getElementById('csrf_token');
  if (tokenField) {
    tokenField.value = token;
  }
  
  return token;
}

/**
 * Validate individual field
 */
function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.name;
  let isValid = true;
  let errorMessage = '';
  
  switch (fieldName) {
    case 'name':
      if (value.length < 2 || value.length > 100) {
        isValid = false;
        errorMessage = 'Name must be between 2 and 100 characters';
      } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
        isValid = false;
        errorMessage = 'Name can only contain letters, spaces, hyphens, and apostrophes';
      }
      break;
      
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
      break;
      
    case 'message':
      if (value.length < 10 || value.length > 2000) {
        isValid = false;
        errorMessage = 'Message must be between 10 and 2000 characters';
      }
      break;
  }
  
  // Update field state
  const feedback = field.nextElementSibling;
  
  if (isValid) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    if (feedback && feedback.classList.contains('invalid-feedback')) {
      feedback.style.display = 'none';
    }
  } else {
    field.classList.remove('is-valid');
    field.classList.add('is-invalid');
    if (feedback && feedback.classList.contains('invalid-feedback')) {
      feedback.textContent = errorMessage;
      feedback.style.display = 'block';
    }
  }
  
  return isValid;
}

/**
 * Sanitize input in real-time
 */
function sanitizeInput(input) {
  let value = input.value;
  
  // Remove potential XSS patterns
  value = value.replace(/<script[^>]*>.*?<\/script>/gi, '');
  value = value.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');
  value = value.replace(/javascript:/gi, '');
  value = value.replace(/on\w+\s*=/gi, '');
  
  input.value = value;
}

/**
 * Check rate limiting
 */
function checkRateLimit() {
  const submissions = JSON.parse(localStorage.getItem('form_submissions') || '[]');
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  // Filter submissions within the last hour
  const recentSubmissions = submissions.filter(timestamp => now - timestamp < oneHour);
  
  if (recentSubmissions.length >= 3) {
    const oldestSubmission = Math.min(...recentSubmissions);
    const timeUntilNext = oldestSubmission + oneHour - now;
    const minutesLeft = Math.ceil(timeUntilNext / 60000);
    
    return {
      allowed: false,
      message: `Rate limit exceeded. Please try again in ${minutesLeft} minute(s).`
    };
  }
  
  return { allowed: true };
}

/**
 * Record form submission
 */
function recordSubmission() {
  const submissions = JSON.parse(localStorage.getItem('form_submissions') || '[]');
  submissions.push(Date.now());
  
  // Keep only last 10 submissions
  if (submissions.length > 10) {
    submissions.shift();
  }
  
  localStorage.setItem('form_submissions', JSON.stringify(submissions));
  console.log('[Security] Form submission recorded');
}

/**
 * Show message to user
 */
function showMessage(type, message) {
  const messageDiv = document.getElementById('form-message');
  if (!messageDiv) return;
  
  messageDiv.className = `alert alert-${type}`;
  messageDiv.textContent = message;
  messageDiv.style.display = 'block';
  
  // Scroll to message
  messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  // Auto-hide success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 5000);
  }
}

/**
 * Handle form submission
 */
async function handleSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  
  // Check rate limiting
  const rateLimit = checkRateLimit();
  if (!rateLimit.allowed) {
    showMessage('danger', rateLimit.message);
    console.warn('[Security] Rate limit exceeded');
    return;
  }
  
  // Validate all fields
  const nameField = form.querySelector('[name="name"]');
  const emailField = form.querySelector('[name="email"]');
  const messageField = form.querySelector('[name="message"]');
  const privacyField = form.querySelector('[name="privacy"]');
  const honeypotField = form.querySelector('[name="website"]');
  
  let isFormValid = true;
  
  // Validate required fields
  if (!validateField(nameField)) isFormValid = false;
  if (!validateField(emailField)) isFormValid = false;
  if (!validateField(messageField)) isFormValid = false;
  
  // Check privacy checkbox
  if (!privacyField.checked) {
    showMessage('danger', 'Please accept the privacy policy to continue.');
    isFormValid = false;
  }
  
  // Check honeypot (must be empty)
  if (honeypotField.value.trim() !== '') {
    console.warn('[Security] Honeypot field filled - potential bot detected');
    showMessage('danger', 'Invalid submission detected.');
    return;
  }
  
  if (!isFormValid) {
    showMessage('danger', 'Please correct the errors in the form.');
    return;
  }
  
  // Disable submit button and show loading state
  submitBtn.disabled = true;
  submitBtn.classList.add('btn-loading');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  
  try {
    // Prepare form data
    const formData = {
      name: nameField.value.trim(),
      email: emailField.value.trim(),
      message: messageField.value.trim(),
      csrf_token: form.querySelector('[name="csrf_token"]').value,
      timestamp: Date.now()
    };
    
    // In a real implementation, send to backend
    // For now, simulate API call
    await simulateAPICall(formData);
    
    // Record submission for rate limiting
    recordSubmission();
    
    // Show success message
    showMessage('success', 'Thank you for your message! I will get back to you soon.');
    
    // Reset form
    form.reset();
    
    // Remove validation classes
    form.querySelectorAll('.is-valid, .is-invalid').forEach(field => {
      field.classList.remove('is-valid', 'is-invalid');
    });
    
    // Generate new CSRF token
    initCSRFToken();
    
    console.log('[Security] Form submitted successfully');
    
  } catch (error) {
    console.error('[Security] Form submission error:', error);
    showMessage('danger', 'An error occurred while sending your message. Please try again later.');
  } finally {
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.classList.remove('btn-loading');
    submitBtn.textContent = originalText;
  }
}

/**
 * Simulate API call (replace with actual backend call)
 */
function simulateAPICall(data) {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      console.log('[Security] Form data (sanitized):', {
        name: window.escapeHtml(data.name),
        email: window.escapeHtml(data.email),
        message: window.escapeHtml(data.message).substring(0, 50) + '...',
        timestamp: data.timestamp
      });
      resolve();
    }, 1500);
  });
}

/**
 * Initialize contact form
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  console.log('[Security] Initializing contact form...');
  
  // Initialize CSRF token
  initCSRFToken();
  
  // Add validation on blur
  const nameField = form.querySelector('[name="name"]');
  const emailField = form.querySelector('[name="email"]');
  const messageField = form.querySelector('[name="message"]');
  
  if (nameField) {
    nameField.addEventListener('blur', () => validateField(nameField));
    nameField.addEventListener('input', () => sanitizeInput(nameField));
  }
  
  if (emailField) {
    emailField.addEventListener('blur', () => validateField(emailField));
    emailField.addEventListener('input', () => sanitizeInput(emailField));
  }
  
  if (messageField) {
    messageField.addEventListener('blur', () => validateField(messageField));
    messageField.addEventListener('input', () => sanitizeInput(messageField));
  }
  
  // Handle form submission
  form.addEventListener('submit', handleSubmit);
  
  console.log('[Security] Contact form initialized with security features');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactForm);
} else {
  initContactForm();
}
