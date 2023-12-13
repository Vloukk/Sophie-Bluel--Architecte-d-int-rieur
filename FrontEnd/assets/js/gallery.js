import { fetchCategories } from './api.js';

// Traite et affiche les catégories récupérées 
export function traitementCategories(categories) {
    const divPortfolio = document.getElementById('portfolio');
    const divBoutons = document.createElement('div');
    divBoutons.className = 'categories';

    const btnAll = document.createElement('button');
    btnAll.textContent = 'Tous';
    divBoutons.appendChild(btnAll);

    categories.forEach(categorie => {
        const button = document.createElement('button');
        button.textContent = categorie.name;
        button.id = categorie.id;
        divBoutons.appendChild(button);
        divPortfolio.querySelector('h2').insertAdjacentElement('afterend', divBoutons);

        button.addEventListener('click', function() {
            const id = this.id;
            document.querySelectorAll('.gallery img').forEach(image => {
                if (image.getAttribute('category') === id) {
                    image.parentElement.style.display = 'block';
                } else {
                    image.parentElement.style.display = 'none';
                }
            });
        });
    });

    btnAll.addEventListener('click', function() {
        document.querySelectorAll('.gallery img').forEach(image => {
            image.parentElement.style.display = 'block';
        });
    });
}

// Initialise les boutons des catégories
export function boutonsCategories() {
    fetchCategories().then(categories => {
        traitementCategories(categories);
    });
}

// Affiche les images dans la galerie principale
export function afficherImages(images) {
    const conteneurImages = document.querySelector('.gallery');
    conteneurImages.innerHTML = "";
    
    images.forEach(element => {
        const figure = document.createElement('figure');
        const imageId = element.imageId; // Assure-toi que l'identifiant de l'image est bien défini dans tes données
    
        // Attribue la valeur à data-image-id pour chaque figure créée
        figure.dataset.imageId = imageId; // Attribue la valeur à data-image-id
        
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.setAttribute('src', element.imageUrl);
        img.setAttribute('alt', element.title);
        img.setAttribute('category', element.categoryId);
        img.setAttribute('crossorigin', 'anonymous');
        // ... (ton code existant)
        figcaption.textContent = element.title;
        
        // Ajoute cet attribut data-image-id avec la valeur de l'identifiant de l'image
        img.dataset.imageId = imageId; // Assigne l'identifiant de l'image à data-image-id

        figure.appendChild(img);
        figure.appendChild(figcaption);
        conteneurImages.appendChild(figure);
    });
}


// Fonction pour masquer les boutons de catégorie
export function hideCategoryButtons() {
    // Sélectionne tous les boutons de catégorie dans la page
    const buttons = document.querySelectorAll('.categories button');
    // Vérifie s'il y a des boutons trouvés
    if (buttons.length > 0) {
        // Pour chaque bouton trouvé, ajoute la classe 'hidden' pour les masquer visuellement
        buttons.forEach(button => {
            button.classList.add('hidden');
        });
    }
}

// Fonction pour afficher les boutons de catégorie
export function showCategoryButtons() {
    const buttons = document.querySelectorAll('.categories button');
    if (buttons.length > 0) {
        buttons.forEach(button => {
            // Pour chaque bouton trouvé, supprime la classe 'hidden' pour les rendre visibles
            button.classList.remove('hidden');
        });
    }
}
