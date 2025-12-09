// ========================================
// MOBILE MENU TOGGLE
// ========================================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = menuToggle.querySelectorAll('span');
    if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close menu when clicking on a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// ========================================
// STICKY NAVBAR EFFECT (Updated)
// ========================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    // If user scrolls down more than 50px, add the 'scrolled' class
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        // Otherwise remove it (make it transparent again)
        navbar.classList.remove('scrolled');
    }
});

// ========================================
// FAQ ACCORDION
// ========================================
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all other FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Toggle current item
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// ========================================
// CONTACT FORM SUBMISSION & MODAL
// ========================================
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');

// Modal Elements
const successModal = document.getElementById('successModal');
const closeModal = document.querySelector('.close-modal');
const closeBtn = document.querySelector('.close-btn');

// Replace this with your actual Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyAId62Kd0_fEsMUTk4-i3rBEL6ykNF_Yfiyu432M4NskMhL9ZEuH_5AIMA50stheHd/exec';

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    formMessage.style.display = 'none';
    
    // Collect form data
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        eventDate: document.getElementById('eventDate').value,
        guestCount: document.getElementById('guestCount').value,
        budget: document.getElementById('budget').value,
        venue: document.getElementById('venue').value,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    
    try {
        // Send data to Google Apps Script
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        // Reset form
        contactForm.reset();
        
        // Show Success Popup (Modal)
        successModal.classList.add('show');
        
    } catch (error) {
        console.error('Error:', error);
        
        // Show error message inline (keep this inline for errors)
        formMessage.textContent = '✗ Something went wrong. Please try again or contact us directly via WhatsApp.';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
    } finally {
        // Reset button state
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
    }
});

// Modal Closing Logic
function hideModal() {
    successModal.classList.remove('show');
}

if(closeModal) closeModal.addEventListener('click', hideModal);
if(closeBtn) closeBtn.addEventListener('click', hideModal);

// Close if clicking outside the white box
window.addEventListener('click', (e) => {
    if (e.target === successModal) {
        hideModal();
    }
});

// ========================================
// FORM VALIDATION ENHANCEMENTS
// ========================================

// Validate phone number format
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    if (value.length > 10) {
        value = value.slice(0, 10);
    }
    
    e.target.value = value;
});

// Set minimum date for event date (today)
const eventDateInput = document.getElementById('eventDate');
const today = new Date().toISOString().split('T')[0];
eventDateInput.setAttribute('min', today);

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// GALLERY IMAGE LAZY LOADING (Optional Enhancement)
// ========================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease';
                
                setTimeout(() => {
                    img.style.opacity = '1';
                }, 100);
                
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('.gallery-item img').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// ANIMATION ON SCROLL (Optional Enhancement)
// ========================================
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .whatsapp-message, .gallery-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                entry.target.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(el => observer.observe(el));
};

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', animateOnScroll);

// ========================================
// BUDGET FILTER LOGIC (Client-side validation)
// ========================================
const budgetSelect = document.getElementById('budget');

budgetSelect.addEventListener('change', (e) => {
    const selectedBudget = e.target.value;
    
    // Optional: Add visual feedback for premium budgets
    if (selectedBudget === '₹10L+' || selectedBudget === '₹5L - ₹10L') {
        budgetSelect.style.borderColor = '#d4af37';
        budgetSelect.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1)';
    } else {
        budgetSelect.style.borderColor = '#e0e0e0';
        budgetSelect.style.boxShadow = 'none';
    }
});



// ========================================
// CONSOLE WELCOME MESSAGE
// ========================================
console.log('%c✨ Dream Weddings ✨', 'font-size: 24px; color: #d4af37; font-weight: bold;');
console.log('%cWe make your dream weddings come true 💫', 'font-size: 14px; color: #333;');
console.log('%cWebsite by Dream Weddings Team', 'font-size: 12px; color: #666;');