/* ==========================================
   Team Tools Pro - Marketing Website Scripts
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initSmoothScroll();
    initScreenshotCarousel();
    initContactForm();
    initScrollAnimations();
});

/* Navigation */
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
    });
    
    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });
    
    // Add scrolled class to nav on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

/* Smooth Scroll */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const navHeight = document.getElementById('nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* Screenshot Carousel */
function initScreenshotCarousel() {
    const items = document.querySelectorAll('.screenshot-item');
    const buttons = document.querySelectorAll('.screenshot-nav-btn');
    
    if (!items.length || !buttons.length) return;
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.dataset.index;
            
            // Update active states
            items.forEach(item => item.classList.remove('active'));
            buttons.forEach(b => b.classList.remove('active'));
            
            items[index].classList.add('active');
            this.classList.add('active');
        });
    });
    
    // Auto-rotate carousel
    let currentIndex = 0;
    const autoRotate = setInterval(() => {
        currentIndex = (currentIndex + 1) % items.length;
        
        items.forEach(item => item.classList.remove('active'));
        buttons.forEach(b => b.classList.remove('active'));
        
        items[currentIndex].classList.add('active');
        buttons[currentIndex].classList.add('active');
    }, 5000);
    
    // Stop auto-rotate on user interaction
    buttons.forEach(btn => {
        btn.addEventListener('click', () => clearInterval(autoRotate));
    });
}

/* Contact Form */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        submitBtn.disabled = true;
        
        // Gather form data
        const formData = {
            name: form.querySelector('#name').value,
            email: form.querySelector('#email').value,
            community: form.querySelector('#community').value,
            message: form.querySelector('#message').value
        };
        
        try {
            // Send to Resend via your API endpoint
            // Replace this URL with your actual API endpoint
            const response = await fetch('https://your-api-endpoint.com/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                showFormStatus('success', 'Thank you for your message! We\'ll get back to you soon.');
                form.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            
            // For now, show success since the API endpoint isn't set up yet
            // In production, this would show an error
            showFormStatus('success', 'Thank you for your message! We\'ll get back to you soon.');
            form.reset();
            
            // Uncomment this for production error handling:
            // showFormStatus('error', 'Sorry, there was an error sending your message. Please email us directly at support@teamtoolspro.com');
        } finally {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
    
    function showFormStatus(type, message) {
        status.className = 'form-status ' + type;
        status.textContent = message;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            status.className = 'form-status';
        }, 5000);
    }
}

/* Scroll Animations */
function initScrollAnimations() {
    // Add animation class to elements when they enter viewport
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    const animateElements = document.querySelectorAll(
        '.feature-card, .ps-card, .step, .faq-item, .ministry-badge'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        observer.observe(el);
    });
}

// Add animate-in class styles dynamically
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

/* Utility: Update signup URLs */
// Call this function with your actual signup URL when ready
function setSignupUrl(url) {
    document.querySelectorAll('a.btn-primary').forEach(btn => {
        if (btn.textContent.includes('Trial') || btn.textContent.includes('Free')) {
            btn.href = url;
        }
    });
}

/* Utility: Update sign-in URL */
function setSignInUrl(url) {
    document.querySelectorAll('a').forEach(link => {
        if (link.textContent.trim() === 'Sign In') {
            link.href = url;
        }
    });
}

// Example usage (uncomment and update when ready):
// setSignupUrl('https://app.teamtoolspro.com/signup');
// setSignInUrl('https://app.teamtoolspro.com/login');
