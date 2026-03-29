document.addEventListener("DOMContentLoaded", () => {
    
    // ========================================================
    // --- DÉSACTIVATION SUR MOBILE --- 
    // ========================================================
    // Si l'appareil utilise un écran tactile (pointer: coarse) 
    // ou si l'écran est petit (mobile/tablette)
    if (window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 768) {
        return; // Stoppe le script immédiatement. Le curseur ne sera pas créé !
    }

    const totalDots = 10;     
    const innerLength = 4;    
    const density = 0.4;      

    const dots = [];
    let mouse = { x: -100, y: -100 }; 

    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.classList.add('cursor-trail');
        
        if (i < innerLength) {
            dot.classList.add('trail-inner'); 
        } else {
            dot.classList.add('trail-outer'); 
        }
        
        document.body.appendChild(dot);
        dots.push({ x: -100, y: -100, node: dot });
    }

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function animate() {
        cursor.style.left = `${mouse.x}px`;
        cursor.style.top = `${mouse.y}px`;

        let targetX = mouse.x;
        let targetY = mouse.y;

        dots.forEach((dot) => {
            dot.x += (targetX - dot.x) * density;
            dot.y += (targetY - dot.y) * density;
            dot.node.style.left = `${dot.x}px`;
            dot.node.style.top = `${dot.y}px`;
            targetX = dot.x;
            targetY = dot.y;
        });

        requestAnimationFrame(animate);
    }
    animate();

    // --- HOVER SUR LIENS ET PHOTOS --- 
    // On cible le bouton retour ET les photos de la fresque !
    const interactiveElements = document.querySelectorAll('a, button, .fresco-item');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('is-hovering-link');
        });
        
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('is-hovering-link');
        });
    });
});