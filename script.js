/**
 * Brandon - Interactive Media Design
 * JavaScript para interacciones y animaciones
 */

document.addEventListener('DOMContentLoaded', function() {
    
    /* ========================================
       NAVBAR SCROLL EFFECT
    ======================================== */
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    let ticking = false;

    // Usar requestAnimationFrame para mejor rendimiento
    window.addEventListener('scroll', function() {
        lastScroll = window.pageYOffset;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                if (lastScroll > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    /* ========================================
       MENÚ HAMBURGUESA MOBILE
    ======================================== */
    const hamburger = document.getElementById('hamburger');
    const navbarMenu = document.getElementById('navbarMenu');
    const navbarLinks = document.querySelectorAll('.navbar-link');

    // Toggle del menú al hacer click en hamburguesa
    hamburger.addEventListener('click', function() {
        const isActive = navbarMenu.classList.contains('active');
        
        hamburger.classList.toggle('active');
        navbarMenu.classList.toggle('active');
        
        // Actualizar aria-expanded para accesibilidad
        hamburger.setAttribute('aria-expanded', !isActive);
        
        // Prevenir scroll del body cuando el menú está abierto
        document.body.style.overflow = !isActive ? 'hidden' : '';
    });

    // Cerrar menú al hacer click en un link
    navbarLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navbarMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && navbarMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navbarMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navbarMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navbarMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    /* ========================================
       ANIMACIONES DE ENTRADA AL SCROLL
       (IntersectionObserver)
    ======================================== */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Agregar delay escalonado para elementos en grupo (más rápido)
                const delay = index * 60;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                
                // Dejar de observar una vez animado
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Seleccionar todos los elementos con clase fade-in
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });

    /* ========================================
       SCROLL SUAVE PARA LINKS INTERNOS
    ======================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Si es solo "#" no hacer nada especial
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ========================================
       EFECTO PARALLAX PARA FORMAS GEOMÉTRICAS
    ======================================== */
    const shapes = document.querySelectorAll('.hero-shape');
    
    // Animación de flotación automática para cada forma (duraciones acortadas)
    shapes.forEach((shape, index) => {
        const baseDuration = 6 + Math.random() * 4; // Entre 6 y 10 segundos
        const delay = Math.random() * 2;
        const rotateAmount = (Math.random() - 0.5) * 30; // Rotación entre -15 y 15 grados
        
        // Establecer variables CSS para animación
        shape.style.setProperty('--float-duration', `${baseDuration}s`);
        shape.style.setProperty('--float-delay', `${delay}s`);
        shape.style.setProperty('--rotate-amount', `${rotateAmount}deg`);
        
        // Animación de flotación
        shape.style.animation = `floatShape ${baseDuration}s ease-in-out ${delay}s infinite`;
    });

    // Agregar keyframes de flotación dinámicamente
    const floatKeyframes = document.createElement('style');
    floatKeyframes.textContent = `
        @keyframes floatShape {
            0%, 100% {
                transform: translateY(0) rotate(calc(var(--rotate-amount, 0deg) * 0.5));
            }
            25% {
                transform: translateY(-8px) translateX(5px) rotate(calc(var(--rotate-amount, 0deg) * 0.6));
            }
            50% {
                transform: translateY(-14px) translateX(-3px) rotate(var(--rotate-amount, 0deg));
            }
            75% {
                transform: translateY(-6px) translateX(3px) rotate(calc(var(--rotate-amount, 0deg) * 1.05));
            }
        }
    `;
    document.head.appendChild(floatKeyframes);

    // Efecto parallax con movimiento del mouse
    const heroSection = document.querySelector('.hero');
    const contactSection = document.querySelector('.contact');

    function handleMouseMove(e, section) {
        const shapes = section.querySelectorAll('.hero-shape');
        const rect = section.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        shapes.forEach((shape, index) => {
            const depth = (index + 1) * 0.5;
            const moveX = (mouseX - centerX) * depth * 0.02;
            const moveY = (mouseY - centerY) * depth * 0.02;
            
            shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }

    // Aplicar parallax en hero
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => handleMouseMove(e, heroSection));
        
        // Resetear posición al salir
        heroSection.addEventListener('mouseleave', () => {
            const shapes = heroSection.querySelectorAll('.hero-shape');
            shapes.forEach(shape => {
                shape.style.transform = '';
            });
        });
    }

    // Aplicar parallax en contacto
    if (contactSection) {
        contactSection.addEventListener('mousemove', (e) => handleMouseMove(e, contactSection));
        
        // Resetear posición al salir
        contactSection.addEventListener('mouseleave', () => {
            const shapes = contactSection.querySelectorAll('.hero-shape');
            shapes.forEach(shape => {
                shape.style.transform = '';
            });
        });
    }

    /* ========================================
       ANIMACIÓN DE ILUSTRACIÓN GEOMÉTRICA (SOBRE MÍ)
    ======================================== */
    const geometricArt = document.querySelector('.geometric-art');
    
    if (geometricArt) {
        geometricArt.addEventListener('mousemove', function(e) {
            const squares = this.querySelectorAll('.square');
            const rect = this.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            squares.forEach((square, index) => {
                const depth = (index + 1) * 2;
                const moveX = (mouseX - centerX) * depth * 0.01;
                const moveY = (mouseY - centerY) * depth * 0.01;
                
                square.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${45 * index}deg)`;
            });
        });
        
        geometricArt.addEventListener('mouseleave', function() {
            const squares = this.querySelectorAll('.square');
            squares.forEach((square, index) => {
                square.style.transform = `rotate(${45 * index}deg)`;
            });
        });
    }

    /* ========================================
       EFECTO DE MAGNETISMO EN BOTONES
    ======================================== */
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const mouseX = e.clientX - rect.left - rect.width / 2;
            const mouseY = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${mouseX * 0.1}px, ${mouseY * 0.1}px)`;
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    /* ========================================
       Se eliminaron las animaciones de seguimiento en las tarjetas de servicio
       para simplificar la UI y evitar sobrecarga visual.
    ======================================== */

    /* ========================================
       ANIMACIÓN DE NÚMEROS (CONTADOR)
    ======================================== */
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    /* ========================================
       DETECCIÓN DE MODO REDUCIDO DE MOVIMIENTO
    ======================================== */
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Desactivar animaciones para usuarios que prefieren movimiento reducido
        document.querySelectorAll('.hero-shape, .square').forEach(el => {
            el.style.animation = 'none';
        });
        
        // Desactivar parallax
        if (heroSection) heroSection.removeEventListener('mousemove', handleMouseMove);
        if (contactSection) contactSection.removeEventListener('mousemove', handleMouseMove);
    }

    /* ========================================
       LAZY LOADING PARA IMÁGENES
    ======================================== */
    const images = document.querySelectorAll('img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    /* ========================================
       EFECTO DE BRILLO EN REDES SOCIALES
    ======================================== */
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.2) drop-shadow(0 0 20px rgba(126, 200, 227, 0.5))';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.filter = '';
        });
    });

    /* ========================================
       HACER TODA LA CARD DE PROYECTO CLICKABLE
    ======================================== */
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        const linkEl = card.querySelector('.project-link');
        const url = card.dataset.url || (linkEl ? linkEl.getAttribute('href') : null);
        if (!url) return;
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            // Permitir clicks en enlaces internos (por ejemplo el propio boton) sin duplicar la acción
            if (e.target.closest('a') || e.target.closest('button')) return;
            window.open(url, '_blank', 'noopener');
        });
    });

    /* ========================================
       ACTIVE LINK HIGHLIGHTING
    ======================================== */
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.navbar-link[href="#${sectionId}"]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.style.color = 'var(--color-secondary)';
                } else {
                    navLink.style.color = '';
                }
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);

    /* ========================================
       INICIALIZAR
    ======================================== */
    console.log('🚀 Brandon Portfolio - All interactions loaded');
});