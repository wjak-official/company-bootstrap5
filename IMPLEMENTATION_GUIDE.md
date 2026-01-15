# Implementation Guide

Complete guide for deploying and maintaining the Ifreelance4u portfolio website.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Detailed Setup](#detailed-setup)
3. [Security Checklist](#security-checklist)
4. [Deployment Guide](#deployment-guide)
5. [Backend Setup (Optional)](#backend-setup-optional)
6. [Testing Procedures](#testing-procedures)
7. [Troubleshooting](#troubleshooting)
8. [Maintenance](#maintenance)

---

## Quick Start

### Prerequisites
- Modern web browser
- Text editor (VS Code, Sublime Text, etc.)
- Local web server (Python, Node.js, or PHP)
- Git (for version control)

### Basic Setup (5 minutes)

1. **Clone or download the repository**
   ```bash
   git clone https://github.com/wjak-official/company-bootstrap5.git
   cd company-bootstrap5
   ```

2. **Start a local server**
   ```bash
   # Python 3
   python3 -m http.server 8000
   
   # OR Node.js
   npx http-server -p 8000
   
   # OR PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

4. **Verify functionality**
   - Check all pages load
   - Test navigation
   - Verify contact form validation

---

## Detailed Setup

### Content Customization

#### 1. Update Site Content (data/content.json)

Edit the JSON file to customize all content:

```json
{
  "site": {
    "title": "Your Name",
    "email": "your.email@example.com",
    "description": "Your description",
    "keywords": "your, keywords",
    "location": "Your Location"
  }
}
```

**Key sections to update:**
- `site` - Basic site information
- `navigation` - Menu items
- `social` - Social media URLs
- `home` - Hero section, expertise cards, stats
- `about` - Introduction, journey, expertise list, SAL framework
- `services` - Service offerings with pricing
- `portfolio` - Project showcases

#### 2. Customize Styling (assets/css/style.css)

Update CSS custom properties at the top of the file:

```css
:root {
  --primary-color: #0d6efd;    /* Main brand color */
  --secondary-color: #6c757d;  /* Secondary color */
  --dark-color: #212529;       /* Dark text */
  --light-color: #f8f9fa;      /* Light background */
  /* ... more variables ... */
}
```

#### 3. Add Images (assets/images/)

Replace placeholder images with your own:
- Logo/favicon
- Portfolio project images
- Service illustrations
- About page photo (optional)

Update image references in HTML or content.json.

---

## Security Checklist

### OWASP Top 10 Compliance

#### ✅ A01:2021 - Broken Access Control
- [x] CSRF tokens implemented
- [x] Rate limiting on forms
- [x] Session storage for tokens

#### ✅ A02:2021 - Cryptographic Failures
- [x] HTTPS enforced (deployment requirement)
- [x] Secure token generation using crypto API

#### ✅ A03:2021 - Injection
- [x] HTML escaping for all user inputs
- [x] Input sanitization functions
- [x] No direct HTML insertion of user data

#### ✅ A04:2021 - Insecure Design
- [x] Security-first architecture
- [x] Rate limiting design
- [x] Honeypot field for bot detection

#### ✅ A05:2021 - Security Misconfiguration
- [x] CSP headers configured
- [x] Security headers (X-Frame-Options, etc.)
- [x] No sensitive data in client code

#### ✅ A06:2021 - Vulnerable Components
- [x] SRI hashes for CDN resources
- [x] Bootstrap 5.3.2 (latest stable)
- [x] No outdated dependencies

#### ✅ A07:2021 - Identification & Authentication
- [x] CSRF tokens for form submissions
- [x] Session-based token storage

#### ✅ A08:2021 - Software & Data Integrity
- [x] Subresource Integrity (SRI)
- [x] Content validation before display

#### ✅ A09:2021 - Security Logging & Monitoring
- [x] Console logging for security events
- [x] Error handling with logging

#### ✅ A10:2021 - Server-Side Request Forgery
- [x] No server-side requests in frontend
- [x] Backend implementation includes validation (optional)

### Pre-Deployment Security Checklist

- [ ] All CDN resources use HTTPS
- [ ] SRI hashes are correct
- [ ] CSP headers are configured
- [ ] No console.log in production (or acceptable)
- [ ] No hardcoded credentials
- [ ] Rate limiting is functional
- [ ] CSRF tokens generate correctly
- [ ] Input validation works
- [ ] Honeypot field is hidden
- [ ] External links have rel="noopener noreferrer"
- [ ] Forms validate on client side
- [ ] Error messages don't expose sensitive info

---

## Deployment Guide

### Static Site Deployment

#### GitHub Pages

1. **Push to repository**
   ```bash
   git add .
   git commit -m "Deploy site"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages section
   - Select branch (main) and folder (root)
   - Save

3. **Custom domain (optional)**
   - Add CNAME file with domain
   - Configure DNS records

#### Netlify

1. **Connect repository**
   - Sign up at netlify.com
   - Click "New site from Git"
   - Select your repository

2. **Configure build settings**
   - Build command: (none)
   - Publish directory: `.` (root)

3. **Deploy**
   - Click "Deploy site"
   - Site will be live in ~1 minute

4. **Custom domain**
   - Add custom domain in site settings
   - Configure DNS records

#### Vercel

1. **Import project**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Follow prompts**
   - Select project directory
   - Configure settings
   - Deploy

#### AWS S3 + CloudFront

1. **Create S3 bucket**
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

2. **Upload files**
   ```bash
   aws s3 sync . s3://your-bucket-name --exclude ".git/*"
   ```

3. **Enable static website hosting**
   - Set index.html as index document
   - Set error.html as error document (optional)

4. **Configure CloudFront**
   - Create distribution
   - Set S3 bucket as origin
   - Enable HTTPS
   - Add custom domain (optional)

### HTTPS Configuration

**Required for production!**

- GitHub Pages: Automatic HTTPS
- Netlify: Automatic HTTPS with Let's Encrypt
- Vercel: Automatic HTTPS
- AWS: Use CloudFront with ACM certificate
- Custom server: Use Let's Encrypt (Certbot)

---

## Backend Setup (Optional)

For production contact form with email delivery.

### Node.js/Express Backend

#### 1. Initialize Project

```bash
cd server
npm init -y
```

#### 2. Install Dependencies

```bash
npm install express helmet cors express-rate-limit csurf cookie-parser express-validator nodemailer dotenv dompurify
```

#### 3. Create server.js

```javascript
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
      connectSrc: ["'self'"]
    }
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:8000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use(limiter);

// Contact form rate limiting
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: 'Too many submissions, please try again later.'
});

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CSRF protection
const csrfProtection = csrf({ cookie: true });

// Routes
app.post('/api/contact', contactLimiter, csrfProtection, async (req, res) => {
  // Implement contact form handling
  // See routes/contact.js for full implementation
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### 4. Create .env File

```bash
PORT=3000
ALLOWED_ORIGIN=https://yourdomain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
SMTP_TO=info.ifreelance4u@gmail.com
```

#### 5. Run Backend

```bash
node server.js
```

#### 6. Update Frontend

Update form submission in `assets/js/contact-form.js` to POST to backend:

```javascript
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'CSRF-Token': formData.csrf_token
  },
  body: JSON.stringify(formData),
  credentials: 'include'
});
```

---

## Testing Procedures

### Functional Testing

#### 1. Page Load Testing
```bash
# Test all pages load
curl -I http://localhost:8000/index.html
curl -I http://localhost:8000/about.html
curl -I http://localhost:8000/services.html
curl -I http://localhost:8000/portfolio.html
curl -I http://localhost:8000/contact.html
```

#### 2. Navigation Testing
- Click all navigation links
- Verify active states
- Test mobile menu toggle
- Verify logo link to home

#### 3. Content Population Testing
- Open DevTools Console
- Look for "[Security] Content loaded and validated"
- Verify no errors
- Check all content displays

#### 4. Form Testing

**Valid Submission:**
1. Fill name (John Doe)
2. Fill email (john@example.com)
3. Fill message (10+ characters)
4. Check privacy checkbox
5. Submit
6. Verify success message

**Invalid Submissions:**
- Empty fields → Shows validation errors
- Invalid email → Shows email error
- Short message (<10 chars) → Shows error
- Unchecked privacy → Shows error
- Fill honeypot field → Submission blocked

**Rate Limiting:**
1. Submit form 3 times successfully
2. 4th submission → Rate limit message
3. Wait 1 hour or clear localStorage
4. Can submit again

#### 5. Portfolio Filter Testing
- Click "All Projects" → Shows all 6 projects
- Click "Security" → Shows 2 security projects
- Click "Compliance" → Shows 2 compliance projects
- Click "Development" → Shows 2 development projects
- Active button has correct styling

### Security Testing

#### 1. XSS Testing
Try injecting in contact form:
```
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
javascript:alert('XSS')
```
All should be sanitized/escaped.

#### 2. CSRF Testing
- Submit form
- Check sessionStorage for csrf_token
- Token should be random 64-char hex string
- Token should be included in form

#### 3. Rate Limiting Testing
- Submit form 3 times
- 4th submission blocked
- Check localStorage for form_submissions array

#### 4. CSP Testing
- Open DevTools Console
- Look for CSP violations (none expected)
- Try inline script → Should be blocked

#### 5. SRI Testing
View page source and verify:
```html
<link ... integrity="sha384-..." crossorigin="anonymous">
<script ... integrity="sha384-..." crossorigin="anonymous">
```

### Performance Testing

#### 1. Lighthouse Audit
- Open DevTools
- Go to Lighthouse tab
- Run audit
- Target scores:
  - Performance: 90+
  - Accessibility: 95+
  - Best Practices: 95+
  - SEO: 95+

#### 2. Page Load Time
- Should load in < 2 seconds
- Check Network tab for slow resources

#### 3. Mobile Testing
- Use DevTools Device Mode
- Test on various screen sizes
- Verify responsive design

---

## Troubleshooting

### Common Issues

#### Issue: Header/Footer Not Loading

**Symptoms:** Navigation or footer missing

**Solutions:**
1. Check console for errors
2. Verify includes/header.html and includes/footer.html exist
3. Check server allows loading HTML files
4. Verify CORS is not blocking (if using different server)

```javascript
// Check in console:
fetch('includes/header.html')
  .then(r => r.text())
  .then(console.log)
```

#### Issue: Content Not Populating

**Symptoms:** Sections are empty or show placeholder text

**Solutions:**
1. Check data/content.json exists and is valid JSON
2. Open DevTools Console
3. Look for error: "Failed to load content"
4. Verify JSON structure matches expected format

```bash
# Validate JSON
python3 -m json.tool data/content.json
```

#### Issue: CSP Blocking Resources

**Symptoms:** Console shows CSP violations

**Solutions:**
1. Check CSP meta tag in HTML
2. Ensure all resources are from allowed sources
3. For inline styles, may need 'unsafe-inline' (already included)
4. For external resources, add to CSP directives

#### Issue: Form Not Submitting

**Symptoms:** Submit button does nothing or shows errors

**Solutions:**
1. Check console for JavaScript errors
2. Verify contact-form.js is loaded
3. Check all required fields are filled
4. Verify privacy checkbox is checked
5. Check honeypot field is empty
6. Clear localStorage if rate limited

```javascript
// Clear rate limiting:
localStorage.removeItem('form_submissions');
```

#### Issue: Portfolio Filter Not Working

**Symptoms:** Clicking filter buttons does nothing

**Solutions:**
1. Check portfolio-filter.js is loaded
2. Verify data-category attributes on portfolio cards
3. Check console for errors
4. Verify filter buttons have data-filter attributes

#### Issue: Animations Not Working

**Symptoms:** Elements don't fade in on scroll

**Solutions:**
1. Check if Intersection Observer is supported
2. Verify elements have .animate-on-scroll class
3. Check main.js is loaded and initialized

---

## Maintenance

### Regular Updates

#### Monthly
- [ ] Check for Bootstrap updates
- [ ] Verify SRI hashes if CDN changes
- [ ] Test all functionality
- [ ] Check for console errors
- [ ] Verify forms still work

#### Quarterly
- [ ] Review content.json for accuracy
- [ ] Update portfolio projects
- [ ] Refresh services and pricing
- [ ] Test on latest browsers
- [ ] Run Lighthouse audit

#### Annually
- [ ] Major content review
- [ ] Update copyright year
- [ ] Review and update security practices
- [ ] Consider technology upgrades

### Monitoring

#### What to Monitor
1. **Uptime** - Use service like UptimeRobot
2. **SSL Certificate** - Ensure HTTPS is working
3. **Form Submissions** - Check backend logs (if using)
4. **Page Load Speed** - Use Google PageSpeed Insights
5. **Console Errors** - Periodic manual checks

#### Logs to Review
- Server logs (if using backend)
- Form submission logs
- Error logs
- Security events

### Backup

#### What to Backup
- All source code
- data/content.json
- Any custom images
- SSL certificates (if self-managed)
- Database (if using backend)

#### Backup Schedule
- Daily: Automated git commits
- Weekly: Full site backup
- Monthly: Archived backup to external storage

### Security Updates

#### When to Update
- Immediately: Critical security vulnerabilities
- Monthly: Minor security patches
- Quarterly: Dependency updates

#### How to Update Bootstrap
1. Check release notes: https://github.com/twbs/bootstrap/releases
2. Update version in HTML files
3. Update SRI hash
4. Test all functionality
5. Deploy

```html
<!-- Update version and SRI hash -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" 
      rel="stylesheet" 
      integrity="sha384-NEW-HASH-HERE" 
      crossorigin="anonymous">
```

### Content Management

#### Adding New Portfolio Project

1. Edit data/content.json
2. Add to portfolio array:
```json
{
  "id": 7,
  "title": "New Project",
  "category": "security",
  "description": "Description here",
  "image": "project-7.jpg",
  "tags": ["Tag1", "Tag2"]
}
```
3. Test filter functionality

#### Adding New Service

1. Edit data/content.json
2. Add to services array:
```json
{
  "id": "new-service",
  "title": "Service Name",
  "icon": "bootstrap-icon-name",
  "description": "Description",
  "features": ["Feature 1", "Feature 2"],
  "pricing": "Starting at $X,XXX",
  "image": "service.jpg"
}
```
3. Service will alternate layout automatically

---

## Support

### Documentation
- README.md - Project overview
- This file - Complete implementation guide
- Code comments - Inline documentation

### Resources
- Bootstrap 5 Docs: https://getbootstrap.com/docs/5.3/
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- MDN Web Docs: https://developer.mozilla.org/

### Contact
For questions or issues:
- Email: info.ifreelance4u@gmail.com
- Create an issue in the repository

---

## Changelog

### Version 1.0.0 (2026-01)
- Initial production release
- Complete HTML pages with security headers
- Full JavaScript implementation
- Security features (CSRF, XSS, rate limiting)
- Comprehensive documentation
- Mobile responsive design
