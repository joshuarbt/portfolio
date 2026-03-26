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

    const backHomeLogo = document.getElementById('back-home-flower');

    // 3. On attend 500ms (le temps de la transition CSS du fondu)
    setTimeout(() => {
        // On enlève complètement l'écran de chargement pour qu'il ne bloque pas les clics
        loadingScreen.style.display = 'none';

        if(backHomeLogo) {
            backHomeLogo.style.opacity = '1';
            backHomeLogo.style.pointerEvents = 'auto'; // On le rend cliquable
        }

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

    const zoomIntensity = 0.05;
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

// --- ANIMATION DES YEUX (Bouton Accueil) ---
const flowerEyes = document.getElementById('flower-eyes');
const flowerContainer = document.getElementById('flower-container');

window.addEventListener('mousemove', (e) => {
    // Si la fleur n'est pas sur la page (pour éviter les erreurs), on s'arrête
    if (!flowerEyes || !flowerContainer) return; 

    const rect = flowerContainer.getBoundingClientRect();
    
    // Calcul du centre de la fleur
    const flowerCenterX = rect.left + rect.width / 2;
    const flowerCenterY = rect.top + rect.height / 2;

    // Calcul de la distance souris <-> fleur
    const dx = e.clientX - flowerCenterX;
    const dy = e.clientY - flowerCenterY;
    const angle = Math.atan2(dy, dx);

    // Distance max que les yeux peuvent parcourir. Ajuste ce chiffre !
    const maxDistance = 20; 

    // Calcul du mouvement visuel
    const distance = Math.min(Math.hypot(dx, dy), maxDistance);
    const moveX = distance * Math.cos(angle);
    const moveY = distance * Math.sin(angle);

    // Application aux yeux
    flowerEyes.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
});


// --- NAVIGATION TACTILE (MOBILE) ---
let initialPinchDistance = null;

viewport.addEventListener('touchstart', (e) => {
    // Si on pose 1 seul doigt (Déplacement)
    if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        initialLeft = targetLeft;
        initialTop = targetTop;
        fresco.style.transition = 'none';
    } 
    // Si on pose 2 doigts (Zoom)
    else if (e.touches.length === 2) {
        isDragging = false; // On arrête le déplacement pour se concentrer sur le zoom
        
        // On calcule la distance de départ entre les deux doigts
        initialPinchDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
    }
}, { passive: false }); // Permet d'utiliser e.preventDefault() sur mobile

viewport.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Empêche l'écran de tressauter

    // 1 DOIGT : Déplacement
    if (e.touches.length === 1 && isDragging) {
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        
        targetLeft = initialLeft + dx;
        targetTop = initialTop + dy;
        
        fresco.style.left = `${targetLeft}px`;
        fresco.style.top = `${targetTop}px`;
    } 
    
    // 2 DOIGTS : Zoom
    else if (e.touches.length === 2 && initialPinchDistance && isZoomReady) {
        // Nouvelle distance entre les doigts
        const currentPinchDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );

        // Sensibilité du zoom tactile (à ajuster si ça va trop vite ou trop lentement)
        const zoomSpeed = 0.005; 
        const distanceDiff = currentPinchDistance - initialPinchDistance;
        let previousScale = targetScale;

        // On applique le zoom
        targetScale += distanceDiff * zoomSpeed;
        targetScale = Math.min(Math.max(0.2, targetScale), 4); // Limites du zoom

        if (previousScale === targetScale) {
            initialPinchDistance = currentPinchDistance;
            return;
        }

        // On trouve le point central entre les deux doigts pour zoomer vers ce point
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

        const originX = 2500;
        const originY = 2500;
        const scaleRatio = targetScale / previousScale;

        // Formule mathématique du zoom ciblé
        targetLeft = midX - originX - (midX - targetLeft - originX) * scaleRatio;
        targetTop = midY - originY - (midY - targetTop - originY) * scaleRatio;

        // Application
        fresco.style.left = `${targetLeft}px`;
        fresco.style.top = `${targetTop}px`;
        fresco.style.transform = `scale(${targetScale})`;

        // On met à jour la distance pour le prochain mouvement
        initialPinchDistance = currentPinchDistance;
    }
}, { passive: false });

viewport.addEventListener('touchend', (e) => {
    // Si on enlève un doigt pendant un zoom, on réinitialise le pincement
    initialPinchDistance = null; 
    
    // S'il reste 1 doigt à l'écran, on le reprend comme point de départ pour glisser
    if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        initialLeft = targetLeft;
        initialTop = targetTop;
    } 
    // Si on enlève tous les doigts
    else if (e.touches.length === 0) {
        isDragging = false;
        if(isZoomReady) fresco.style.transition = 'transform 0.1s ease-out, left 0.1s ease-out, top 0.1s ease-out';
    }
});