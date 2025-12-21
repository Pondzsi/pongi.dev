// Portfolio Projects Data
const portfolioProjects = [
    {
        id: 1,
        title: "Fidelcard.ro",
        shortDesc: "Loyalty card system for small businesses",
        description: "A comprehensive digital loyalty card platform designed for small and medium-sized businesses. Enables merchants to create and manage custom loyalty programs with QR code scanning, stamp collection, and rewards tracking. Customers can store their loyalty cards in Apple Wallet or Google Wallet for easy access. Features include real-time analytics dashboard, automated reward notifications, customer engagement metrics, and multi-location support. Built with a modern tech stack featuring Laravel backend for robust API management, React frontend for responsive user experience, and PostgreSQL for reliable data storage.",
        technologies: ["Laravel", "PHP", "React", "PostgreSQL", "Apple Wallet", "Google Wallet"],
        image: "assets/images/projects/fidelcard.png",
        liveUrl: "https://fidelcard.ro/"
    },
    {
        id: 2,
        title: "InvoiceHunter",
        shortDesc: "Chrome extension for automated Gmail invoice extraction",
        description: "An intelligent Chrome extension that automatically scans Gmail attachments to identify and extract invoice PDFs, streamlining expense tracking and accounting workflows. Features secure OAuth 2.0 authentication for Gmail integration, smart pattern matching with confidence-based scoring (high/medium/low), and advanced PDF text analysis for accurate invoice detection. Users can scan emails across flexible timeframes (7, 30, 90 days, or custom date ranges), preview PDFs in-browser, and download invoices individually or in bulk. The extension includes real-time progress tracking with detailed statistics, dark mode support, and processes all data locally to ensure privacy. Built with Manifest V3 for modern Chrome extension standards, featuring a service worker architecture for background processing, PDF.js integration for text extraction, and an intuitive popup interface with filtering capabilities.",
        technologies: ["JavaScript", "Chrome Extension API", "Gmail API", "OAuth 2.0", "PDF.js", "Manifest V3", "HTML5", "CSS3"],
        image: "assets/images/projects/invoice-hunter.png",
        liveUrl: "https://pondzsi.github.io/InvoiceHunterLanding"
    },
    {
        id: 3,
        title: "Nagy Méhészet",
        shortDesc: "E-commerce platform for artisanal honey and bee products",
        description: "A full-featured e-commerce website for a Romanian beekeeping business specializing in natural honey and artisanal bee products. The platform features a modern, responsive storefront with multi-language support (Hungarian, Romanian, and English) to serve the diverse customer base in Transylvania. Customers can browse through 8+ honey varieties and 15+ handcrafted products, add items to their cart with real-time management, and complete purchases through a sophisticated multi-step checkout process offering both local pickup and regional shipping options. The checkout flow includes smart location-based delivery zones covering Târgu Mureș, Sovata, and Câmpu Cetății regions with cascading city selection. Features include an engaging animated hero section with image carousels showcasing beekeeping activities, an integrated blog system for sharing beekeeping insights and honey benefits, automated email notifications for new orders, and comprehensive order tracking. The admin panel, built with Laravel Jetstream and Livewire, enables efficient product management, blog content creation, and order fulfillment workflow with status tracking (pending, processing, completed, cancelled). Built with a robust Laravel 9 backend providing RESTful API endpoints, MySQL database for reliable data management, and a vanilla JavaScript frontend enhanced with SweetAlert2 for user interactions and Axios for API communication.",
        technologies: ["Laravel", "PHP", "MySQL", "JavaScript", "HTML5", "CSS3", "Axios", "SweetAlert2", "Livewire", "Jetstream", "Sanctum", "Vite", "Tailwind CSS"],
        image: "assets/images/projects/nagymeheszet.png",
        liveUrl: "https://nagymeheszet.ro"
    }
];

// Portfolio Modal State
let currentProjectIndex = 0;

function renderPortfolioCards() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    
    portfolioProjects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'portfolio-card';
        card.onclick = () => openModal(index);
        
        card.innerHTML = `
            <div class="portfolio-card-image">
                ${project.image 
                    ? `<img src="${project.image}" alt="${project.title}">`
                    : `<i class="fas fa-code portfolio-placeholder-icon"></i>`
                }
            </div>
            <div class="portfolio-card-content">
                <h3 class="portfolio-card-title">${project.title}</h3>
                <p style="color: var(--text-gray); font-size: 0.95rem;">${project.shortDesc}</p>
                <div class="portfolio-card-tech">
                    ${project.technologies.slice(0, 3).map(tech => 
                        `<span class="tech-tag">${tech}</span>`
                    ).join('')}
                    ${project.technologies.length > 3 
                        ? `<span class="tech-tag">+${project.technologies.length - 3}</span>` 
                        : ''
                    }
                </div>
            </div>
        `;
        
        portfolioGrid.appendChild(card);
    });
}

function openModal(index) {
    currentProjectIndex = index;
    const project = portfolioProjects[index];
    const modal = document.getElementById('portfolioModal');
    
    // Update modal content
    document.getElementById('modalImage').innerHTML = project.image
        ? `<img src="${project.image}" alt="${project.title}">`
        : `<i class="fas fa-code modal-placeholder-icon"></i>`;
    
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalDescription').textContent = project.description;
    
    // Update technologies
    const modalTech = document.getElementById('modalTech');
    modalTech.innerHTML = project.technologies.map(tech => 
        `<span class="tech-tag">${tech}</span>`
    ).join('');
    
    // Update links
    const modalLinks = document.getElementById('modalLinks');
    modalLinks.innerHTML = `
        ${project.githubUrl ? `
            <a href="${project.githubUrl}" class="modal-link" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-github"></i> View Code
            </a>
        ` : ''}
        ${project.liveUrl ? `
            <a href="${project.liveUrl}" class="modal-link" target="_blank" rel="noopener noreferrer">
                <i class="fas fa-external-link-alt"></i> Live Demo
            </a>
        ` : ''}
    `;
    
    // Update navigation buttons
    document.getElementById('prevProject').disabled = index === 0;
    document.getElementById('nextProject').disabled = index === portfolioProjects.length - 1;
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('portfolioModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function navigateProject(direction) {
    const newIndex = currentProjectIndex + direction;
    if (newIndex >= 0 && newIndex < portfolioProjects.length) {
        openModal(newIndex);
    }
}

function initPortfolio() {
    // Render portfolio cards
    renderPortfolioCards();
    
    // Modal event listeners
    const modal = document.getElementById('portfolioModal');
    const closeBtn = document.getElementById('closeModal');
    const prevBtn = document.getElementById('prevProject');
    const nextBtn = document.getElementById('nextProject');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => navigateProject(-1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => navigateProject(1));
    }
    
    // Close modal when clicking backdrop
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}
