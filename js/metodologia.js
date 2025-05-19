document.addEventListener('DOMContentLoaded', function() {
    // Manejo de las FAQs
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Cerrar todas las otras preguntas
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle la pregunta actual
            item.classList.toggle('active');
        });
    });
    
    // Manejo del slider de testimonios
    const slider = document.querySelector('.testimonios-slider');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const slides = document.querySelectorAll('.testimonio-card');
    
    let currentSlide = 0;
    const maxSlide = slides.length - 1;
    
    // Función para ir a un slide específico
    const goToSlide = (slideIndex) => {
        slider.scrollTo({
            left: slideIndex * slider.offsetWidth,
            behavior: 'smooth'
        });
        currentSlide = slideIndex;
    };
    
    // Evento para el botón anterior
    prevBtn.addEventListener('click', () => {
        currentSlide = currentSlide === 0 ? maxSlide : currentSlide - 1;
        goToSlide(currentSlide);
    });
    
    // Evento para el botón siguiente
    nextBtn.addEventListener('click', () => {
        currentSlide = currentSlide === maxSlide ? 0 : currentSlide + 1;
        goToSlide(currentSlide);
    });
});
