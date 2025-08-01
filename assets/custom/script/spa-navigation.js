class SPANavigation {
    constructor() {
        this.pages = {
            'home': 'index.html',
            'pipa': 'PIPA.html',
            'about-festival': 'aboutFestival.html',
            'schedule': 'schedule.html',
            'about-plays': 'aboutPlays.html',
            'queries': 'queries.html'
        };

        this.contentContainer = document.getElementById('main-content') || document.body;
        this.init();
    }

    init() {
        // Handle hash changes
        window.addEventListener('hashchange', () => this.handleRouteChange());

        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[data-page]')) {
                e.preventDefault();
                const page = e.target.dataset.page;
                this.navigateTo(page);
            }
        });

        // Load initial page
        this.handleRouteChange();
    }

    navigateTo(page) {
        if (this.pages[page]) {
            window.location.hash = page;
        }
    }

    async handleRouteChange() {
        const hash = window.location.hash.substring(1) || 'home';

        if (this.pages[hash]) {
            await this.loadPage(hash);
            this.updateActiveNavLink(hash);
        }
    }

    async loadPage(page) {
        try {
            // Show loading indicator
            this.showLoading();

            const response = await fetch(this.pages[page]);
            if (!response.ok) throw new Error('Page not found');

            const html = await response.text();

            // Extract content from the fetched HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Get main content (adjust selector based on your HTML structure)
            const newContent = doc.querySelector('main') || doc.querySelector('.container') || doc.body;

            // Update page content
            this.contentContainer.innerHTML = newContent.innerHTML;

            // Update page title
            const title = doc.querySelector('title');
            if (title) document.title = title.textContent;

            // Reinitialize any scripts for the new content
            this.reinitializeScripts();

        } catch (error) {
            console.error('Error loading page:', error);
            this.showError();
        } finally {
            this.hideLoading();
        }
    }

    updateActiveNavLink(currentPage) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current page link
        const activeLink = document.querySelector(`a[data-page="${currentPage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    showLoading() {
        this.contentContainer.innerHTML = `
            <div class="d-flex justify-content-center align-items-center" style="min-height: 400px;">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
    }

    showError() {
        this.contentContainer.innerHTML = `
            <div class="alert alert-danger text-center" role="alert">
                <h4>Page Not Found</h4>
                <p>Sorry, the requested page could not be loaded.</p>
                <button class="btn btn-primary" onclick="window.location.hash='home'">Go Home</button>
            </div>
        `;
    }

    hideLoading() {
        // Loading is hidden when new content is loaded
    }

    reinitializeScripts() {
        // Reinitialize any JavaScript functionality for the new content
        // For example, if you have carousels, modals, etc.

        // Reinitialize Bootstrap components
        if (typeof bootstrap !== 'undefined') {
            // Reinitialize tooltips
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });

            // Reinitialize carousels
            const carousels = document.querySelectorAll('.carousel');
            carousels.forEach(carousel => {
                new bootstrap.Carousel(carousel);
            });
        }

        // Reinitialize your custom scripts
        if (typeof initializeCountdown === 'function') {
            initializeCountdown();
        }
    }
}

// Initialize SPA navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SPANavigation();
});
