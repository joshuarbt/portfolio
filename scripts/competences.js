// On s'assure que GSAP connaît le plugin
gsap.registerPlugin(ScrollTrigger);

// On récupère tes mots
const skills = gsap.utils.toArray('.skills-section .h1');

gsap.from(skills, {
    scrollTrigger: {
        trigger: ".container-comp",
        start: "top bottom",   // L'animation DÉMARRE dès que le haut de la section apparaît en bas de l'écran
        end: "center center",  // L'animation SE TERMINE quand la section arrive au milieu de l'écran
        scrub: 1,              // L'animation suit ta molette avec un petit lissage (1 seconde)
    },
    y: "100vh",     // Les mots partent de tout en bas de l'écran
    opacity: 0,     // Ils apparaissent en fondu
    stagger: 0.1,   // Le décalage : le mot 1 monte, puis le 2, puis le 3... (l'effet d'entassement !)
    ease: "none"    // Pas d'accélération bizarre, c'est purement lié à la molette
});