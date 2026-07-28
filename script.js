document.addEventListener('DOMContentLoaded', () => {

    // --- 1. PAGE PRELOADER DISMISS ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('fade-out');
        });
        // Safety timeout in case load event takes too long
        setTimeout(() => {
            if (!preloader.classList.contains('fade-out')) {
                preloader.classList.add('fade-out');
            }
        }, 1500);
    }

    // --- 2. STICKY NAVBAR HOOK ---
    const navbar = document.getElementById('mainNavbar');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            if (navbar) navbar.classList.add('navbar-scrolled');
        } else {
            if (navbar) navbar.classList.remove('navbar-scrolled');
        }

        // Back to top floating toggler
        if (backToTopBtn) {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    });

    // --- 3. BACK TO TOP SCROLL TRIGGER ---
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- 4. SCROLL ENTRANCE INTERSECTION OBSERVER ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        scrollObserver.observe(element);
    });

    // --- 5. STATS ANIMATED COUNTERS ---
    const counters = document.querySelectorAll('.counter');
    const counterObserverOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 1500; // 1.5s duration
                const startTime = performance.now();

                const animateValue = (currentTime) => {
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);
                    const easeProgress = progress * (2 - progress); // Ease out quadratic
                    
                    const currentValue = Math.floor(easeProgress * target);
                    counter.textContent = currentValue;

                    if (progress < 1) {
                        requestAnimationFrame(animateValue);
                    } else {
                        counter.textContent = target;
                    }
                };

                requestAnimationFrame(animateValue);
                counterObserver.unobserve(counter);
            }
        });
    }, counterObserverOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // --- 6. PORTFOLIO SORTING MECHANICS ---
    window.filterPortfolio = (category) => {
        const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
        const portfolioCards = document.querySelectorAll('.portfolio-item-card');

        // Toggle active button highlight
        filterButtons.forEach(btn => {
            if (btn.getAttribute('onclick').includes(category)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Filter cards
        portfolioCards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            if (category === 'all' || cardCat === category) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    };

    // --- 7. CONTACT FORM: POSTS TO WEB3FORMS, FALLS BACK TO MAILTO ---
    const contactForm = document.getElementById('contactForm');
    const contactFeedback = document.getElementById('contactFeedback');
    const contactError = document.getElementById('contactError');
    const submitBtn = document.getElementById('submitBtn');
    const INBOX = 'naveenkumar.coder@gmail.com';
    const KEY_PLACEHOLDER = 'PASTE_YOUR_ACCESS_KEY_HERE';

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const data = Object.fromEntries(new FormData(contactForm).entries());
            const key = (document.getElementById('w3fKey') || {}).value || '';
            const originalText = submitBtn ? submitBtn.innerHTML : '';

            const showError = () => {
                if (contactError) contactError.classList.remove('d-none');
                setTimeout(() => contactError && contactError.classList.add('d-none'), 12000);
            };

            const showSuccess = (viaMailClient) => {
                const msg = document.getElementById('contactFeedbackText');
                if (msg) {
                    msg.innerHTML = viaMailClient
                        ? '<strong>Your email app is open</strong> with the details filled in. Press send there and I will reply within 24 hours.'
                        : '<strong>Thank you!</strong> Your project details have reached my inbox. I will reply within 24 hours.';
                }
                if (!viaMailClient) contactForm.reset();
                if (contactFeedback) contactFeedback.classList.remove('d-none');
                setTimeout(() => contactFeedback && contactFeedback.classList.add('d-none'), 12000);
            };

            const resetBtn = () => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            };

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...';
            }

            // No access key configured yet - hand the enquiry to the visitor's mail client instead
            // so no lead is ever lost while the form backend is being set up.
            if (!key || key === KEY_PLACEHOLDER) {
                const body = [
                    'Name: ' + (data.name || ''),
                    'Email: ' + (data.email || ''),
                    'Budget: ' + (data.budget || 'Not specified'),
                    '',
                    'Project needed: ' + (data.subject || ''),
                    '',
                    'Details:',
                    data.message || ''
                ].join('\n');

                window.location.href = 'mailto:' + INBOX +
                    '?subject=' + encodeURIComponent('New project enquiry: ' + (data.subject || '')) +
                    '&body=' + encodeURIComponent(body);

                setTimeout(() => { resetBtn(); showSuccess(true); }, 900);
                return;
            }

            try {
                const res = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(data)
                });
                const out = await res.json();
                resetBtn();
                if (out.success) {
                    showSuccess(false);
                } else {
                    showError();
                }
            } catch (err) {
                resetBtn();
                showError();
            }
        });
    }
});
