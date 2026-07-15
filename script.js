/* ============================================
   ROMANTIC BIRTHDAY WEBSITE - JAVASCRIPT
   ============================================ */

// ===== CONFIGURATION =====
const CONFIG = {
    // Customize these values
    birthdayName: 'Beautiful Soul', // Change to your girlfriend's name
    numHearts: 15,
    numBalloons: 5,
    galleryImages: [
        // Placeholder images - replace with your actual photo URLs
        'https://via.placeholder.com/300x300?text=Memory+1',
        'https://via.placeholder.com/300x300?text=Memory+2',
        'https://via.placeholder.com/300x300?text=Memory+3',
        'https://via.placeholder.com/300x300?text=Memory+4',
        'https://via.placeholder.com/300x300?text=Memory+5',
        'https://via.placeholder.com/300x300?text=Memory+6',
    ],
    fireworksColors: ['#FF6B35', '#F7931E', '#FDB833', '#FFE135', '#FF1493', '#FF69B4'],
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeHeroText();
    generateFloatingHearts();
    generateBalloons();
    generateGallery();
    setupIntersectionObserver();
    setupEventListeners();
    initializeFireworksCanvas();
});

// ===== HERO TEXT - TYPEWRITER EFFECT =====
/**
 * Creates a typewriter effect for the hero title
 */
function initializeHeroText() {
    const heroTitle = document.getElementById('heroTitle');
    const text = `Happy Birthday, ${CONFIG.birthdayName}!`;
    heroTitle.textContent = '';
    
    let index = 0;
    const typeInterval = setInterval(() => {
        if (index < text.length) {
            heroTitle.textContent += text[index];
            index++;
        } else {
            clearInterval(typeInterval);
            heroTitle.style.borderRight = 'none';
        }
    }, 80);
}

// ===== FLOATING HEARTS =====
/**
 * Generates floating heart particles in the background
 */
function generateFloatingHearts() {
    const container = document.querySelector('.hearts-container');
    const hearts = ['❤️', '💕', '💖', '💗', '💝'];
    
    for (let i = 0; i < CONFIG.numHearts; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        
        // Random horizontal position
        const leftPos = Math.random() * 100;
        heart.style.left = leftPos + '%';
        
        // Random animation delay
        const delay = Math.random() * 5;
        heart.style.animationDelay = delay + 's';
        
        // Random duration variation
        const duration = 8 + Math.random() * 4;
        heart.style.animationDuration = duration + 's';
        
        container.appendChild(heart);
    }
}

// ===== BALLOONS =====
/**
 * Generates animated balloons with random colors
 */
function generateBalloons() {
    const container = document.getElementById('balloonsContainer');
    const colors = [
        '#FF1493', // Deep Pink
        '#FF69B4', // Hot Pink
        '#FFB6C1', // Light Pink
        '#FF6B9D', // Romantic Pink
        '#FF6347', // Tomato Red
        '#FFD700', // Gold
        '#87CEEB', // Sky Blue
        '#DDA0DD', // Plum
    ];
    
    for (let i = 0; i < CONFIG.numBalloons; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        
        // Create balloon body
        const balloonBody = document.createElement('div');
        balloonBody.className = 'balloon-body';
        const color = colors[Math.floor(Math.random() * colors.length)];
        balloonBody.style.background = color;
        
        // Create string
        const string = document.createElement('div');
        string.className = 'balloon-string';
        
        balloon.appendChild(balloonBody);
        balloon.appendChild(string);
        
        // Add click handler for popping
        balloon.addEventListener('click', (e) => popBalloon(e, balloon));
        
        // Random animation delay
        const delay = Math.random() * 2;
        balloon.style.animationDelay = delay + 's';
        
        container.appendChild(balloon);
    }
}

/**
 * Handles balloon pop animation and sound
 */
function popBalloon(e, balloonElement) {
    e.stopPropagation();
    
    if (balloonElement.classList.contains('pop')) return;
    
    balloonElement.classList.add('pop');
    
    // Play pop sound
    playPopSound();
    
    // Create burst particles
    createBalloonBurst(balloonElement);
    
    // Remove balloon after animation
    setTimeout(() => {
        balloonElement.remove();
    }, 600);
}

/**
 * Creates visual burst particles when balloon pops
 */
function createBalloonBurst(balloonElement) {
    const rect = balloonElement.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'balloon-particle';
        particle.textContent = '✨';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.fontSize = '20px';
        
        // Random burst direction
        const angle = (i / 8) * Math.PI * 2;
        const velocity = 100 + Math.random() * 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.style.animation = 'particleBurst 0.6s ease-out forwards';
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 600);
    }
}

/**
 * Plays a pop sound effect (using a simple beep)
 */
function playPopSound() {
    try {
        // Create a simple pop sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Pop sound parameters
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        console.log('Web Audio API not available, skipping pop sound');
    }
}

// ===== CANDLE BLOWING =====
/**
 * Handles the candle blowing interaction
 */
function setupEventListeners() {
    const blowButton = document.getElementById('blowButton');
    blowButton.addEventListener('click', blowCandles);
    
    // Music toggle
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    
    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play().catch(err => console.log('Autoplay prevented:', err));
            musicToggle.style.opacity = '1';
        } else {
            bgMusic.pause();
            musicToggle.style.opacity = '0.6';
        }
    });
    
    // Set initial music state
    musicToggle.style.opacity = '0.6';
}

/**
 * Animates the candles blowing out and triggers fireworks
 */
function blowCandles() {
    const blowButton = document.getElementById('blowButton');
    blowButton.disabled = true;
    
    // Get all flame elements
    const flames = document.querySelectorAll('.flame');
    
    // Stagger the flame out animation
    flames.forEach((flame, index) => {
        setTimeout(() => {
            flame.classList.add('out');
        }, index * 150);
    });
    
    // Trigger fireworks after candles are blown
    setTimeout(() => {
        triggerFireworks();
        blowButton.textContent = '🎉 Wish Granted! 🎉';
        setTimeout(() => {
            blowButton.textContent = '🎂 Blow the Candles 🎂';
            blowButton.disabled = false;
            // Reset candles
            flames.forEach(flame => flame.classList.remove('out'));
        }, 5000);
    }, 600);
}

// ===== FIREWORKS ANIMATION =====
let fireworksCanvas;
let fireworksCtx;

/**
 * Initializes the fireworks canvas
 */
function initializeFireworksCanvas() {
    fireworksCanvas = document.getElementById('fireworksCanvas');
    fireworksCtx = fireworksCanvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        fireworksCanvas.width = window.innerWidth;
        fireworksCanvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

/**
 * Particle object for fireworks
 */
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8 - 2,
        };
        this.alpha = 1;
        this.friction = 0.95;
        this.gravity = 0.2;
        this.radius = Math.random() * 3 + 2;
    }
    
    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity;
        
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        
        this.alpha -= 0.015;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

let particles = [];
let animationId = null;

/**
 * Triggers multiple fireworks bursts
 */
function triggerFireworks() {
    const canvas = fireworksCanvas;
    canvas.classList.add('active');
    
    particles = [];
    
    // Create 4 bursts at different positions
    const bursts = [
        { x: canvas.width * 0.25, y: canvas.height * 0.3 },
        { x: canvas.width * 0.75, y: canvas.height * 0.3 },
        { x: canvas.width * 0.5, y: canvas.height * 0.5 },
        { x: canvas.width * 0.25, y: canvas.height * 0.7 },
        { x: canvas.width * 0.75, y: canvas.height * 0.7 },
    ];
    
    bursts.forEach((burst, index) => {
        setTimeout(() => {
            createFireworkBurst(burst.x, burst.y);
        }, index * 300);
    });
    
    // Start animation
    animateFireworks();
    
    // Stop animation after 4 seconds
    setTimeout(() => {
        canvas.classList.remove('active');
        cancelAnimationFrame(animationId);
    }, 4000);
}

/**
 * Creates a single firework burst
 */
function createFireworkBurst(x, y) {
    const particleCount = 50 + Math.random() * 30;
    
    for (let i = 0; i < particleCount; i++) {
        const color = CONFIG.fireworksColors[Math.floor(Math.random() * CONFIG.fireworksColors.length)];
        particles.push(new Particle(x, y, color));
    }
}

/**
 * Animates the fireworks
 */
function animateFireworks() {
    fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        } else {
            particle.update();
            particle.draw(fireworksCtx);
        }
    });
    
    if (particles.length > 0) {
        animationId = requestAnimationFrame(animateFireworks);
    }
}

// ===== PHOTO GALLERY =====
/**
 * Generates the photo gallery
 */
function generateGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    
    CONFIG.galleryImages.forEach((imgUrl, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item fade-in-up';
        
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = `Memory ${index + 1}`;
        
        item.appendChild(img);
        galleryGrid.appendChild(item);
    });
}

// ===== SCROLL REVEAL ANIMATIONS =====
/**
 * Sets up Intersection Observer for scroll reveal animations
 */
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // Uncomment to stop observing after reveal
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all fade-in-up elements
    document.querySelectorAll('.fade-in-up').forEach((element) => {
        observer.observe(element);
    });
}

// ===== CONFETTI EFFECT (Optional - triggered on candle blow) =====
/**
 * Creates confetti particles
 */
function createConfetti() {
    const colors = ['#FF1493', '#FFD700', '#87CEEB', '#FF6B9D', '#00FF7F'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        
        document.body.appendChild(confetti);
        
        const duration = 2 + Math.random() * 1;
        const xMovement = (Math.random() - 0.5) * 300;
        
        confetti.animate([
            {
                transform: 'translateY(0) translateX(0) rotate(0deg)',
                opacity: 1,
            },
            {
                transform: `translateY(${window.innerHeight + 100}px) translateX(${xMovement}px) rotate(360deg)`,
                opacity: 0,
            },
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        });
        
        setTimeout(() => confetti.remove(), duration * 1000);
    }
}

// Note: Confetti is created via CSS animations in the burst effect
// This function can be called separately if desired

// ===== UTILITY FUNCTIONS =====
/**
 * Logs initialization status (for debugging)
 */
console.log('%c🎉 Romantic Birthday Website Initialized! 🎉', 'font-size: 20px; color: #FF6B9D; font-weight: bold;');
console.log('%cCustomize the website by editing CONFIG values in script.js', 'font-size: 14px; color: #7b3ff2;');
console.log('%cHappy Birthday! 💕', 'font-size: 16px; color: #FFD700; font-weight: bold;');