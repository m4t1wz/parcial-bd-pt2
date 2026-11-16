let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const indicator = document.getElementById('current-slide-num');

// Actualizar las diapositivas
function updateSlides() {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[currentSlideIndex].classList.add('active');
    if (indicator) {
        indicator.innerText = currentSlideIndex + 1;
    }
}

function nextSlide() {
    if (currentSlideIndex < totalSlides - 1) {
        currentSlideIndex++;
        updateSlides();
    }
}

function prevSlide() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        updateSlides();
    }
}

// Navegación por teclado (Flechas)
document.addEventListener('keydown', function(event) {
    // Si el modal está abierto, no pasamos de diapositiva
    if (modal.style.display === 'flex') return;

    if (event.key === 'ArrowRight' || event.key === 'Space') {
        nextSlide();
    } else if (event.key === 'ArrowLeft') {
        prevSlide();
    }
});


/* =========================================
   LÓGICA DEL MODAL, ZOOM Y ARRASTRE
   ========================================= */
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("expandedImg");
const closeModalBtn = document.getElementById("closeModalBtn");

let scale = 1;
let isDragging = false;
let startX, startY;
let translateX = 0, translateY = 0;

function openModal(src) {
    modal.style.display = "flex";
    modalImg.src = src;
    
    // Resetear zoom y posición al abrir
    scale = 1;
    translateX = 0;
    translateY = 0;
    applyTransform();
}

function closeModal() {
    modal.style.display = "none";
}

// Aplicar transformaciones visuales al SVG
function applyTransform() {
    modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

// Hacer Zoom con la rueda del ratón
modal.addEventListener('wheel', (e) => {
    if (modal.style.display === "flex") {
        e.preventDefault();

        // Zoom centrado en el cursor
        const rect = modal.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const delta = e.deltaY * -0.005;
        const newScale = Math.min(Math.max(0.3, scale + delta), 20);
        const scaleChange = newScale / scale;

        // Ajusta la traslación para que el zoom sea centrado en el cursor
        translateX = mouseX - scaleChange * (mouseX - translateX);
        translateY = mouseY - scaleChange * (mouseY - translateY);

        scale = newScale;
        applyTransform();
    }
}, { passive: false });

// Doble clic: resetear zoom y posición
modal.addEventListener('dblclick', () => {
    scale = 1;
    translateX = 0;
    translateY = 0;
    applyTransform();
});

// Empezar a arrastrar
modalImg.addEventListener('mousedown', (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto (como guardar imagen)
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
});

// Mover imagen arrastrando
modal.addEventListener('mousemove', (e) => {
    if (isDragging) {
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        applyTransform();
    }
});

// Soltar imagen
modal.addEventListener('mouseup', () => { isDragging = false; });
modal.addEventListener('mouseleave', () => { isDragging = false; });

// Cerrar Modal con botón o tecla ESC
closeModalBtn.addEventListener('click', closeModal);

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Iniciar estado
updateSlides();