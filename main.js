/**
 * Lucky Shrub - JavaScript principal
 * Maneja interacciones, animaciones y funcionalidades del sitio web
 * Autor: Andre - 2025
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Botón scroll-to-top
    const scrollToTop = document.getElementById('scrollToTop');
    if (scrollToTop) {
        window.addEventListener('scroll', () => {
            scrollToTop.classList.toggle('show', window.scrollY > 200);
        });
        scrollToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // Activar animaciones de entrada
    document.querySelectorAll('.animate-on-load').forEach((el, i) => {
        setTimeout(() => el.classList.remove('animate-on-load'), i * 100);
    });

    // Lazy loading para imágenes
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '50px 0px' });
    
    document.querySelectorAll('img[loading="lazy"]').forEach(img => imageObserver.observe(img));

    // Modal de la galería
    const modal = document.getElementById('galleryModal');
    if (modal) {
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        const modalClose = document.querySelector('.modal-close');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        // Abrir modal
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                modalImage.src = item.dataset.image;
                modalTitle.textContent = item.dataset.title;
                modalDescription.innerHTML = `<p>${item.dataset.description}</p>`;
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Cerrar modal
        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('show')) closeModal(); });
        
        function closeModal() {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // Filtros de la galería
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length && galleryItems.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Actualizar botón activo
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filtrar elementos
                const filterValue = button.dataset.filter;
                galleryItems.forEach(item => {
                    if (filterValue === 'todos' || item.dataset.category === filterValue) {
                        item.style.display = 'block';
                        item.style.opacity = '1';
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => { item.style.display = 'none'; }, 200);
                    }
                });
            });
        });
    }

    // Validación del formulario de contacto
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('¡Gracias por tu solicitud! Te contactaremos pronto.');
        });
    }

    // Buscador de plantas en vivero
    const plantSearch = document.getElementById('plantSearch');
    if (plantSearch) {
        plantSearch.addEventListener('input', function() {
            const query = plantSearch.value.toLowerCase();
            document.querySelectorAll('[data-plant]').forEach(item => {
                item.style.display = item.dataset.plant.toLowerCase().includes(query) ? '' : 'none';
            });
        });
    }

    // Optimización de imágenes para mejor rendimiento
    function compressImage(img, maxWidth = 1200, quality = 0.7) {
        if (img.dataset.compressed === "true") return;
        
        if (!img.complete) {
            img.onload = () => compressImage(img, maxWidth, quality);
            return;
        }
        
        if (img.naturalWidth > maxWidth) {
            const canvas = document.createElement('canvas');
            const scale = maxWidth / img.naturalWidth;
            canvas.width = maxWidth;
            canvas.height = img.naturalHeight * scale;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            img.src = canvas.toDataURL('image/jpeg', quality);
        }
        
        img.dataset.compressed = "true";
    }

    // Aplicar optimizaciones a todas las imágenes
    document.querySelectorAll('img[loading="lazy"], img[loading="eager"]').forEach(img => {
        if (!img.src.endsWith('.svg')) {
            compressImage(img);
        }
        
        // Imagen de placeholder en caso de error
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/600x400?text=Imagen+no+disponible';
            this.classList.add('img-placeholder');
        };
    });

});
