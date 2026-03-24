const fresco = document.getElementById('fresco');
const viewport = document.getElementById('viewport');

let targetScale = 0.2;
let targetLeft = 0;
let targetTop = 0;
let isZoomReady = false;

window.addEventListener('load', () => {
    const style = window.getComputedStyle(fresco);
    targetLeft = parseFloat(style.left);
    targetTop = parseFloat(style.top);

    setTimeout(() => {
        targetScale = 2;
        fresco.style.transform = `scale(${targetScale})`;

        setTimeout(() => {
            fresco.style.transition = 'transform 0.1s ease-out, left 0.1s ease-out, top 0.1s ease-out';
            isZoomReady = true;
        }, 2500);
    }, 100);
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