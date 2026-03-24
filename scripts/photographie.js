const fresco = document.getElementById('fresco');
const viewport = document.getElementById('viewport');
const loadingScreen = document.getElementById('loading-screen'); // On récupère l'écran de chargement

let targetScale = 0.2; 
let targetLeft = 0;
let targetTop = 0;
let isZoomReady = false; 

window.addEventListener('load', () => {
    // 1. La page est chargée, on prépare les coordonnées de la fresque
    const style = window.getComputedStyle(fresco);
    targetLeft = parseFloat(style.left);
    targetTop = parseFloat(style.top);

    // 2. On fait disparaître l'écran de chargement en fondu
    loadingScreen.style.opacity = '0';

    // 3. On attend 500ms (le temps de la transition CSS du fondu)
    setTimeout(() => {
        // On enlève complètement l'écran de chargement pour qu'il ne bloque pas les clics
        loadingScreen.style.display = 'none';

        // 4. ET LÀ on lance la fameuse animation de zoom de ta fresque
        setTimeout(() => {
            targetScale = 1;
            fresco.style.transform = `scale(${targetScale})`; 
            
            setTimeout(() => {
                fresco.style.transition = 'transform 0.1s ease-out, left 0.1s ease-out, top 0.1s ease-out';
                isZoomReady = true; 
            }, 2500);
        }, 100); // Petit délai de sécurité avant de zoomer

    }, 500); 
});

let isDragging = false;
let startX, startY, initialLeft, initialTop;

viewport.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialLeft = targetLeft;
    initialTop = targetTop;
    fresco.style.transition = 'none';
    viewport.style.cursor = 'grabbing';
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    targetLeft = initialLeft + dx;
    targetTop = initialTop + dy;
    fresco.style.left = `${targetLeft}px`;
    fresco.style.top = `${targetTop}px`;
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    viewport.style.cursor = 'grab';
    if (isZoomReady) fresco.style.transition = 'transform 0.1s ease-out, left 0.1s ease-out, top 0.1s ease-out';
});

window.addEventListener('mouseleave', () => {
    isDragging = false;
    viewport.style.cursor = 'grab';
});

viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (!isZoomReady) return;

    const zoomIntensity = 0.1;
    let previousScale = targetScale;

    if (e.deltaY < 0) targetScale += zoomIntensity;
    else targetScale -= zoomIntensity;

    targetScale = Math.min(Math.max(0.2, targetScale), 4);
    if (previousScale === targetScale) return;

    const originX = 2500;
    const originY = 2500;
    const scaleRatio = targetScale / previousScale;

    targetLeft = e.clientX - originX - (e.clientX - targetLeft - originX) * scaleRatio;
    targetTop = e.clientY - originY - (e.clientY - targetTop - originY) * scaleRatio;

    fresco.style.left = `${targetLeft}px`;
    fresco.style.top = `${targetTop}px`;
    fresco.style.transform = `scale(${targetScale})`;
}, { passive: false });