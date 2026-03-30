// --- ANIMATION DES YEUX (Bloc unique) ---
const flowerEyes = document.getElementById('flower-eyes');
const flowerContainer = document.getElementById('flower-container');

window.addEventListener('mousemove', (e) => {
    if (!flowerEyes || !flowerContainer) return; 

    const rect = flowerContainer.getBoundingClientRect();
    const flowerCenterX = rect.left + rect.width / 2;
    const flowerCenterY = rect.top + rect.height / 2;

    const dx = e.clientX - flowerCenterX;
    const dy = e.clientY - flowerCenterY;
    const angle = Math.atan2(dy, dx);
    const maxDistance = 8; 

    const distance = Math.min(Math.hypot(dx, dy), maxDistance);

    const moveX = distance * Math.cos(angle);
    const moveY = distance * Math.sin(angle);

    flowerEyes.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
});

// --- MENU BURGER RESPONSIVE ---
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

if (burger && navLinks) {
    burger.addEventListener('click', () => {
        // Alterne l'affichage des liens
        navLinks.classList.toggle('nav-active');
        
        // Active l'animation de la croix sur le burger
        burger.classList.toggle('toggle');
    });
}
