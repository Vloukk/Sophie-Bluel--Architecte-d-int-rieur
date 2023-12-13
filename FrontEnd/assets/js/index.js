import { fetchworks } from './api.js';
import { boutonsCategories, afficherImages } from './gallery.js';
import { checkLoggedIn } from './login.js';

// Fonction pour initialiser la galerie d'images
async function initializeGallery() {
    try {
        // Récupère les images en attendant la résolution de la promesse retournée par fetchworks()
        const images = await fetchworks();

        if (!localStorage.getItem("token")) {
            // Si aucun jeton n'est trouvé, appelle la fonction boutonsCategories()
            boutonsCategories();
        }
        // Affiche les images récupérées
        afficherImages(images);
    } catch (error) {
        console.error('Une erreur est survenue :', error);
    }
}

// Appelle la fonction initializeGallery() au chargement de la page
initializeGallery();

document.addEventListener('DOMContentLoaded', function() {
    // Vérifie si un utilisateur est connecté
    checkLoggedIn();
});


////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', async function() {
    const modal = document.getElementById('modal');
    const editButton = document.querySelector('.edit-button');
    const closeModalButton = document.querySelector('.close-modal-button');
    const modalGallery = document.querySelector('.modal-gallery');

    // Lorsque le bouton d'édition est cliqué
    editButton.addEventListener('click', async function() {
        // Affiche le modal
        modal.style.display = 'block';
    });

    // Lorsque le bouton de fermeture du modal est cliqué
    closeModalButton.addEventListener('click', function() {
        // Cache le modal
        modal.style.display = 'none';
    });
});

////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', async function() {
    const gallery1 = document.querySelector('.gallery');
    const gallery2 = document.querySelector('.modal-gallery');

    // Récupérer les données des images depuis l'API
    const images = await fetchworks();

    images.forEach(image => {
        const container = document.createElement('div');
        container.classList.add('image-container');
        container.dataset.imageId = image.imageId;

        const img = document.createElement('img');
        img.src = image.imageUrl;
        img.alt = image.title;
        img.dataset.imageId = image.imageId; // Assurez-vous que l'attribut data-image-id est défini correctement

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.dataset.imageId = image.imageId;

        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa', 'fa-trash', 'fa-delete');
        deleteButton.appendChild(deleteIcon);

        container.appendChild(deleteButton);
        container.appendChild(img);

        gallery2.appendChild(container);

        deleteButton.addEventListener('click', async function() {
            const imageIdToDelete = this.dataset.imageId;

            try {
                const token = localStorage.getItem("token");
                const apiUrl = `http://localhost:5678/api/works/${imageIdToDelete}`;
                const response = await fetch(apiUrl, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    container.remove();
                } else {
                    console.error('Erreur lors de la suppression de l\'image');
                }
            } catch (error) {
                console.error('Erreur :', error);
            }
        });
    });
});




////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('modal');
    const addPhotoButton = document.querySelector('.btn-modal');
    const modalGallery = document.querySelector('.modal-gallery');
    const modalTitle = document.querySelector('.modal-title');
    const btnBack = document.querySelector('.btn-back');
    const addImageForm = document.getElementById('addImageForm');
    const preview = document.getElementById('preview');

    let initialTitle = "Galerie photo";
    let isAddingPhotos = false;

    // Lorsque le bouton pour ajouter une photo est cliqué
    addPhotoButton.addEventListener('click', function () {
    // Vérifie si on n'est pas déjà en train d'ajouter des photos
    if (!isAddingPhotos) {
        // Change le titre du modal pour indiquer l'ajout de photos
        modalTitle.textContent = "Ajouter des photos";
        // Cache la galerie dans le modal
        modalGallery.style.display = "none";
        // Cache le bouton d'ajout de photos
        addPhotoButton.style.display = 'none';
        // Affiche le bouton de retour
        btnBack.style.display = 'block';
        // Affiche le formulaire pour ajouter des images
        addImageForm.style.display = 'block';
        // Affiche le modal
        modal.style.display = 'block';
        // Marque la situation comme étant en train d'ajouter des photos
        isAddingPhotos = true;
    } else {
        // Si on est déjà en train d'ajouter des photos, affiche le bouton de retour
        btnBack.style.display = 'block';
        // Marque toujours la situation comme étant en train d'ajouter des photos
        isAddingPhotos = true;
    }
});

// Lorsque le bouton de retour est cliqué
btnBack.addEventListener('click', function () {
    // Rétablit le titre initial du modal
    modalTitle.textContent = initialTitle;
    // Affiche à nouveau la galerie dans le modal
    modalGallery.style.display = 'grid';
    // Cache le bouton de retour
    btnBack.style.display = 'none';
    // Affiche à nouveau le bouton pour ajouter des photos
    addPhotoButton.style.display = 'inline-block';
    // Cache le formulaire pour ajouter des images
    addImageForm.style.display = 'none';
    // Marque la situation comme n'étant plus en train d'ajouter des photos
    isAddingPhotos = false;
});

    // Gestion de l'aperçu d'image
    const imageUpload = document.getElementById('imageUpload');
    const uploadButton = document.querySelector('.btn-upload');
    const uploadText = document.querySelector('.upload-text');
    const imgIcon = document.querySelector('.imgIcon');
    let previewVisible = false;

    imageUpload.addEventListener('change', function () {
        const file = imageUpload.files[0];

        // Vérification de la taille du fichier
        const maxSize = 4 * 1024 * 1024; // 4 Mo
        if (file && file.size > maxSize) {
            alert('La taille du fichier dépasse 4 Mo. Veuillez choisir un fichier plus petit.');
            imageUpload.value = ''; // Réinitialiser le champ de fichier
            return;
        }

        const reader = new FileReader();

        reader.onload = function () {
            preview.src = reader.result;
            showPreview(); // Afficher l'aperçu après l'ajout de l'image
        }

        if (file) {
            reader.readAsDataURL(file);
        }
    });

    preview.addEventListener('click', function () {
        if (previewVisible) {
            preview.src = ''; // Effacer l'image si l'aperçu est visible
            hidePreview(); // Masquer l'aperçu
        }
    });

    uploadButton.addEventListener('click', function () {
        if (!previewVisible) {
            showPreview(); // Afficher l'aperçu uniquement s'il n'est pas déjà visible
        }
    });

    // Fonction pour afficher la prévisualisation de l'image
    function showPreview() {
        previewVisible = true; // Définit la visibilité de la prévisualisation comme vraie
        preview.style.display = 'block';
        hideUploadElements(); // Masque les autres éléments associés à l'upload
    }
    
    // Fonction pour masquer la prévisualisation de l'image
    function hidePreview() {
        previewVisible = false; // Définit la visibilité de la prévisualisation comme fausse
        preview.style.display = 'none'; 
        showUploadElements(); // Réaffiche les éléments associés à l'upload
    }
    
    // Fonction pour masquer les éléments associés à l'upload
    function hideUploadElements() {
        uploadButton.style.display = 'none';
        uploadText.style.display = 'none';
        imgIcon.style.display = 'none';
    }
    
    // Fonction pour réafficher les éléments associés à l'upload
    function showUploadElements() {
        uploadButton.style.display = 'block';
        uploadText.style.display = 'block';
        imgIcon.style.display = 'block';
    }
});

////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
    const categorySelect = document.getElementById('category');

    async function fetchCategories() {
        try {
            const response = await fetch('http://localhost:5678/api/categories');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des catégories');
            }
            const categories = await response.json();
            return categories;
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories :', error);
            throw error;
        }
    }

    function createCategoryOptions(categories) {
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    }

    async function initializeCategories() {
        try {
            const categories = await fetchCategories();
            createCategoryOptions(categories);
            console.log('Catégories récupérées :', categories);
            console.log('Options de catégorie créées :', categorySelect.childNodes);
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories :', error);
        }
    }

    initializeCategories();

    const addImgForm = document.getElementById('addImgForm');

    addImgForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(this);
        console.log('Données du formulaire :', formData);

        try {
            const token = localStorage.getItem("token");
            const apiUrl = 'http://localhost:5678/api/works';

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                // Mettre à jour la galerie après l'ajout de l'image
                initializeGallery();
            } else {
                console.error('Erreur lors de l\'ajout de l\'image');
            }
        } catch (error) {
            console.error('Erreur :', error);
        }
    });
});

