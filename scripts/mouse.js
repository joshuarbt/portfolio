document.addEventListener("DOMContentLoaded", () => {
    
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches || window.innerWidth <= 768) {
        return; // Le mot magique 'return' arrête la lecture du script ici !
    }

    // --- RÉGLAGES DE LA TRAÎNÉE ---
    const totalDots = 10;     // Nombre TOTAL de points dans la traînée
    const innerLength = 4;    // Nombre de points pour la 1ère couleur (--color-03)
    const density = 0.4;      // Rigidité (0.1 = élastique, 0.9 = très rigide)

    const dots = [];
    let mouse = { x: -100, y: -100 }; 

    // 1. Création du curseur principal
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    // 2. Création de tous les points de la traînée (clones)
    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        
        // On donne la classe de base pour la forme
        dot.classList.add('cursor-trail');
        
        // On choisit la couleur en fonction de la position dans la file !
        if (i < innerLength) {
            dot.classList.add('trail-inner'); // Les premiers en couleur 03
        } else {
            dot.classList.add('trail-outer'); // Les suivants en couleur 04
        }
        
        document.body.appendChild(dot);
        dots.push({ x: -100, y: -100, node: dot });
    }

    // 3. On enregistre la position de la souris
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // 4. Le moteur d'animation
    function animate() {
        // Le curseur principal suit exactement la souris
        cursor.style.left = `${mouse.x}px`;
        cursor.style.top = `${mouse.y}px`;

        // Chaque point suit le point précédent
        let targetX = mouse.x;
        let targetY = mouse.y;

        dots.forEach((dot) => {
            // Le point se rapproche de sa cible
            dot.x += (targetX - dot.x) * density;
            dot.y += (targetY - dot.y) * density;

            // On met à jour sa position à l'écran
            dot.node.style.left = `${dot.x}px`;
            dot.node.style.top = `${dot.y}px`;

            // La cible du PROCHAIN point devient la position du point ACTUEL
            targetX = dot.x;
            targetY = dot.y;
        });

        // On boucle l'animation
        requestAnimationFrame(animate);
    }

    // On lance la machine
    animate();

    // ========================================================
    // --- GESTION DU HOVER DES LIENS POUR DÉSACTIVER LA TRAÎNÉE --- 
    // ========================================================

    // On récupère tous les liens et boutons de la page
    const interactiveElements = document.querySelectorAll('a, button');

    interactiveElements.forEach(el => {
        // Quand la souris ENTRE sur un lien
        el.addEventListener('mouseenter', () => {
            // Ajoute la classe au body, qui va masquer la traînée en CSS
            document.body.classList.add('is-hovering-link');
        });
        
        // Quand la souris SORT du lien
        el.addEventListener('mouseleave', () => {
            // Enlève la classe, la traînée réapparaît
            document.body.classList.remove('is-hovering-link');
        });
    });

    // ========================================================
    // --- GESTION DU HOVER SUR LE FOOTER --- 
    // ========================================================

    // On cherche la balise footer (si tu utilises une div avec une classe, 
    // remplace 'footer' par '.nom-de-ta-classe')
    const footerElement = document.querySelector('footer'); 

    if (footerElement) {
        // Quand la souris ENTRE sur le footer
        footerElement.addEventListener('mouseenter', () => {
            document.body.classList.add('is-hovering-footer');
        });
        
        // Quand la souris SORT du footer
        footerElement.addEventListener('mouseleave', () => {
            document.body.classList.remove('is-hovering-footer');
        });
    }
});

