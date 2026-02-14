document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animation - Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Smooth Scroll with Header Offset (Custom implementation for precision)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80; // approximate height of navbar
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {toggle: false});
                    bsCollapse.hide();
                }
            }
        });
    });

    // --- Interactive Pricing Logic ---
    const packageData = {
        basic: {
            message: "Great for startups! Essential features to launch quickly."
        },
        standard: {
            message: "Most Popular! Best balance of features and cost."
        },
        advanced: {
            message: "Enterprise Grade. Full scalability and custom features."
        }
    };

    const buttons = document.querySelectorAll('.select-plan-btn');
    const cards = document.querySelectorAll('.card');
    const tableRows = document.querySelectorAll('.modules-table tbody tr');
    
    // Total Elements
    const totalPriceEl = document.getElementById('total-price');
    const marketPriceEl = document.getElementById('market-price');
    const savingsDisplayEl = document.getElementById('savings-display');
    const messageEl = document.getElementById('selection-message');

    function parsePrice(priceStr) {
        if (!priceStr) return 0;
        return parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
    }

    function formatPrice(amount) {
        return amount.toLocaleString('en-IN');
    }

    function updateSelection(selectedPackage) {
        // 1. Highlight Card
        cards.forEach(card => {
            if (card.getAttribute('data-package') === selectedPackage) {
                card.classList.add('selected-card');
            } else {
                card.classList.remove('selected-card');
            }
        });

        let ourTotal = 0;
        let marketTotal = 0;

        // 2. Filter Table Rows & Calculate Totals
        tableRows.forEach(row => {
            const allowedPackages = row.getAttribute('data-packages').split(',');
            const cells = row.querySelectorAll('td');
            // Assuming col 2 is Our Price (index 2) and col 3 is Market Price (index 3)
             // Check if row is visible for this package
            if (allowedPackages.includes(selectedPackage)) {
                row.classList.remove('dimmed-row');
                row.style.backgroundColor = "rgba(99, 102, 241, 0.1)";
                setTimeout(() => row.style.backgroundColor = "", 300);

                // Calculate Our Price
                const ourPriceText = cells[2].innerText;
                if (!ourPriceText.toLowerCase().includes('included')) {
                     ourTotal += parsePrice(ourPriceText);
                }

                // Calculate Market Price
                const marketPriceText = cells[3].innerText;
                marketTotal += parsePrice(marketPriceText);

            } else {
                row.classList.add('dimmed-row');
            }
        });

        // 3. Update Totals
        totalPriceEl.textContent = `₹${formatPrice(ourTotal)}`;
        marketPriceEl.textContent = `₹${formatPrice(marketTotal)}`;
        
        const savings = marketTotal - ourTotal;
        savingsDisplayEl.textContent = `You Save: ₹${formatPrice(savings)} with our Package`;
        
        if (packageData[selectedPackage]) {
            messageEl.textContent = packageData[selectedPackage].message;
        }

        // 4. Update Buttons & Card Prices (Optional Sync)
        buttons.forEach(btn => {
            if (btn.getAttribute('data-target') === selectedPackage) {
                btn.classList.remove('btn-outline-custom');
                btn.classList.add('btn-primary-custom');
                btn.textContent = "Selected";
            } else {
                btn.classList.add('btn-outline-custom');
                btn.classList.remove('btn-primary-custom');
                const planName = btn.getAttribute('data-target');
                btn.textContent = `Select ${planName.charAt(0).toUpperCase() + planName.slice(1)}`;
            }
        });
        
        // Sync Card Price to calculated total to avoid confusion
        const cardPriceEl = document.querySelector(`.card[data-package="${selectedPackage}"] .plan-price`);
        if(cardPriceEl) {
            // cardPriceEl.textContent = `₹${formatPrice(ourTotal)}`; 
            // Commenting out auto-update of card price to preserve distinct Layout if needed, 
            // but for consistency it's often better. 
            // Given the instruction "add the crt amount", the user likely wants the total to reflect the sum.
        }
    }

    // Attach Listeners
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
             const target = btn.getAttribute('data-target');
             updateSelection(target);
             
             // Smooth scroll to table with offset
             const tableSection = document.querySelector('.modules-table');
             if(tableSection) {
                 const headerOffset = 180; 
                 const elementPosition = tableSection.getBoundingClientRect().top;
                 const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
                 window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                 });
             }
        });
    });

    // Contact Form Prevent Default
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will contact you soon.');
            contactForm.reset();
        });
    }

    // Initialize with Standard Selected
    updateSelection('standard');
});
