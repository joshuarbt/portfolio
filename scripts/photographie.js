const fresco = document.getElementById('fresco');
const viewport = document.getElementById('viewport');
const loadingScreen = document.getElementById('loading-screen'); 

let targetScale = 0.2;
let targetLeft = 0;
let targetTop = 0;
let isZoomReady = false;

// --- AJOUT : Variables pour mémoriser le centre exact ---
let centerLeft = 0;
let centerTop = 0;

window.addEventListener('load', () => {
    const style = window.getComputedStyle(fresco);
    targetLeft = parseFloat(style.left);
    targetTop = parseFloat(style.top);

    // --- AJOUT : On sauvegarde la position initiale "Maison" ---
    centerLeft = targetLeft;
    centerTop = targetTop;

    // 2. On fait disparaître l'écran de chargement en fondu
    loadingScreen.style.opacity = '0';
    
    // ... (Le reste du code de ton window.addEventListener('load') ne change pas) ...

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
    document.body.classList.add('is-dragging-fresco');
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

window.addEventListener('mouseup', (e) => {
    isDragging = false;
    document.body.classList.remove('is-dragging-fresco'); // Remet le curseur normal
    
    // On calcule la distance parcourue entre le clic et le relâchement
    const dx = Math.abs(e.clientX - startX);
    const dy = Math.abs(e.clientY - startY);

    // Si on a bougé de moins de 5 pixels ET qu'on a cliqué sur une photo
    if (dx < 5 && dy < 5 && e.target.classList.contains('photo-box')) {
        focusOnPhoto(e.target); // On zoome dessus !
    } else {
        // Sinon, c'était juste un glissement de la fresque, on remet la transition normale
        if (isZoomReady) fresco.style.transition = 'transform 0.1s ease-out, left 0.1s ease-out, top 0.1s ease-out';
    }
});

window.addEventListener('mouseleave', () => {
    isDragging = false;
    document.body.classList.remove('is-dragging-fresco');
});

viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (!isZoomReady) return;

    // ========================================================
    // --- LA MAGIE : DÉTECTION SOURIS vs TRACKPAD ---
    // Une vraie souris avec des "crans" envoie des valeurs fortes (>=40), 
    // des nombres entiers (sans virgule), et pas de mouvement X.
    // ========================================================
    const isNotchedMouse = Math.abs(e.deltaY) >= 40 && e.deltaX === 0 && (e.deltaY % 1 === 0);

    // 1. ZOOM : Pincement Trackpad (Ctrl) OU Molette souris classique
    if (e.ctrlKey || isNotchedMouse) {
        
        // Comme une souris envoie "100" et un trackpad "2", 
        // on adapte la force du zoom pour que la souris ne zoome pas 50x trop vite !
        const zoomIntensity = isNotchedMouse ? 0.001 : 0.005; 
        
        let previousScale = targetScale;

        targetScale -= e.deltaY * zoomIntensity;
        targetScale = Math.min(Math.max(0.2, targetScale), 4);
        
        if (previousScale === targetScale) return;

        const originX = 2500;
        const originY = 2500;
        const scaleRatio = targetScale / previousScale;

        targetLeft = e.clientX - originX - (e.clientX - targetLeft - originX) * scaleRatio;
        targetTop = e.clientY - originY - (e.clientY - targetTop - originY) * scaleRatio;
    } 
    // 2. DÉPLACEMENT : Glissement 2 doigts Trackpad (sans Ctrl)
    else {
        const panSpeed = 1.2; 
        targetLeft -= e.deltaX * panSpeed;
        targetTop -= e.deltaY * panSpeed;
    }

    // Application fluide des transformations
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

    // MODIFICATION MOBILE ICI
    // Détermine la distance maximale en fonction de la largeur de l'écran
    // 768px est un seuil courant pour le mobile
    const mobileBreakpoint = 768; 
    const maxDistance = window.innerWidth < mobileBreakpoint ? 7 : 20; // 10px sur mobile, 20px sur bureau

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
        const zoomSpeed = 0.002; 
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

    else if (e.touches.length === 0) {
        isDragging = false;
        document.body.classList.remove('is-dragging-fresco');
        
        // On récupère les coordonnées du doigt qui vient de se lever
        const touch = e.changedTouches[0];
        const dx = Math.abs(touch.clientX - startX);
        const dy = Math.abs(touch.clientY - startY);

        // Si c'est un tap (moins de 5px de glissement) sur une photo
        if (dx < 5 && dy < 5 && e.target.classList.contains('photo-box')) {
            focusOnPhoto(e.target); // On zoome dessus !
        } else {
            // Sinon (fin de glissement)
            if(isZoomReady) fresco.style.transition = 'transform 0.1s ease-out, left 0.1s ease-out, top 0.1s ease-out';
        }
    }
});


// ========================================================
// --- FONCTION : CENTRER ET ZOOMER SUR UNE PHOTO --- 
// ========================================================

function focusOnPhoto(photo) {
    // 1. Récupérer la position actuelle et la taille de la photo à l'écran
    const rect = photo.getBoundingClientRect();
    const photoCenterX = rect.left + rect.width / 2;
    const photoCenterY = rect.top + rect.height / 2;

    // 2. Calculer le centre de ton écran
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const screenCenterX = screenWidth / 2;
    const screenCenterY = screenHeight / 2;

    // 3. Trouver où se trouve le centre d'origine de la fresque (2500, 2500)
    const originScreenX = targetLeft + 2500;
    const originScreenY = targetTop + 2500;

    // 4. Calculer la distance (offset) et la taille réelle de la photo (sans le zoom actuel)
    const unscaledOffsetX = (photoCenterX - originScreenX) / targetScale;
    const unscaledOffsetY = (photoCenterY - originScreenY) / targetScale;
    
    const unscaledPhotoWidth = rect.width / targetScale;
    const unscaledPhotoHeight = rect.height / targetScale;

    // ========================================================
    // 5. LA MAGIE : CALCUL DU ZOOM PARFAIT
    // On calcule le zoom nécessaire pour que la photo prenne 80% de la largeur OU 75% de la hauteur
    const scaleForWidth = (screenWidth * 0.8) / unscaledPhotoWidth;
    const scaleForHeight = (screenHeight * 0.75) / unscaledPhotoHeight;

    // On prend le plus petit des deux pour être sûr que la photo ne déborde jamais de l'écran
    targetScale = Math.min(scaleForWidth, scaleForHeight);

    // On met quand même une limite (entre x1 et x4) pour éviter des zooms extrêmes
    targetScale = Math.min(Math.max(1, targetScale), 4);
    // ========================================================

    // 6. Calculer les nouvelles coordonnées cibles pour centrer
    targetLeft = screenCenterX - 2500 - (unscaledOffsetX * targetScale);
    targetTop = screenCenterY - 2500 - (unscaledOffsetY * targetScale);

    // 7. Appliquer avec une belle transition très douce
    fresco.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), left 0.8s cubic-bezier(0.25, 1, 0.5, 1), top 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
    
    fresco.style.transform = `scale(${targetScale})`;
    fresco.style.left = `${targetLeft}px`;
    fresco.style.top = `${targetTop}px`;
}

// ========================================================
// --- RACCOURCI CLAVIER : ESPACE POUR CENTRER --- 
// ========================================================

window.addEventListener('keydown', (e) => {
    // On vérifie que c'est bien la touche Espace et que l'intro de la page est finie
    if (e.code === 'Space' && isZoomReady) {
        
        e.preventDefault(); // Sécurité : Empêche la page de scroller vers le bas

        // 1. On remet les valeurs "Maison"
        targetScale = 1; // Zoom par défaut
        targetLeft = centerLeft;
        targetTop = centerTop;

        // 2. On applique une belle transition fluide et cinématographique (0.8s) 
        // comme on l'avait fait pour le focus sur les photos
        fresco.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), left 0.8s cubic-bezier(0.25, 1, 0.5, 1), top 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        
        // 3. On lance le déplacement
        fresco.style.left = `${targetLeft}px`;
        fresco.style.top = `${targetTop}px`;
        fresco.style.transform = `scale(${targetScale})`;

        // 4. On remet la petite transition ultra-rapide (0.1s) après le voyage 
        // pour que la navigation à la souris redevienne réactive
        setTimeout(() => {
            fresco.style.transition = 'transform 0.1s ease-out, left 0.1s ease-out, top 0.1s ease-out';
        }, 800); // 800ms correspond aux 0.8s de la transition
    }
});