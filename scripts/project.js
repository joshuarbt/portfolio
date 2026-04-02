// On s'assure que GSAP connaît le plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    
    // ========================================================
    // --- SÉCURITÉ MOBILE (Désactiver animations lourdes) --- 
    // ========================================================
    const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches || window.innerWidth <= 768;

    if (!isMobile) {
        initDesktopAnimations();
    } else {
        initMobileAnimations();
    }
});

// ========================================================
// --- ANIMATIONS BUREAU (GSAP + ScrollTrigger) --- 
// ========================================================
function initDesktopAnimations() {
    
    // 1. Animation d'introduction (Load)
    const tlIntro = gsap.timeline();
    
    tlIntro.from(".project-main-title", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out"
    })
    .from(".project-subtitle", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.8"); // Commence avant la fin de l'animation précédente

    // 2. Parallaxe sur la grande image au scroll
    gsap.from(".big-image", {
        scrollTrigger: {
            trigger: ".big-image-container",
            start: "top bottom", // Quand le haut de l'image touche le bas de l'écran
            end: "bottom top",    // Quand le bas de l'image touche le haut de l'écran
            scrub: true           // L'animation suit le défilement
        },
        scale: 1.2, // L'image commence zoomée et dézoome en défilant
        yPercent: -15, // Légère translation vers le haut
        ease: "none"
    });

    // 3. Révélation des sections détaillées au scroll
    const detailSections = gsap.utils.toArray('.detail-section');

    detailSections.forEach(section => {
        // Séparer le texte de l'image pour les animer différemment
        const text = section.querySelector('.detail-text');
        const image = section.querySelector('.detail-image-wrapper');

        // Créer une timeline par section
        const tlSection = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 75%", // Se déclenche quand la section est à 75% du haut
                toggleActions: "play none none none" // Joue une seule fois
            }
        });

        tlSection.from(text, {
            x: -50, // Vient de la gauche
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        })
        .from(image, {
            x: 50, // Vient de la droite
            opacity: 0,
            duration: 1.2,
            scale: 0.9,
            ease: "power3.out"
        }, "-=0.8"); // Chevauchement
    });
}

// ========================================================
// --- ANIMATIONS MOBILE (Légères) --- 
// ========================================================
function initMobileAnimations() {
    // Juste une petite animation d'intro pour ne pas faire ramer le téléphone
    gsap.from([".project-main-title", ".project-subtitle"], {
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power2.out"
    });
}


// 4. Animation générique pour les nouveaux blocs (Galerie, Vidéo, Multi-textes)
    const revealElements = gsap.utils.toArray('.reveal-on-scroll');

    revealElements.forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 85%", // Déclenche un peu plus tôt quand on scrolle
                toggleActions: "play none none none"
            },
            y: 50, // Fait monter l'élément
            opacity: 0, // Apparition en fondu
            duration: 1.2,
            ease: "power3.out"
        });
    });