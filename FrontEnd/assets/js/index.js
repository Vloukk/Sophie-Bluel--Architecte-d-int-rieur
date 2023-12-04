import { fetchworks } from './api.js';
import { boutonsCategories, afficherImages } from './gallery.js';
import { checkLoggedIn } from './login.js';

// Initialise la galerie
async function initialiserGalerie() {
    try {
        // Récupération des images avec fetchworks
        const images = await fetchworks();
         // Affichage des images récupérées
        afficherImages(images);
         // Initialisation des boutons de catégorie après l'affichage des images
        boutonsCategories();
    } catch (error) {
        console.error('Une erreur est survenue :', error);
    }
}
// Appel de la fonction pour initialiser la galerie
initialiserGalerie();

document.addEventListener('DOMContentLoaded', function() {
    checkLoggedIn();
});

