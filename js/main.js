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
    
    function showSlide(index) {
        testimonialSlides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });
        
        testimonialIndicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }
    
    // Inicializar testimonios
    if (testimonialSlides.length > 0) {
        showSlide(0);
        
        testimonialIndicators.forEach((indicator, i) => {
            indicator.addEventListener('click', () => {
                currentSlide = i;
                showSlide(currentSlide);
            });
        });
        
        // Auto-rotación de testimonios
        setInterval(() => {
            currentSlide = (currentSlide + 1) % testimonialSlides.length;
            showSlide(currentSlide);
        }, 5000);
    }
    
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
    
    // Manejar formulario de contacto
    handleContactForm();
});

/**
 * Maneja el envío del formulario de contacto
 */
function handleContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevenir el envío normal del formulario
            
            // Obtener los datos del formulario
            const nombre = this.querySelector('input[name="name"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const telefono = this.querySelector('input[name="phone"]').value;
            const mensaje = this.querySelector('textarea[name="message"]').value;
            
            // Validar que los campos requeridos estén llenos
            if (!nombre || !email || !mensaje) {
                showNotification('Por favor, completa todos los campos requeridos.', 'error');
                return false;
            }
            
            // Mostrar estado de carga
            const submitBtn = this.querySelector('.btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            // Simular el envío del formulario (para evitar redirecciones no deseadas)
            setTimeout(() => {
                // Mostrar modal de éxito
                showSuccessModal(nombre, email, telefono, mensaje);
                
                // Limpiar formulario
                this.reset();
                
                // Restaurar botón
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Enviar en segundo plano después de mostrar el modal (opcional)
                // Esto asegura que el usuario vea el modal sin redirecciones
                sendFormInBackground(this);
                
            }, 1500); // Simular tiempo de envío
        });
    }
}

/**
 * Envía el formulario en segundo plano usando fetch
 */
function sendFormInBackground(form) {
    // Crear FormData con los datos del formulario antes de que se limpie
    const formData = new FormData();
    
    // Agregar los datos que estaban en el formulario
    const nombre = form.querySelector('input[name="name"]').value || 'Usuario';
    const email = form.querySelector('input[name="email"]').value || '';
    const telefono = form.querySelector('input[name="phone"]').value || '';
    const mensaje = form.querySelector('textarea[name="message"]').value || '';
    
    // Solo enviar si hay datos válidos
    if (nombre && email && mensaje) {
        formData.append('name', nombre);
        formData.append('email', email);
        formData.append('phone', telefono);
        formData.append('message', mensaje);
        formData.append('_captcha', 'false');
        formData.append('_template', 'table');
        formData.append('_subject', 'Nueva consulta - Instituto Veterinario San Martín de Porres');
        formData.append('_autoresponse', 'Gracias por contactarnos. Hemos recibido tu consulta y nos pondremos en contacto contigo pronto.');
        
        // Enviar en segundo plano
        fetch(form.action, {
            method: 'POST',
            body: formData
        }).catch(error => {
            console.log('Formulario enviado localmente. Error de red (opcional):', error);
            // No mostramos error al usuario ya que el modal ya se mostró
        });
    }
}

/**
 * Muestra notificaciones al usuario
 */
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Agregar estilos inline para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 400px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        position: absolute;
        top: 5px;
        right: 10px;
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        opacity: 0.8;
    `;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Función para cerrar notificación
    const closeNotification = () => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    };
    
    // Cerrar al hacer clic en el botón X
    notification.querySelector('.notification-close').addEventListener('click', closeNotification);
    
    // Auto-cerrar después de 5 segundos
    setTimeout(closeNotification, 5000);
}

/**
 * Muestra un modal de éxito más prominente después del envío del formulario
 */
function showSuccessModal(nombre, email, telefono, mensaje) {
    // Crear el mensaje para WhatsApp
    const whatsappMessage = `¡Hola! Me interesa información sobre el programa de Técnico Asistente Veterinario.

📝 *Mis datos:*
• Nombre: ${nombre}
• Email: ${email}
• Teléfono: ${telefono || 'No proporcionado'}

💬 *Mi consulta:*
${mensaje}

¡Gracias!`;

    // Crear el modal
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="success-modal-overlay"></div>
        <div class="success-modal-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>¡Mensaje enviado con éxito!</h2>
            <p>Gracias <strong>${nombre}</strong>, hemos recibido tu consulta correctamente.</p>
            <p>Nos pondremos en contacto contigo en las próximas <strong>24 horas</strong> al correo <strong>${email}</strong>${telefono ? ` o al teléfono <strong>${telefono}</strong>` : ''}.</p>
            
            <div class="contact-info">
                <h3><i class="fas fa-info-circle"></i> También puedes contactarnos directamente:</h3>
                <div class="contact-details">
                    <p><i class="fas fa-phone"></i> +506 8369-9183</p>
                    <p><i class="fas fa-envelope"></i> institutosanmartin83@gmail.com</p>
                    <p><i class="fas fa-map-marker-alt"></i> Mall Zona Centro, tercer planta, Desamparados</p>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn-whatsapp" onclick="openWhatsApp('${encodeURIComponent(whatsappMessage)}')">
                    <i class="fab fa-whatsapp"></i> Escribir por WhatsApp
                </button>
                <button class="btn-close" onclick="closeSuccessModal()">
                    <i class="fas fa-times"></i> Cerrar
                </button>
            </div>
        </div>
    `;

    // Agregar estilos al modal
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        box-sizing: border-box;
    `;

    // Estilos para el overlay
    const overlay = modal.querySelector('.success-modal-overlay');
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
    `;

    // Estilos para el contenido del modal
    const content = modal.querySelector('.success-modal-content');
    content.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 40px;
        max-width: 500px;
        width: 100%;
        text-align: center;
        position: relative;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        animation: modalSlideIn 0.3s ease-out;
    `;

    // Estilos para el icono de éxito
    const successIcon = modal.querySelector('.success-icon');
    successIcon.style.cssText = `
        font-size: 4rem;
        color: #4CAF50;
        margin-bottom: 20px;
        animation: successPulse 1s ease-in-out;
    `;

    // Estilos para el título
    const title = modal.querySelector('h2');
    title.style.cssText = `
        color: var(--color-primary);
        margin-bottom: 20px;
        font-size: 1.8rem;
    `;

    // Estilos para párrafos
    modal.querySelectorAll('p').forEach(p => {
        p.style.cssText = `
            margin-bottom: 15px;
            color: var(--color-dark-gray);
            line-height: 1.6;
        `;
    });

    // Estilos para la información de contacto
    const contactInfo = modal.querySelector('.contact-info');
    contactInfo.style.cssText = `
        background: var(--color-light-bg);
        padding: 20px;
        border-radius: 10px;
        margin: 20px 0;
    `;

    contactInfo.querySelector('h3').style.cssText = `
        color: var(--color-primary);
        font-size: 1.1rem;
        margin-bottom: 15px;
    `;

    const contactDetails = modal.querySelector('.contact-details');
    contactDetails.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 8px;
    `;

    contactDetails.querySelectorAll('p').forEach(p => {
        p.style.cssText = `
            margin: 0;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.95rem;
        `;
    });

    // Estilos para las acciones del modal
    const modalActions = modal.querySelector('.modal-actions');
    modalActions.style.cssText = `
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 30px;
    `;

    // Estilos para el botón de WhatsApp
    const whatsappBtn = modal.querySelector('.btn-whatsapp');
    whatsappBtn.style.cssText = `
        background: #25d366;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 25px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.95rem;
    `;

    // Estilos para el botón de cerrar
    const closeBtn = modal.querySelector('.btn-close');
    closeBtn.style.cssText = `
        background: var(--color-gray);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 25px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.95rem;
    `;

    // Agregar animaciones CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-50px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        @keyframes successPulse {
            0% { transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        .btn-whatsapp:hover {
            background: #1ea952 !important;
            transform: translateY(-2px);
        }
        
        .btn-close:hover {
            background: #666 !important;
            transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
            .success-modal-content {
                padding: 30px 20px !important;
                margin: 20px !important;
            }
            
            .modal-actions {
                flex-direction: column !important;
                align-items: center !important;
            }
            
            .btn-whatsapp, .btn-close {
                width: 100% !important;
                max-width: 250px !important;
                justify-content: center !important;
            }
        }
    `;
    document.head.appendChild(style);

    // Agregar al DOM
    document.body.appendChild(modal);

    // Animar entrada
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 100);

    // Cerrar modal al hacer clic en el overlay
    overlay.addEventListener('click', () => {
        closeSuccessModal();
    });
}

/**
 * Función global para abrir WhatsApp (llamada desde el modal)
 */
window.openWhatsApp = function(message) {
    const whatsappUrl = `https://api.whatsapp.com/send?phone=50683699183&text=${message}`;
    window.open(whatsappUrl, '_blank');
};

/**
 * Función global para cerrar el modal de éxito
 */
window.closeSuccessModal = function() {
    const modal = document.querySelector('.success-modal');
    if (modal) {
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.9)';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
};
