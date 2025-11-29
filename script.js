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
    initFloatingLabels();
    initLegalModals();
    initAnalyticsTracking();
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
            // Send to Supabase Edge Function
            const response = await fetch('https://jtubjrksomudwjdhgmss.supabase.co/functions/v1/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showFormStatus('success', 'Thank you for your message! We\'ll get back to you soon.');
                form.reset();
            } else {
                throw new Error(data.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showFormStatus('error', 'Sorry, there was an error sending your message. Please email us directly at support@teamtoolspro.com');
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

/* Floating Labels Rotation */
function initFloatingLabels() {
    const benefits = [
        'Full Service Records',
        'Instant Access',
        'Real-Time Check-In',
        'Automated Reports',
        'Secure Cloud Storage',
        'Weekend History'
    ];
    
    const positions = ['pos-top', 'pos-mid', 'pos-bot'];
    
    const float1 = document.querySelector('.hero-float-1');
    const float2 = document.querySelector('.hero-float-2');
    const label1 = float1?.querySelector('.float-label');
    const label2 = float2?.querySelector('.float-label');
    
    if (!float1 || !float2 || !label1 || !label2) return;
    
    let index1 = 0;
    let index2 = 1;
    let posIndex1 = 0;
    let posIndex2 = 2;
    let currentFloat = 1;
    
    // Set initial positions
    float1.classList.add(positions[posIndex1]);
    float2.classList.add(positions[posIndex2]);
    
    setInterval(() => {
        if (currentFloat === 1) {
            // Fade out float 1 (slides right)
            float1.classList.add('fade-out');
            float1.classList.remove('fade-in');
            
            setTimeout(() => {
                // Update benefit text
                do {
                    index1 = (index1 + 2) % benefits.length;
                } while (index1 === index2);
                label1.textContent = benefits[index1];
                
                // Change position
                float1.classList.remove(positions[posIndex1]);
                do {
                    posIndex1 = (posIndex1 + 1) % positions.length;
                } while (posIndex1 === posIndex2);
                float1.classList.add(positions[posIndex1]);
                
                // Fade in (slides from right)
                float1.classList.remove('fade-out');
                float1.classList.add('fade-in');
            }, 600);
            
            currentFloat = 2;
        } else {
            // Fade out float 2 (slides left)
            float2.classList.add('fade-out');
            float2.classList.remove('fade-in');
            
            setTimeout(() => {
                // Update benefit text
                do {
                    index2 = (index2 + 2) % benefits.length;
                } while (index2 === index1);
                label2.textContent = benefits[index2];
                
                // Change position
                float2.classList.remove(positions[posIndex2]);
                do {
                    posIndex2 = (posIndex2 + 1) % positions.length;
                } while (posIndex2 === posIndex1);
                float2.classList.add(positions[posIndex2]);
                
                // Fade in (slides from left)
                float2.classList.remove('fade-out');
                float2.classList.add('fade-in');
            }, 600);
            
            currentFloat = 1;
        }
    }, 3500);
}

/* Utility: Update sign-in URL */
function setSignInUrl(url) {
    document.querySelectorAll('a').forEach(link => {
        if (link.textContent.trim() === 'Sign In') {
            link.href = url;
        }
    });
}

/* Legal Modals */
function initLegalModals() {
    const modalLinks = document.querySelectorAll('[data-modal]');
    
    modalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.dataset.modal;
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal on overlay click or close button
    document.querySelectorAll('.legal-modal').forEach(modal => {
        const overlay = modal.querySelector('.legal-modal-overlay');
        const closeBtn = modal.querySelector('.legal-modal-close');
        
        const closeModal = () => {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        };
        
        overlay.addEventListener('click', closeModal);
        closeBtn.addEventListener('click', closeModal);
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.legal-modal.open').forEach(modal => {
                modal.classList.remove('open');
                document.body.style.overflow = '';
            });
        }
    });
}

/* Google Analytics Event Tracking */
function initAnalyticsTracking() {
    // Track "Start Free Trial" button clicks
    document.querySelectorAll('a.btn-primary').forEach(btn => {
        if (btn.textContent.includes('Trial') || btn.textContent.includes('Free')) {
            btn.addEventListener('click', function() {
                gtag('event', 'click_start_trial', {
                    'event_category': 'engagement',
                    'event_label': 'Start Free Trial Button'
                });
            });
        }
    });
    
    // Track "Sign In" clicks
    document.querySelectorAll('a').forEach(link => {
        if (link.textContent.trim() === 'Sign In') {
            link.addEventListener('click', function() {
                gtag('event', 'click_sign_in', {
                    'event_category': 'engagement',
                    'event_label': 'Sign In Link'
                });
            });
        }
    });
    
    // Track contact form submissions
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function() {
            gtag('event', 'form_submit', {
                'event_category': 'engagement',
                'event_label': 'Contact Form'
            });
        });
    }
    
    // Track scroll depth (25%, 50%, 75%, 100%)
    let scrollMarks = { 25: false, 50: false, 75: false, 100: false };
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        [25, 50, 75, 100].forEach(mark => {
            if (scrollPercent >= mark && !scrollMarks[mark]) {
                scrollMarks[mark] = true;
                gtag('event', 'scroll_depth', {
                    'event_category': 'engagement',
                    'event_label': mark + '% scrolled'
                });
            }
        });
    });
}

// Example usage (uncomment and update when ready):
// setSignupUrl('https://app.teamtoolspro.com/signup');
// setSignInUrl('https://app.teamtoolspro.com/login');
