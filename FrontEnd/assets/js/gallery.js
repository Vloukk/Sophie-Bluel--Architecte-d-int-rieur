import { fetchCategories } from './api.js';

////////////////////////////////////////////////////////////////////////////// Traitement des catégories récupérées et affichage

export function traitementCategories(categories) {
    const divPortfolio = document.getElementById('portfolio');
    const divBoutons = document.createElement('div');
    divBoutons.className = 'categories';

    const btnAll = document.createElement('button');
    btnAll.textContent = 'Tous';
    divBoutons.appendChild(btnAll);

    // Création des boutons pour chaque catégorie
    categories.forEach(categorie => {
        const button = document.createElement('button');
        button.textContent = categorie.name;
        button.id = categorie.id;
        divBoutons.appendChild(button);
        divPortfolio.querySelector('h2').insertAdjacentElement('afterend', divBoutons);

        // Gestion de l'affichage des images selon la catégorie sélectionnée
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

    // Affichage de toutes les images lorsque le bouton "Tous" est cliqué
    btnAll.addEventListener('click', function() {
        document.querySelectorAll('.gallery img').forEach(image => {
            image.parentElement.style.display = 'block';
        });
    });
}

//////////////////////////////////////////////////////////////////////////// Initialisation des boutons de catégories

export function boutonsCategories() {
    fetchCategories().then(categories => {
        traitementCategories(categories);
    });
}

////////////////////////////////////////////////////////////////////////////// Affichage des images dans la galerie principale

export function afficherImages(images) {
    const conteneurImages = document.querySelector('.gallery');
    conteneurImages.innerHTML = "";

    images.forEach(element => {
        const figure = document.createElement('figure');
        const imageId = element.imageId; // Assure-toi que l'identifiant de l'image est bien défini dans tes données

        figure.dataset.imageId = imageId; // Attribue la valeur à data-image-id

        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.setAttribute('src', element.imageUrl);
        img.setAttribute('alt', element.title);
        img.setAttribute('category', element.categoryId);
        img.setAttribute('crossorigin', 'anonymous');

        figcaption.textContent = element.title;

        img.dataset.imageId = imageId; // Assigne l'identifiant de l'image à data-image-id

        figure.appendChild(img);
        figure.appendChild(figcaption);
        conteneurImages.appendChild(figure);
    });
}

////////////////////////////////////////////////////////////////////////////// Masquer les boutons de catégorie

export function hideCategoryButtons() {
    const buttons = document.querySelectorAll('.categories button');
    if (buttons.length > 0) {
        buttons.forEach(button => {
            button.classList.add('hidden');
        });
    }
}

////////////////////////////////////////////////////////////////////////////// Afficher les boutons de catégorie
export function showCategoryButtons() {
    const buttons = document.querySelectorAll('.categories button');
    if (buttons.length > 0) {
        buttons.forEach(button => {
            button.classList.remove('hidden');
        });
    }
}
