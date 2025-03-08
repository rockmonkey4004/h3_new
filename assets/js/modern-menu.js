document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');
    
    if (hamburger && mainNav) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            mainNav.classList.toggle('open');
        });
    }
    
    // Dropdown toggles for mobile
    const dropdownToggles = document.querySelectorAll('.has-dropdown > a');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            // Only handle click on mobile view
            if (window.innerWidth <= 980) {
                e.preventDefault();
                const dropdown = this.nextElementSibling;
                
                // Close all other dropdowns
                document.querySelectorAll('.dropdown.open').forEach(openDropdown => {
                    if (openDropdown !== dropdown) {
                        openDropdown.classList.remove('open');
                    }
                });
                
                // Toggle this dropdown
                dropdown.classList.toggle('open');
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.modern-nav')) {
            if (mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                hamburger.classList.remove('active');
            }
        }
    });
}); 