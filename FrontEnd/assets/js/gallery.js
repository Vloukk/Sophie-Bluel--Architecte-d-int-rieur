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

    // Après la création des boutons de catégorie
    showCategoryButtons();
}

//Initialise les boutons des catégories
export function boutonsCategories() {
    fetchCategories()
        .then(categories => {
            traitementCategories(categories);
            hideCategoryButtons(); // Masquer les boutons initialement
        })
        .catch(error => {
            console.error('Une erreur est survenue :', error);
        });
}

//affiche les images dans la galerie à partir des données fournies
export function afficherImages(images) {
    const conteneurImages = document.querySelector('.gallery');
    conteneurImages.innerHTML = "";
    images.forEach(element => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.setAttribute('src', element.imageUrl);
        img.setAttribute('alt', element.title);
        img.setAttribute('category', element.categoryId);
        img.setAttribute('crossorigin', 'anonymous');
        figcaption.textContent = element.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        conteneurImages.appendChild(figure);
    });
}

//////////////////////////////////////////////////////////////////////

// Fonction pour masquer les boutons de catégorie
export function hideCategoryButtons() {
    const buttons = document.querySelectorAll('.categories button');
    console.log(buttons); // Vérifier la sélection des boutons
    if (buttons.length > 0) {
        buttons.forEach(button => {
            button.classList.add('hidden');
        });
    }
}

export function showCategoryButtons() {
    const buttons = document.querySelectorAll('.categories button');
    console.log(buttons); // Vérifier la sélection des boutons
    if (buttons.length > 0) {
        buttons.forEach(button => {
            button.classList.remove('hidden');
        });
    }
}


