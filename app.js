/**
 * The Handiest Handyman - Application Scripts
 * Contains interactions for sticky header, mobile menu, portfolio filter,
 * image lightbox, and form submission.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Sticky Header Scroll Effect
    // ==========================================
    const header = document.getElementById('site-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run initially in case page loaded scrolled down


    // ==========================================
    // 2. Mobile Navigation Hamburger Menu
    // ==========================================
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-item');

    const toggleMenu = () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        // Prevent body scrolling when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    };

    const closeMenu = () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking nav links
    navItems.forEach(item => {
        item.addEventListener('click', closeMenu);
    });

    // Close menu when resizing window past mobile breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });


    // ==========================================
    // 3. Portfolio Filtering Logic + "Show More"
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = Array.from(document.querySelectorAll('.portfolio-item'));
    const showMoreBtn = document.getElementById('portfolio-show-more');
    const showMoreWrap = showMoreBtn ? showMoreBtn.parentElement : null;
    const INITIAL_VISIBLE = 9;
    let currentFilter = 'all';
    let expanded = false;

    const applyPortfolioFilter = (animate = true) => {
        let matchIndex = 0;

        portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');
            const matches = currentFilter === 'all' || category === currentFilter;

            item.classList.toggle('hidden', !matches);

            const collapse = matches && !expanded && matchIndex >= INITIAL_VISIBLE;
            item.classList.toggle('collapsed', collapse);
            if (matches) matchIndex++;

            if (matches && !collapse && animate) {
                // Add micro-animation for layout transition
                item.style.opacity = '0';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transition = 'opacity 0.4s ease';
                }, 50);
            }
        });

        if (showMoreWrap) {
            showMoreWrap.hidden = expanded || matchIndex <= INITIAL_VISIBLE;
            showMoreBtn.setAttribute('aria-expanded', String(expanded));
        }
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active from all buttons and add to clicked
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            currentFilter = button.getAttribute('data-filter');
            expanded = false;
            applyPortfolioFilter();
        });
    });

    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', () => {
            expanded = true;
            applyPortfolioFilter();
        });
    }

    applyPortfolioFilter(false);


    // ==========================================
    // 4. Portfolio Lightbox Viewer
    // ==========================================
    const lightbox = document.getElementById('portfolio-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const portfolioImages = document.querySelectorAll('.portfolio-img-container img');
    let lightboxSet = [];
    let lightboxIndex = 0;

    // Only step through photos matching the active filter
    const getBrowsableImages = () => portfolioItems
        .filter(item => !item.classList.contains('hidden'))
        .map(item => item.querySelector('img'));

    const showLightboxImage = (index) => {
        lightboxIndex = (index + lightboxSet.length) % lightboxSet.length;
        const img = lightboxSet[lightboxIndex];
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = img.alt;
    };

    portfolioImages.forEach(img => {
        img.addEventListener('click', () => {
            lightboxSet = getBrowsableImages();
            lightbox.style.display = 'flex';
            lightbox.classList.add('active');
            showLightboxImage(lightboxSet.indexOf(img));
            document.body.style.overflow = 'hidden'; // Lock background scrolling
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.style.display = 'none';
        }, 300);
        document.body.style.overflow = 'auto';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => showLightboxImage(lightboxIndex - 1));
    lightboxNext.addEventListener('click', () => showLightboxImage(lightboxIndex + 1));

    // Close lightbox when clicking outside image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close lightbox on Escape key; arrow keys browse photos
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showLightboxImage(lightboxIndex - 1);
        if (e.key === 'ArrowRight') showLightboxImage(lightboxIndex + 1);
    });


    // ==========================================
    // 5. Booking/Contact Form Submission
    // ==========================================
    const form = document.getElementById('project-contact-form');
    const successBanner = document.getElementById('form-success-banner');
    const submitBtn = document.getElementById('form-submit-btn');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent standard page reload

            // Basic validation check
            const name = document.getElementById('form-name').value.trim();
            const phone = document.getElementById('form-phone').value.trim();
            const service = document.getElementById('form-service').value;
            const message = document.getElementById('form-message').value.trim();

            if (!name || !phone || !service || !message) {
                alert('Please fill out all required fields.');
                return;
            }

            // Show interactive sending state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            // Simulate server network latency
            setTimeout(() => {
                // Fade out form and fade in success message
                form.style.opacity = '0';
                
                setTimeout(() => {
                    form.style.display = 'none';
                    successBanner.style.display = 'flex';
                    successBanner.style.opacity = '0';
                    
                    // Simple animation for success banner
                    setTimeout(() => {
                        successBanner.style.opacity = '1';
                        successBanner.style.transition = 'opacity 0.4s ease';
                    }, 50);
                }, 300);

            }, 1200);
        });
    }

});
