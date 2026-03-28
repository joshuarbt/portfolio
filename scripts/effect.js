// --- EFFET BLOB ORGANIQUE SOURIS SUR TEXTE ---

const haloTexts = document.querySelectorAll('.halo-text');

haloTexts.forEach(text => {
    // Variables pour la position de la souris et la position du blob
    let mouseX = -100;
    let mouseY = -100;
    let blobX = -100;
    let blobY = -100;
    let isHovering = false;

    // Quand on bouge la souris, on met à jour la "cible"
    text.addEventListener('mousemove', (e) => {
        const rect = text.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    // Quand on entre sur le mot
    text.addEventListener('mouseenter', (e) => {
        isHovering = true;
        const rect = text.getBoundingClientRect();
        
        // On repère la position de la souris
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;

        // LA CORRECTION EST ICI : 
        // On téléporte instantanément le blob à ces coordonnées pour éviter le "voyage"
        blobX = mouseX;
        blobY = mouseY; 
        
        // On force la mise à jour CSS immédiate
        text.style.setProperty('--x', `${blobX}px`);
        text.style.setProperty('--y', `${blobY}px`);
    });

    // Quand on sort, on cache le blob en le téléportant dehors
    text.addEventListener('mouseleave', () => {
        isHovering = false;
        
        // On renvoie tout à -100 instantanément
        mouseX = -100;
        mouseY = -100;
        blobX = -100; 
        blobY = -100;
        
        text.style.setProperty('--x', `${blobX}px`);
        text.style.setProperty('--y', `${blobY}px`);
    });

    // Le moteur d'animation fluide
    function animateBlob() {
        // Formule du "Lerp" : Le blob se rapproche de la souris de 15% à chaque frame
        // Modifie le "0.15" : (0.05 = très visqueux/lent, 0.4 = très rapide/sec)
        blobX += (mouseX - blobX) * 0.15;
        blobY += (mouseY - blobY) * 0.15;

        // On envoie les coordonnées lissées au CSS
        text.style.setProperty('--x', `${blobX}px`);
        text.style.setProperty('--y', `${blobY}px`);

        // On boucle l'animation à 60 images/seconde
        requestAnimationFrame(animateBlob);
    }
    
    // On lance la boucle d'animation pour ce mot
    animateBlob();
});