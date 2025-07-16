/**
 * JavaScript principal para el Instituto San Martin de Porres
 * Con corrección para el manejo del navbar
 */

document.addEventListener('DOMContentLoaded', function() {
    // Variables principales
    const navbarContainer = document.querySelector('.navbar-container');
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const revealElements = document.querySelectorAll('.reveal');
    const testimonialSlides = document.querySelectorAll('.testimonial-card');
    const testimonialIndicators = document.querySelectorAll('.testimonial-indicators span');
    
    // Menú móvil - Toggle para abrir/cerrar - Corregido
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.toggle('active');
            mainNav.classList.toggle('open');
            
            // Abrir/cerrar el side menu
            const sideMenu = document.getElementById('side-menu');
            if (sideMenu) {
                sideMenu.classList.toggle('open');
            }
            
            // Añadir un log para depuración
            console.log('Menu toggled, open status:', mainNav.classList.contains('open'));
        });
    }
    
    // Cerrar menú al hacer clic en un enlace - Actualizado para incluir side menu
    document.querySelectorAll('.nav-link, .side-menu-list a').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('open');
            
            // Cerrar también el side menu
            const sideMenu = document.getElementById('side-menu');
            if (sideMenu) {
                sideMenu.classList.remove('open');
            }
            
            if (menuToggle) menuToggle.classList.remove('active');
        });
    });
    
    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', function(event) {
        if (mainNav && menuToggle) {
            // Si el menú está abierto y se hace clic fuera del menú y del botón de toggle
            if (mainNav.classList.contains('open') && 
                !mainNav.contains(event.target) && 
                !menuToggle.contains(event.target)) {
                
                mainNav.classList.remove('open');
                menuToggle.classList.remove('active');
            }
        }
    });
    
    // Efecto de scroll para la navegación - Corregido
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) { // Reducimos el umbral para que se active antes
            if (navbarContainer) {
                navbarContainer.classList.add('scrolled');
                document.body.classList.add('navbar-scrolled'); // Añadimos una clase al body para ajustes adicionales
            }
        } else {
            if (navbarContainer) {
                navbarContainer.classList.remove('scrolled');
                document.body.classList.remove('navbar-scrolled');
            }
        }
        
        // Animar elementos al hacer scroll
        revealOnScroll();
    });
    
    // Función para animar elementos al hacer scroll
    function revealOnScroll() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    }
    
    // Testimonios - Control del slider
    let currentSlide = 0;
    let isAutoPlaying = true;
    let autoPlayInterval;
    let isMobile = window.innerWidth <= 768;
    
    function showSlide(index, direction = null) {
        // Si es móvil y hay dirección, aplicar animación
        if (isMobile && direction) {
            const currentCard = testimonialSlides[currentSlide];
            const nextCard = testimonialSlides[index];
            
            // Animar salida de la tarjeta actual
            if (currentCard) {
                currentCard.classList.add(direction === 'next' ? 'slide-out-left' : 'slide-out-right');
            }
            
            setTimeout(() => {
                // Ocultar todas las tarjetas
                testimonialSlides.forEach((slide, i) => {
                    slide.style.display = 'none';
                    slide.classList.remove('slide-out-left', 'slide-out-right', 'slide-in-left', 'slide-in-right');
                });
                
                // Mostrar y animar la nueva tarjeta
                if (nextCard) {
                    nextCard.style.display = 'block';
                    nextCard.classList.add(direction === 'next' ? 'slide-in-right' : 'slide-in-left');
                    
                    // Limpiar las clases de animación después de la animación
                    setTimeout(() => {
                        nextCard.classList.remove('slide-in-left', 'slide-in-right');
                    }, 400);
                }
            }, 200);
        } else {
            // Comportamiento normal para PC
            testimonialSlides.forEach((slide, i) => {
                slide.style.display = i === index ? 'block' : 'none';
                slide.classList.remove('slide-out-left', 'slide-out-right', 'slide-in-left', 'slide-in-right');
            });
        }
        
        testimonialIndicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }
    
    function nextSlide() {
        const newSlide = (currentSlide + 1) % testimonialSlides.length;
        showSlide(newSlide, 'next');
        currentSlide = newSlide;
    }
    
    function prevSlide() {
        const newSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
        showSlide(newSlide, 'prev');
        currentSlide = newSlide;
    }
    
    function showSwipeIndicator(direction) {
        if (!isMobile) return;
        
        const indicator = document.querySelector(`.swipe-indicator.${direction}`);
        if (indicator) {
            indicator.classList.add('show');
            setTimeout(() => {
                indicator.classList.remove('show');
            }, 300);
        }
    }
    
    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            if (isAutoPlaying) {
                nextSlide();
            }
        }, 7000);
    }
    
    function stopAutoPlay() {
        isAutoPlaying = false;
        if (autoPlayInterval) clearInterval(autoPlayInterval);
    }
    
    function resumeAutoPlay() {
        isAutoPlaying = true;
        startAutoPlay();
    }
    
    // Inicializar testimonios
    if (testimonialSlides.length > 0) {
        showSlide(0);
        
        // Botones de navegación para PC
        const leftArrow = document.querySelector('.testimonial-arrow-left');
        const rightArrow = document.querySelector('.testimonial-arrow-right');
        
        if (leftArrow) {
            leftArrow.addEventListener('click', () => {
                stopAutoPlay();
                prevSlide();
                setTimeout(resumeAutoPlay, 3000); // Reanudar después de 3 segundos
            });
        }
        
        if (rightArrow) {
            rightArrow.addEventListener('click', () => {
                stopAutoPlay();
                nextSlide();
                setTimeout(resumeAutoPlay, 3000); // Reanudar después de 3 segundos
            });
        }
        
        // Indicadores clickeables
        testimonialIndicators.forEach((indicator, i) => {
            indicator.addEventListener('click', () => {
                stopAutoPlay();
                currentSlide = i;
                showSlide(currentSlide);
                setTimeout(resumeAutoPlay, 3000); // Reanudar después de 3 segundos
            });
        });
        
        // Navegación táctil para móvil
        const testimonialSlider = document.querySelector('.testimonials-slider');
        if (testimonialSlider) {
            let startX = 0;
            let isDragging = false;
            let currentX = 0;
            
            // Touch events para móvil
            testimonialSlider.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                currentX = startX;
                isDragging = true;
                stopAutoPlay();
            });
            
            testimonialSlider.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                e.preventDefault(); // Prevenir scroll
                
                currentX = e.touches[0].clientX;
                const diffX = startX - currentX;
                
                // Mostrar indicador visual basado en la dirección del swipe
                if (Math.abs(diffX) > 20) {
                    if (diffX > 0) {
                        showSwipeIndicator('right'); // Swipe izquierda -> siguiente
                    } else {
                        showSwipeIndicator('left'); // Swipe derecha -> anterior
                    }
                }
            });
            
            testimonialSlider.addEventListener('touchend', (e) => {
                if (!isDragging) return;
                isDragging = false;
                
                const endX = e.changedTouches[0].clientX;
                const diffX = startX - endX;
                
                // Si el deslizamiento es mayor a 50px
                if (Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        nextSlide(); // Deslizar a la izquierda - siguiente
                    } else {
                        prevSlide(); // Deslizar a la derecha - anterior
                    }
                }
                
                setTimeout(resumeAutoPlay, 3000); // Reanudar después de 3 segundos
            });
            
            // Mouse events para PC (opcional, para mejor UX)
            testimonialSlider.addEventListener('mousedown', (e) => {
                startX = e.clientX;
                isDragging = true;
                stopAutoPlay();
                testimonialSlider.style.cursor = 'grabbing';
            });
            
            testimonialSlider.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
            });
            
            testimonialSlider.addEventListener('mouseup', (e) => {
                if (!isDragging) return;
                isDragging = false;
                testimonialSlider.style.cursor = 'grab';
                
                const endX = e.clientX;
                const diffX = startX - endX;
                
                if (Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                }
                
                setTimeout(resumeAutoPlay, 3000);
            });
            
            testimonialSlider.addEventListener('mouseleave', () => {
                if (isDragging) {
                    isDragging = false;
                    testimonialSlider.style.cursor = 'grab';
                    setTimeout(resumeAutoPlay, 3000);
                }
            });
        }
        
        // Iniciar auto-reproducción
        startAutoPlay();
    }
    
    // Actualizar el estado móvil cuando cambie el tamaño de la ventana
    window.addEventListener('resize', () => {
        isMobile = window.innerWidth <= 768;
    });
    
    // Funcionalidad de "Cargar más" para los cursos
    const loadMoreBtn = document.getElementById('load-more-courses');
    const hiddenCourses = document.querySelectorAll('.course-hidden');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Mostrar todos los cursos ocultos
            hiddenCourses.forEach(course => {
                course.classList.remove('course-hidden');
                course.classList.add('course-visible');
                
                // Animación de aparición
                setTimeout(() => {
                    course.classList.add('active');
                }, 100);
            });
            
            // Ocultar el botón después de mostrar todos los cursos
            this.style.display = 'none';
        });
    }
    
    // Agregar soporte para tarjetas flip en dispositivos táctiles
    const featureCards = document.querySelectorAll('.feature-card');

    if (featureCards.length > 0) {
        featureCards.forEach(card => {
            card.addEventListener('click', function() {
                // Si estamos en un dispositivo táctil, aplicamos la clase 'touch'
                if (window.matchMedia('(hover: none)').matches) {
                    this.classList.toggle('touch');
                    
                    // Eliminar la clase de otras tarjetas cuando se toca una nueva
                    featureCards.forEach(otherCard => {
                        if (otherCard !== this) {
                            otherCard.classList.remove('touch');
                        }
                    });
                }
            });
        });
    }
    
    // Side Menu Toggle
    const sideMenu = document.getElementById('side-menu');
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');

    if (mobileNavToggle && sideMenu) {
        mobileNavToggle.addEventListener('click', () => {
            sideMenu.classList.toggle('open');
            mobileNavToggle.classList.toggle('open');
        });

        // Cerrar el menú al hacer clic en un enlace
        document.querySelectorAll('.side-menu-list a').forEach(link => {
            link.addEventListener('click', () => {
                sideMenu.classList.remove('open');
                mobileNavToggle.classList.remove('open');
            });
        });
    }

    // Botón de cierre del side menú
    const sideMenuClose = document.getElementById('side-menu-close');
    if (sideMenuClose && sideMenu) {
        sideMenuClose.addEventListener('click', () => {
            sideMenu.classList.remove('open');
            if (menuToggle) menuToggle.classList.remove('active');
        });
    }

    // Inicializar funciones
    revealOnScroll();

    // Manejo del formulario de contacto
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener los datos del formulario
            const formData = new FormData(this);
            const nombre = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const telefono = this.querySelector('input[type="tel"]').value;
            const consulta = this.querySelector('textarea').value;
            
            // Validación básica
            if (!nombre || !email) {
                alert('Por favor, completa los campos obligatorios (Nombre y Email).');
                return;
            }
            
            // Preparar los datos para enviar
            const datos = {
                nombre: nombre,
                email: email,
                telefono: telefono,
                consulta: consulta
            };
            
            // Aquí puedes elegir una de las opciones siguientes:
            
            // OPCIÓN 1: EmailJS (más fácil, sin servidor)
            enviarConEmailJS(datos);

            
        });
    }
    
    // OPCIÓN 1: Función para enviar con EmailJS (recomendado para empezar)
    function enviarConEmailJS(datos) {
        // Necesitas registrarte en https://www.emailjs.com/ y obtener tus claves
        // Reemplaza 'TU_SERVICE_ID', 'TU_TEMPLATE_ID', 'TU_PUBLIC_KEY' con tus datos reales
        
        emailjs.send('service_9ua4k9s', 'template_35vasnc', {
            from_name: datos.nombre,
            from_email: datos.email,
            phone: datos.telefono,
            message: datos.consulta
        }, 'ZiyjOCMRsBnxJn_LT')
        .then(function(response) {
            // Mostrar modal de éxito en lugar de alert
            showSuccessModal();
            document.querySelector('.contact-form').reset();
        }, function(error) {
            alert('Error al enviar el mensaje. Por favor, intenta nuevamente.');
            console.error('Error:', error);
        });
    }
    
    // Función para mostrar el modal de éxito
    function showSuccessModal() {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevenir scroll del body
        }
    }
    
    // Función para cerrar el modal
    function closeSuccessModal() {
        console.log('Función closeSuccessModal llamada'); // Debug
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // Restaurar scroll del body
            console.log('Modal cerrado exitosamente'); // Debug
        } else {
            console.log('Modal no encontrado'); // Debug
        }
    }
    
    // Configurar event listeners para el modal
    const modal = document.getElementById('success-modal');
    const closeBtn = document.getElementById('close-modal');
    
    // Cerrar modal con el botón
    if (closeBtn) {
        console.log('Botón de cerrar modal encontrado'); // Debug
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Botón de cerrar modal clickeado'); // Debug
            closeSuccessModal();
        });
    } else {
        console.log('Botón de cerrar modal NO encontrado'); // Debug
    }
    
    // Cerrar modal haciendo clic fuera de él
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeSuccessModal();
            }
        });
    }
    
    // Cerrar modal con la tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
            closeSuccessModal();
        }
    });
    
  
});
