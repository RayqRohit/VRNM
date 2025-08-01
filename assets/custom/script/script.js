(function () {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBannerPreloader);
    } else {
        initBannerPreloader();
    }

    function initBannerPreloader() {
        const banner = document.querySelector('.video-banner');
        if (!banner) return;

        const imagePaths = [
            'assets/images/slider/slide-1.png',
            'assets/images/slider/slide-2.png',
            'assets/images/slider/slide-3.png',
            'assets/images/slider/slide-4.png',
            'assets/images/slider/slide-5.png'
        ];

        let loadedCount = 0;
        const totalImages = imagePaths.length;
        const imagePromises = [];

        banner.style.opacity = '0';
        banner.style.background = '#003e6d';

        imagePaths.forEach((path, index) => {
            const promise = new Promise((resolve, reject) => {
                const img = new Image();

                img.onload = () => {
                    loadedCount++;
                    console.log(`✓ Loaded: ${path} (${loadedCount}/${totalImages})`);
                    resolve(path);
                };

                img.onerror = () => {
                    loadedCount++;
                    console.warn(`✗ Failed to load: ${path}`);
                    resolve(path);
                };

                img.src = path;
            });

            imagePromises.push(promise);
        });

        Promise.all(imagePromises).then(() => {
            console.log('🎉 All banner images preloaded!');

            // Remove loading text
            const loadingText = banner.querySelector('div[style*="Loading Festival Images"]');
            if (loadingText) {
                loadingText.remove();
            }

            banner.style.background = '';
            banner.style.opacity = '1';
            banner.classList.add('images-ready');

            setTimeout(() => {
                banner.classList.add('start-animation');
            }, 100);
        });
    }
})();

// Initialize GLightbox variable
let lightbox;

// Main DOMContentLoaded event handler
document.addEventListener('DOMContentLoaded', function () {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            once: true,
            duration: 1000,
        });
    }

    // Initialize GLightbox
    if (typeof GLightbox !== 'undefined') {
        lightbox = GLightbox({
            selector: '.glightbox'
        });
    }

    // Scroll to Top Button Functionality
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 50) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        // Smooth scroll to top when button is clicked
        scrollToTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Load More Button Functionality with Button Repositioning
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const additionalBento = document.getElementById('bento-additional');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    const loadMoreContainerEnd = document.getElementById('loadMoreContainerEnd');
    let isLoaded = false;

    if (loadMoreBtn && additionalBento) {
        loadMoreBtn.addEventListener('click', function () {
            if (!isLoaded) {
                // Show loading state
                loadMoreBtn.classList.add('loading');
                const btnText = loadMoreBtn.querySelector('.btn-text');
                btnText.textContent = 'Loading...';

                // Simulate loading delay
                setTimeout(() => {
                    // Show additional images
                    additionalBento.style.display = 'grid';

                    // Trigger animation after a small delay
                    setTimeout(() => {
                        additionalBento.classList.add('show');
                    }, 50);

                    // Move button to the end after loading completes
                    setTimeout(() => {
                        // Update button text and icon
                        btnText.textContent = 'Show Less';
                        const icon = loadMoreBtn.querySelector('i');
                        if (icon) {
                            icon.className = 'bi bi-arrow-up-circle ms-2';
                        }
                        loadMoreBtn.classList.remove('loading');

                        // Move button from original position to end (if containers exist)
                        if (loadMoreContainer && loadMoreContainerEnd) {
                            loadMoreContainerEnd.appendChild(loadMoreBtn);
                            loadMoreContainerEnd.style.display = 'block';
                            loadMoreContainer.style.display = 'none';
                        }

                        isLoaded = true;
                    }, 300);

                    // Reinitialize GLightbox to include new images
                    if (lightbox && typeof lightbox.destroy === 'function') {
                        lightbox.destroy();
                    }
                    if (typeof GLightbox !== 'undefined') {
                        lightbox = GLightbox({
                            selector: '.glightbox'
                        });
                    }

                    // Refresh AOS for new images
                    if (typeof AOS !== 'undefined') {
                        AOS.refresh();
                    }

                    // Smooth scroll to new content
                    setTimeout(() => {
                        additionalBento.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 100);
                }, 800);

            } else {
                // Hide additional images
                additionalBento.classList.remove('show');

                setTimeout(() => {
                    additionalBento.style.display = 'none';

                    // Update button text and move back to original position
                    const btnText = loadMoreBtn.querySelector('.btn-text');
                    btnText.textContent = 'Load More Images';
                    const icon = loadMoreBtn.querySelector('i');
                    if (icon) {
                        icon.className = 'bi bi-arrow-down-circle ms-2';
                    }

                    // Move button back to original position (if containers exist)
                    if (loadMoreContainer && loadMoreContainerEnd) {
                        loadMoreContainer.appendChild(loadMoreBtn);
                        loadMoreContainer.style.display = 'block';
                        loadMoreContainerEnd.style.display = 'none';
                    }

                    isLoaded = false;

                    // Scroll back to main grid
                    const bentoMain = document.getElementById('bento-main');
                    if (bentoMain) {
                        bentoMain.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 300);
            }
        });
    }
});

// Navbar scroll effect
document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 0) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
});

// Navbar mobile functionality
document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.getElementById('mainNavbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const body = document.body;

    if (!navbar || !navbarToggler) return;

    // Function to prevent body scroll
    function preventBodyScroll() {
        body.classList.add('navbar-open');
    }

    // Function to allow body scroll
    function allowBodyScroll() {
        body.classList.remove('navbar-open');
    }

    // Listen for Bootstrap collapse events to control body scroll
    navbar.addEventListener('show.bs.collapse', function () {
        preventBodyScroll();
    });

    navbar.addEventListener('hide.bs.collapse', function () {
        allowBodyScroll();
    });

    // Close menu when clicking outside (on backdrop)
    document.addEventListener('click', function (e) {
        const isClickInsideNavbar = navbar.contains(e.target);
        const isClickOnToggler = navbarToggler.contains(e.target);
        const isMenuOpen = navbar.classList.contains('show');

        // If menu is open and click is outside navbar and not on toggler
        if (isMenuOpen && !isClickInsideNavbar && !isClickOnToggler) {
            navbarToggler.click();
        }
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navbar.classList.contains('show')) {
            navbarToggler.click();
        }
    });

    // Close menu when clicking on nav links (for better UX)
    const navLinks = navbar.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (window.innerWidth <= 991.98) {
                navbarToggler.click();
            }
        });
    });

    // Handle window resize - close menu if screen becomes desktop size
    window.addEventListener('resize', function () {
        if (window.innerWidth > 991.98 && navbar.classList.contains('show')) {
            navbarToggler.click();
        }
    });

    // Clean up on page unload
    window.addEventListener('beforeunload', function () {
        allowBodyScroll();
    });
});

// Countdown timer
function startCountdown(targetDate) {
    const countdown = document.getElementById('festival-countdown');
    const countdownSection = document.getElementById('festival-countdown-section');

    if (!countdown || !countdownSection) return;

    function update() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            // Fade out for smoothness (optional)
            countdownSection.style.transition = "opacity 0.6s";
            countdownSection.style.opacity = 0;
            setTimeout(() => {
                countdownSection.remove();
            }, 650); // Wait for fade-out before removing
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        countdown.innerHTML = `
            <span><span class="count-number">${days}</span><span class="label">Days</span></span>
            <span><span class="count-number">${hours}</span><span class="label">Hours</span></span>
            <span><span class="count-number">${minutes}</span><span class="label">Minutes</span></span>
            <span><span class="count-number">${seconds}</span><span class="label">Seconds</span></span>
        `;
    }

    update();
    setInterval(update, 1000);
}

// Initialize countdown to 19th August 2025
if (document.getElementById('festival-countdown')) {
    startCountdown(new Date("2025-08-19T00:00:00"));
}
