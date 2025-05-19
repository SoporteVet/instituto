document.addEventListener('DOMContentLoaded', function() {
    // Inicializar slider de instalaciones
    const slider = document.getElementById('instalacionesSlider');
    const slides = slider.querySelectorAll('.slide');
    const dots = document.querySelectorAll('#sliderDots .dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;

    // Inicializar slider
    function showSlide(n) {
        // Ocultar todas las slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Desactivar todos los dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Mostrar slide actual
        slides[n].classList.add('active');
        dots[n].classList.add('active');
    }

    // Botones de navegación
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentSlide = (currentSlide > 0) ? currentSlide - 1 : slides.length - 1;
            showSlide(currentSlide);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentSlide = (currentSlide < slides.length - 1) ? currentSlide + 1 : 0;
            showSlide(currentSlide);
        });
    }

    // Navegación con dots
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            showSlide(slideIndex);
            currentSlide = slideIndex;
        });
    });

    // Iniciar la rotación automática del slider
    let sliderInterval = setInterval(function() {
        currentSlide = (currentSlide < slides.length - 1) ? currentSlide + 1 : 0;
        showSlide(currentSlide);
    }, 5000);

    // Pausar rotación al hacer hover
    slider.addEventListener('mouseenter', function() {
        clearInterval(sliderInterval);
    });

    slider.addEventListener('mouseleave', function() {
        sliderInterval = setInterval(function() {
            currentSlide = (currentSlide < slides.length - 1) ? currentSlide + 1 : 0;
            showSlide(currentSlide);
        }, 5000);
    });

    // Testimonios slider
    const testimonios = document.querySelectorAll('#testimoniosSlider .testimonio');
    const testimonioDots = document.querySelectorAll('.testimonios-dots .dot');
    let currentTestimonio = 0;

    function showTestimonio(n) {
        testimonios.forEach(testimonio => {
            testimonio.classList.remove('active');
        });
        
        testimonioDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        testimonios[n].classList.add('active');
        testimonioDots[n].classList.add('active');
    }

    // Navegación testimonios con dots
    testimonioDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const testimonioIndex = parseInt(this.getAttribute('data-testimonio'));
            showTestimonio(testimonioIndex);
            currentTestimonio = testimonioIndex;
        });
    });

    // Rotación automática testimonios
    let testimonioInterval = setInterval(function() {
        currentTestimonio = (currentTestimonio < testimonios.length - 1) ? currentTestimonio + 1 : 0;
        showTestimonio(currentTestimonio);
    }, 7000);

    // Galería modal
    const areaImages = document.querySelectorAll('.area-image');
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('modalImg');
    const modalCaption = document.getElementById('modalCaption');
    const closeModal = document.getElementById('modalClose');

    areaImages.forEach(area => {
        area.addEventListener('click', function() {
            const img = this.querySelector('img');
            const caption = this.closest('.area-card').querySelector('h4').textContent;
            
            modal.style.display = 'block';
            modalImg.src = img.src;
            modalCaption.textContent = caption;
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    // Cerrar modal al hacer clic fuera de la imagen
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Animación de elementos al hacer scroll
    const revealElements = document.querySelectorAll('.reveal');
    
    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on initial load
});
