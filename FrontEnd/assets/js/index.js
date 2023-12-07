import { fetchworks } from './api.js';
import { boutonsCategories, afficherImages } from './gallery.js';
import { checkLoggedIn } from './login.js';

async function initializeGallery() {
    try {
        const images = await fetchworks();

        if (!localStorage.getItem("token")) {
            boutonsCategories();
        }

        afficherImages(images);
    } catch (error) {
        console.error('Une erreur est survenue :', error);
    }
}

initializeGallery();

document.addEventListener('DOMContentLoaded', function() {
    checkLoggedIn();
});

////////////////////////////////////////////////////////////////////////////

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

    modalGallery.addEventListener('click', async function(event) {
        if (event.target && event.target.classList.contains('fa-delete')) {
            const imageContainer = event.target.parentElement;
            const imageId = imageContainer.dataset.imageId;

            if (imageContainer && imageId) {
                try {
                    const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
                        method: 'DELETE'
                    });

                    if (!response.ok) {
                        throw new Error('Échec de la suppression de l\'image.');
                    }

                    imageContainer.remove();
                } catch (error) {
                    console.error('Erreur lors de la suppression de l\'image :', error);
                }
            }
        }
    });
});

////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
    const gallery1 = document.querySelector('.gallery');
    const gallery2 = document.querySelector('.modal-gallery');
    const imagesGallery1 = gallery1.querySelectorAll('img');

    imagesGallery1.forEach(img => {
        const clone = img.cloneNode(true);
        const imageId = img.dataset.imageId;
        const container = document.createElement('div');
        container.classList.add('image-container');
        container.dataset.imageId = imageId;
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.dataset.imageId = imageId;
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa', 'fa-trash', 'fa-delete');
        deleteButton.appendChild(deleteIcon);
        container.appendChild(deleteButton);
        container.appendChild(clone);
        gallery2.appendChild(container);
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

    addPhotoButton.addEventListener('click', function () {
        if (!isAddingPhotos) {
            modalTitle.textContent = "Ajouter des photos";
            modalGallery.style.display = "none";
            addPhotoButton.style.display = 'none';
            btnBack.style.display = 'block';
            addImageForm.style.display = 'block';
            modal.style.display = 'block';
            isAddingPhotos = true;
        } else {
            btnBack.style.display = 'block';
            isAddingPhotos = true;
        }
    });

    btnBack.addEventListener('click', function () {
        modalTitle.textContent = initialTitle;
        modalGallery.style.display = 'grid';
        btnBack.style.display = 'none';
        addPhotoButton.style.display = 'inline-block';
        addImageForm.style.display = 'none';
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

    function showPreview() {
        previewVisible = true;
        preview.style.display = 'block';
        hideUploadElements(); // Masquer les autres éléments
    }

    function hidePreview() {
        previewVisible = false;
        preview.style.display = 'none';
        showUploadElements(); // Réafficher les autres éléments
    }

    function hideUploadElements() {
        uploadButton.style.display = 'none';
        uploadText.style.display = 'none';
        imgIcon.style.display = 'none';
    }

    function showUploadElements() {
        uploadButton.style.display = 'block';
        uploadText.style.display = 'block';
        imgIcon.style.display = 'block';
    }
});

////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
    const categorySelect = document.getElementById('category');

    function fetchCategories() {
        return fetch('http://localhost:5678/api/categories')
            .then(response => response.json())
            .catch(error => {
                console.error('Erreur lors de la récupération des catégories :', error);
                throw error;
            });
    }

    function createCategoryOptions(categories) {
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    }

    fetchCategories()
        .then(categories => {
            createCategoryOptions(categories);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des catégories :', error);
        });
});

////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
    const addImageForm = document.getElementById('addImgForm');
    const imageUpload = document.getElementById('imageUpload');
    const titleInput = document.getElementById('title');
    const categorySelect = document.getElementById('category');
    const submitButtonModal = document.querySelector('.modal-img-button');

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4';

    addImageForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData();
        const file = imageUpload.files[0];
        const title = titleInput.value;
        const category = categorySelect.value;

        formData.append('image', file);
        formData.append('title', title);
        formData.append('category', category);

        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            body: formData,
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Échec de la requête.');
                }
                return response.json();
            })
            .then(data => {
                console.log('Réponse du serveur :', data);
            })
            .catch(error => {
                console.error('Erreur lors de l\'envoi des données :', error);
            });
    });
});
