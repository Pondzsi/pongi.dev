// Typing Effect
const texts = [
    'Senior .NET/React Fullstack Engineer',
    'Software Craftsman',
    'FPV Pilot 🚁',
    'FPS Gamer 🎮',
    'AI Enthusiast 🤖',
    'Entrepreneur 💡',
    'World Traveler 🌍'
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeText() {
    const typingElement = document.getElementById('typingText');
    const currentText = texts[textIndex];

    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingSpeed = 500;
    }

    setTimeout(typeText, typingSpeed);
}

// Particle Background
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 5;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 60 + 20;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Navbar Show/Hide on Scroll
let lastScrollTop = 0;

function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 300) {
        navbar.classList.add('visible');
    } else {
        navbar.classList.remove('visible');
    }
    
    lastScrollTop = scrollTop;
}

// Mobile menu toggle
function initMobileMenu() {
    const hamburger = document.getElementById('navHamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Set current year dynamically
function setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Initialize all UI effects
function initUIEffects() {
    // Start typing effect after a delay
    setTimeout(typeText, 1000);
    
    // Create particles
    createParticles();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Set up scroll listener
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Set current year
    setCurrentYear();
}
