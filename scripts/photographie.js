const fresco = document.getElementById('fresco');
const viewport = document.getElementById('viewport');

// 1. Zoom au lancement
window.addEventListener('load', () => {
    setTimeout(() => {
        fresco.style.transform = 'scale(1)'; 
    }, 100);
});

// 2. Navigation à la souris (Pan)
let isDragging = false;
let startX, startY;
let initialLeft, initialTop;

viewport.addEventListener('mousedown', (e) => {
    e.preventDefault(); // IMPORTANT : Bloque le comportement par défaut (sélection/drag natif)
    
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    
    const style = window.getComputedStyle(fresco);
    initialLeft = parseFloat(style.left);
    initialTop = parseFloat(style.top);
    
    fresco.style.transition = 'none'; // Coupe l'animation pour un suivi immédiat de la souris
    viewport.style.cursor = 'grabbing';
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    
    fresco.style.left = `${initialLeft + dx}px`;
    fresco.style.top = `${initialTop + dy}px`;
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    // On remet la transition uniquement sur le transform, pas sur le left/top
    fresco.style.transition = 'transform 2.5s cubic-bezier(0.25, 1, 0.5, 1)';
    viewport.style.cursor = 'grab';
});

window.addEventListener('mouseleave', () => {
    isDragging = false;
    viewport.style.cursor = 'grab';
});