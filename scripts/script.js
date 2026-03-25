
// script age 
const birthDate = new Date(2007, 4, 8);

function getAge(date) {
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();

    if (today.getMonth() > date.getMonth() || (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate())) {
        return age;
    }else {
        return age - 1;
    }
}

document.getElementById("age").textContent = 'Age : ' + getAge(birthDate) + ' yo';

// --- ANIMATION DES YEUX (Bloc unique) ---
const flowerEyes = document.getElementById('flower-eyes');
const flowerContainer = document.getElementById('flower-container');

window.addEventListener('mousemove', (e) => {
    if (!flowerEyes || !flowerContainer) return; // Sécurité si l'élément n'est pas trouvé

    // 1. On récupère la position et la taille de la fleur à l'écran
    const rect = flowerContainer.getBoundingClientRect();
    
    // 2. On calcule le centre de la fleur
    const flowerCenterX = rect.left + rect.width / 2;
    const flowerCenterY = rect.top + rect.height / 2;

    // 3. On calcule la différence entre la souris et le centre de la fleur
    const dx = e.clientX - flowerCenterX;
    const dy = e.clientY - flowerCenterY;

    // 4. Calcul de l'angle (la direction dans laquelle la souris se trouve)
    const angle = Math.atan2(dy, dx);

    // 5. La distance maximale autorisée pour les yeux (pour qu'ils ne sortent pas du visage)
    // Modifie ce chiffre (ex: 8, 10, 15) pour agrandir ou réduire la zone de mouvement
    const maxDistance = 8; 

    // On calcule la distance réelle de la souris, mais on la bloque à 'maxDistance'
    const distance = Math.min(Math.hypot(dx, dy), maxDistance);

    // 6. Calcul du déplacement en pixels sur les axes X et Y
    const moveX = distance * Math.cos(angle);
    const moveY = distance * Math.sin(angle);

    // 7. On applique le mouvement visuel
    // (On garde le -50%, -50% du CSS initial pour que le point de départ reste centré)
    flowerEyes.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
});