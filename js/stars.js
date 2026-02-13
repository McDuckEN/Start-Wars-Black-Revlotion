// stars.js - Starfield animation
document.addEventListener('DOMContentLoaded', function() {
    createStarfield();
    createNebulaAnimation();
    initParallaxEffect();
});

function createStarfield() {
    const starField = document.getElementById('starField');
    if (!starField) return;
    
    const starCount = 200;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random properties
        const size = Math.random() * 3 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 5 + 2;
        const speed = Math.random() * 100 + 50;
        
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.opacity = Math.random() * 0.8 + 0.2;
        
        // Set CSS custom properties
        star.style.setProperty('--duration', `${duration}s`);
        star.style.setProperty('--speed', `${speed}s`);
        
        // Add to starfield
        starField.appendChild(star);
    }
    
    // Add CSS for star animation
    const style = document.createElement('style');
    style.textContent = `
        .star {
            position: absolute;
            background-color: white;
            border-radius: 50%;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
}

function createNebulaAnimation() {
    const nebulae = document.querySelectorAll('.nebula');
    
    nebulae.forEach((nebula, index) => {
        // Random animation properties
        const duration = 30 + Math.random() * 20;
        const delay = Math.random() * 10;
        
        nebula.style.animation = `
            nebula-float ${duration}s ease-in-out infinite alternate,
            nebula-pulse ${duration * 0.5}s ease-in-out infinite
        `;
        nebula.style.animationDelay = `${delay}s`;
    });
    
    // Add nebula animations to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes nebula-float {
            0% {
                transform: translate(0, 0) scale(1);
            }
            100% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(${Math.random() * 0.2 + 0.9});
            }
        }
        
        @keyframes nebula-pulse {
            0%, 100% {
                opacity: 0.03;
            }
            50% {
                opacity: 0.08;
            }
        }
    `;
    document.head.appendChild(style);
}

function initParallaxEffect() {
    const spaceBg = document.getElementById('spaceBg');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (spaceBg) {
            spaceBg.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Create shooting stars occasionally
function createShootingStar() {
    const spaceBg = document.getElementById('spaceBg');
    if (!spaceBg) return;
    
    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';
    
    // Random start position
    const startX = Math.random() * 100;
    const startY = Math.random() * 50;
    
    shootingStar.style.left = `${startX}%`;
    shootingStar.style.top = `${startY}%`;
    
    spaceBg.appendChild(shootingStar);
    
    // Animate
    shootingStar.animate([
        {
            transform: 'translateX(0) translateY(0)',
            opacity: 0
        },
        {
            transform: `translateX(${Math.random() * 200 - 100}px) translateY(${Math.random() * 200 + 100}px)`,
            opacity: 1
        },
        {
            transform: `translateX(${Math.random() * 400 - 200}px) translateY(${Math.random() * 400 + 200}px)`,
            opacity: 0
        }
    ], {
        duration: 1000 + Math.random() * 2000,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
    });
    
    // Remove after animation
    setTimeout(() => {
        if (shootingStar.parentNode) {
            shootingStar.parentNode.removeChild(shootingStar);
        }
    }, 3000);
}

// Create occasional shooting stars
setInterval(createShootingStar, 5000);