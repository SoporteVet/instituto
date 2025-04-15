document.addEventListener('DOMContentLoaded', function() {
    // Performance optimization - use requestAnimationFrame for scroll events
    let lastKnownScrollPosition = 0;
    let ticking = false;
    
    // Mobile menu toggle with improved animation
    const menuToggle = document.querySelector('.mobile-nav-toggle');
    const sideMenu = document.querySelector('.side-menu');
    const body = document.body;
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            sideMenu.classList.toggle('open');
            body.classList.toggle('menu-open');
            this.setAttribute('aria-expanded', 
                this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
            );
        });
    
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.side-menu') && !event.target.closest('.mobile-nav-toggle') && sideMenu.classList.contains('open')) {
                sideMenu.classList.remove('open');
                body.classList.remove('menu-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (sideMenu && sideMenu.classList.contains('open')) {
                    sideMenu.classList.remove('open');
                    body.classList.remove('menu-open');
                    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
                }
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Enhanced scroll animations with intersection observer
    const scrollElements = document.querySelectorAll('.animated-text, .timeline-content, .card-3d, .facility-info');
    
    if ('IntersectionObserver' in window) {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Reduce DOM operations by unobserving after animation
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        scrollElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        // Fallback for browsers not supporting IntersectionObserver
        function elementInView(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top <= window.innerHeight * 0.8 &&
                rect.bottom >= 0
            );
        }
        
        function handleScrollAnimation() {
            scrollElements.forEach((el) => {
                if (elementInView(el) && !el.classList.contains('visible')) {
                    el.classList.add('visible');
                }
            });
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScrollAnimation();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Initialize on page load
        handleScrollAnimation();
    }
    
    // Header change on scroll with optimization
    const header = document.querySelector('header');
    
    function updateHeaderOnScroll(scrollPos) {
        if (scrollPos > 100) {
            if (!header.classList.contains('scrolled')) {
                header.classList.add('scrolled');
            }
        } else {
            if (header.classList.contains('scrolled')) {
                header.classList.remove('scrolled');
            }
        }
    }
    
    window.addEventListener('scroll', () => {
        lastKnownScrollPosition = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateHeaderOnScroll(lastKnownScrollPosition);
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initialize testimonial slider with enhanced options
    const swiperContainer = document.querySelector('.testimonial-slider');
    if (swiperContainer) {
        const swiper = new Swiper('.testimonial-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            speed: 800,
            autoHeight: true,
            grabCursor: true,
            effect: 'fade', // Use fade effect for smoother transitions
            fadeEffect: {
                crossFade: true
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            keyboard: {
                enabled: true,
            },
            a11y: {
                prevSlideMessage: 'Testimonio anterior',
                nextSlideMessage: 'Testimonio siguiente',
            }
        });
    }
    
    // Initialize particles.js with optimized settings
    const particlesContainer = document.getElementById('particles-js');
    if (particlesContainer) {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 50, // Reduced for better performance
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#164193'
                },
                shape: {
                    type: ['circle', 'triangle'], // More variety
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.3,
                    random: true, // More natural look
                    anim: {
                        enable: true,
                        speed: 0.5,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#164193',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1.5, // Slightly slower for better performance
                    direction: 'none',
                    random: true, // More natural movement
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: true,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 0.8 // More visible interaction
                        }
                    },
                    push: {
                        particles_nb: 3 // Reduced for better performance
                    }
                }
            },
            retina_detect: true,
            fps_limit: 60 // Cap framerate for consistent performance
        });
    }
    
    // Add preloader
    window.addEventListener('load', function() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('loaded');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });
});