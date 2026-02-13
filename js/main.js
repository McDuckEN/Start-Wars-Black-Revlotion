// main.js - Main functionality
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initSmoothScroll();
    initSectionObserver();
    initHoverEffects();
    initMobileMenu();
    initPageTransitions();
});

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                    
                    // Scroll to top of section
                    setTimeout(() => {
                        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            });
            
            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
            
            // Play click sound
            playSound('click');
        });
    });
}

function initSmoothScroll() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initSectionObserver() {
    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeSection = entry.target.id;
                
                // Update active nav link
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === activeSection) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

function initHoverEffects() {
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('.nav-link, .feature, .team-member, .platform-option, .download-btn');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.classList.add('hover-effect');
            playSound('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            element.classList.remove('hover-effect');
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.download-btn, .btn-pause, .btn-cancel');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            createRippleEffect(e, this);
            playSound('click');
        });
    });
}

function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode === element) {
            element.removeChild(ripple);
        }
    }, 1000);
}

function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            playSound('click');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    }
}

function initPageTransitions() {
    // Add fade-in animation to elements as they appear
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe all cards and features
    document.querySelectorAll('.content-card, .feature, .team-member, .platform-option').forEach(element => {
        observer.observe(element);
    });
}

function playSound(type) {
    // In a real implementation, you would play actual sound files
    // For now, we'll just log to console
    console.log(`Playing ${type} sound`);
    
    // You can add actual audio playback here
    /*
    const audio = new Audio(`sounds/${type}.mp3`);
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Audio play failed:', e));
    */
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Navigate sections with number keys
    if (e.key >= '1' && e.key <= '6') {
        const index = parseInt(e.key) - 1;
        const navLinks = document.querySelectorAll('.nav-link');
        if (navLinks[index]) {
            navLinks[index].click();
        }
    }
    
    // Escape key closes modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('downloadModal');
        if (modal && modal.style.display === 'block') {
            closeDownloadModal();
        }
    }
    
    // Spacebar plays/pauses download
    if (e.key === ' ' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        const modal = document.getElementById('downloadModal');
        if (modal && modal.style.display === 'block') {
            if (isDownloading) {
                pauseDownload();
            } else {
                resumeDownload();
            }
        }
    }
});

// Initialize tooltips
function initTooltips() {
    const elementsWithTooltip = document.querySelectorAll('[data-tooltip]');
    
    elementsWithTooltip.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2}px`;
            tooltip.style.top = `${rect.top - 10}px`;
            
            document.body.appendChild(tooltip);
            
            this.tooltipElement = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltipElement) {
                this.tooltipElement.remove();
                this.tooltipElement = null;
            }
        });
    });
    
    // Add tooltip styles
    const style = document.createElement('style');
    style.textContent = `
        .tooltip {
            position: fixed;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 0.9rem;
            white-space: nowrap;
            z-index: 10000;
            pointer-events: none;
            transform: translate(-50%, -100%);
            animation: tooltip-fade 0.2s ease;
        }
        
        @keyframes tooltip-fade {
            from {
                opacity: 0;
                transform: translate(-50%, -90%);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -100%);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize when page loads
window.addEventListener('load', function() {
    // Add loading animation
    const loading = document.createElement('div');
    loading.className = 'page-loading';
    loading.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Loading Game Data...</p>
    `;
    
    document.body.appendChild(loading);
    
    // Remove loading animation after 1 second
    setTimeout(() => {
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.remove();
        }, 300);
    }, 1000);
    
    // Initialize tooltips
    initTooltips();
});

// Add page loading styles
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    .page-loading {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--space-black);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.3s ease;
    }
    
    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 3px solid rgba(0, 168, 255, 0.3);
        border-top-color: var(--neon-blue);
        border-radius: 50%;
        animation: rotate 1s linear infinite;
        margin-bottom: 20px;
    }
    
    .page-loading p {
        color: var(--neon-cyan);
        font-family: 'Orbitron', sans-serif;
        letter-spacing: 2px;
    }
`;
document.head.appendChild(loadingStyle);