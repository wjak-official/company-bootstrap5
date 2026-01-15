# Ifreelance4u - Production-Ready Portfolio Website

A secure, modern Bootstrap 5 multi-page portfolio website for a Web Security Architect & Developer, featuring comprehensive security implementations following OWASP Top 10 guidelines.

## 🔒 Security Features

### Frontend Security
- **Content Security Policy (CSP)** - Strict CSP headers to prevent XSS attacks
- **XSS Prevention** - HTML escaping and sanitization for all user inputs
- **CSRF Protection** - Token-based protection for form submissions
- **Input Validation** - Client-side validation with regex patterns
- **Rate Limiting** - 3 submissions per hour for contact form
- **Honeypot Field** - Bot detection mechanism
- **Subresource Integrity (SRI)** - All CDN resources use integrity hashes
- **Security Headers** - X-Content-Type-Options, X-Frame-Options, Referrer-Policy

### Code Quality
- **No inline JavaScript** - All scripts in external files
- **ES6+ JavaScript** - Modern syntax with const/let, arrow functions
- **Error Handling** - Try-catch blocks and validation
- **Accessibility** - ARIA labels, semantic HTML, keyboard navigation
- **Responsive Design** - Mobile-first approach with Bootstrap 5.3.2

## 📁 Project Structure

```
/
├── index.html              # Home page
├── about.html              # About page
├── services.html           # Services page
├── portfolio.html          # Portfolio page with filtering
├── contact.html            # Contact page with secure form
├── README.md               # This file
├── IMPLEMENTATION_GUIDE.md # Detailed implementation guide
├── data/
│   └── content.json        # Site content and configuration
├── includes/
│   ├── header.html         # Reusable header component
│   └── footer.html         # Reusable footer component
├── assets/
│   ├── css/
│   │   └── style.css       # Custom styles
│   ├── js/
│   │   ├── components.js   # Header/footer loader & sanitization
│   │   ├── main.js         # Main functionality
│   │   ├── contact-form.js # Secure form handling
│   │   ├── home-content.js # Home page content population
│   │   ├── about-content.js # About page content population
│   │   ├── services-content.js # Services page content
│   │   └── portfolio-filter.js # Portfolio filtering
│   └── images/
│       └── .gitkeep
└── server/ (optional)
    ├── server.js
    ├── routes/
    ├── utils/
    └── package.json
```

## 🚀 Features

### Pages
1. **Home** - Hero section, expertise cards, statistics, social links
2. **About** - Professional introduction, journey, expertise list, SAL Framework
3. **Services** - 5 detailed service offerings with pricing
4. **Portfolio** - Project showcase with category filtering
5. **Contact** - Secure contact form with validation

### Security Implementations
- CSRF token generation and validation
- Rate limiting (3 submissions/hour)
- Input sanitization and validation
- Honeypot field for bot detection
- HTML escaping to prevent XSS
- Secure external link handling

### JavaScript Features
- Dynamic header/footer loading
- Content population from JSON
- Portfolio filtering by category
- Smooth scroll animations
- Form validation with real-time feedback
- Intersection Observer for animations
- No inline event handlers

## 📦 Installation

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/wjak-official/company-bootstrap5.git
   cd company-bootstrap5
   ```

2. **Serve the website**
   
   Option A - Using Python:
   ```bash
   python3 -m http.server 8000
   ```
   
   Option B - Using Node.js (http-server):
   ```bash
   npx http-server -p 8000
   ```
   
   Option C - Using PHP:
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Static Hosting Deployment

This site can be deployed to any static hosting service:

- **GitHub Pages**: Push to gh-pages branch
- **Netlify**: Connect repository and deploy
- **Vercel**: Import project and deploy
- **AWS S3**: Upload files to S3 bucket with static hosting

## 🔧 Configuration

### Update Site Content

Edit `data/content.json` to customize:
- Site metadata (title, description, keywords)
- Navigation items
- Social media links
- Home page content (hero, expertise, stats)
- About page content
- Services details
- Portfolio projects

### Customize Styling

Edit `assets/css/style.css` to modify:
- Color scheme (CSS custom properties at top)
- Typography
- Spacing and layout
- Animations and transitions

## 🧪 Testing

### Manual Testing Checklist
- [ ] All pages load without errors
- [ ] Navigation works on all pages
- [ ] Header and footer load correctly
- [ ] Content populates from JSON
- [ ] Portfolio filter buttons work
- [ ] Contact form validates inputs
- [ ] Rate limiting prevents spam
- [ ] CSRF tokens are generated
- [ ] Mobile responsive design
- [ ] All external links have rel="noopener noreferrer"

### Browser Testing
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Security Testing
- Check CSP headers in browser DevTools
- Verify no console errors
- Test XSS prevention (try injecting `<script>` in form)
- Verify rate limiting (submit form 4+ times)
- Check honeypot field (fill "website" field)

## 🛡️ Security Compliance

This project follows:
- **OWASP Top 10** security guidelines
- **CSP Level 3** recommendations
- **Subresource Integrity (SRI)** for CDN resources
- **Content Security Policy** best practices
- **XSS Prevention** techniques
- **CSRF Protection** patterns

## 📚 Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, animations, responsive design
- **JavaScript (ES6+)** - Modern vanilla JavaScript
- **Bootstrap 5.3.2** - CSS framework with SRI
- **Bootstrap Icons 1.11.1** - Icon library with SRI
- **JSON** - Content management

## 🎨 Brand Information

- **Brand Name**: Ifreelance4u
- **Tagline**: Web Security Architect & Developer
- **Email**: info.ifreelance4u@gmail.com
- **Location**: Dubai, UAE
- **Specialization**: HIPAA, GDPR, PCI-DSS, SOC 2 compliance

## 📄 License

This project is proprietary. All rights reserved.

## 👤 Author

**Ifreelance4u**
- Web Security Architect & Developer
- Specializing in compliance and secure development
- Based in Dubai, UAE

## 📞 Contact

For questions or support:
- Email: info.ifreelance4u@gmail.com
- Website: [View Portfolio](https://ifreelance4u.com)

## 🔄 Version History

- **v1.0.0** (2026-01) - Initial production release
  - Complete HTML pages with security headers
  - Comprehensive CSS styling
  - Full JavaScript implementation
  - Security features (CSRF, XSS prevention, rate limiting)
  - Content management via JSON
  - Mobile responsive design
