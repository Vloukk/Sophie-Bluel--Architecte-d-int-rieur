import { fetchworks } from './api.js';
import { boutonsCategories, afficherImages } from './gallery.js';
import { checkLoggedIn } from './login.js';

// Initialise la galerie avec les boutons de catégorie
async function initialiserGalerie() {
    try {
        // Récupération des images avec fetchworks
        const images = await fetchworks();

        // Initialisation des boutons de catégorie avant l'affichage des images
        if (!localStorage.getItem("token")) {
            boutonsCategories(); // Afficher les boutons lorsque l'utilisateur n'est pas connecté
        }

        // Affichage des images récupérées
        afficherImages(images);
    } catch (error) {
        console.error('Une erreur est survenue :', error);
    }
}

// Appel de la fonction pour initialiser la galerie
initialiserGalerie();


document.addEventListener('DOMContentLoaded', function() {
    checkLoggedIn();
});

////////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', async function() {
    const modal = document.getElementById('modal');
    const editButton = document.querySelector('.edit-button');
    const closeModalButton = document.querySelector('.close-modal-button');
    const modalGallery = document.querySelector('.modal-gallery');

    editButton.addEventListener('click', async function() {
        modal.style.display = 'block';
    });

    closeModalButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Gestionnaire d'événement pour supprimer une image lors du clic sur l'icône
    modalGallery.addEventListener('click', async function(event) {
        if (event.target && event.target.classList.contains('fa-delete')) {
            const imageContainer = event.target.parentElement;
            const imageId = imageContainer.dataset.imageId; // Récupération de l'ID de l'image à supprimer

            if (imageContainer && imageId) {
                try {
                    const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
                        method: 'DELETE'
                    });

                    if (!response.ok) {
                        throw new Error('Échec de la suppression de l\'image.');
                    }

                    imageContainer.remove(); // Supprimez l'élément parent de l'icône et de l'image
                } catch (error) {
                    console.error('Erreur lors de la suppression de l\'image :', error);
                }
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const gallery1 = document.querySelector('.gallery');
    const gallery2 = document.querySelector('.modal-gallery');

    // Récupération des images de la première galerie
    const imagesGallery1 = gallery1.querySelectorAll('img');

    // Clonage des images de la première galerie vers la deuxième
    imagesGallery1.forEach(img => {
        const clone = img.cloneNode(true);
        const imageId = img.dataset.imageId;

        // Création du conteneur pour l'image et l'icône de suppression
        const container = document.createElement('div');
        container.classList.add('image-container'); // Classe pour le style CSS
        container.dataset.imageId = imageId; // Stockez l'ID de l'image dans l'attribut dataset

        // Création du bouton pour la suppression avec une icône
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button'); // Classe pour le style CSS du bouton
        deleteButton.dataset.imageId = imageId; // Stockez l'ID de l'image dans l'attribut dataset

        // Création de l'icône de suppression avec une classe pour FontAwesome
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa', 'fa-trash', 'fa-delete'); // Ajoutez les classes pour une icône de suppression

        // Ajout de l'icône au bouton
        deleteButton.appendChild(deleteIcon);

        // Ajout du bouton au conteneur
        container.appendChild(deleteButton);
        container.appendChild(clone);

        gallery2.appendChild(container);
    });
});




