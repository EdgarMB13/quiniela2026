document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Quitar clase activa de todos los links
            navLinks.forEach(l => l.classList.remove('active'));
            // Agregar al link seleccionado
            link.classList.add('active');

            // Ocultar todas las secciones
            sections.forEach(sec => sec.classList.remove('active-section'));
            
            // Mostrar sección deseada
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active-section');
            }
        });
    });
});
