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
