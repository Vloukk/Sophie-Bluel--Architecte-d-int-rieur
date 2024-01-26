import { hideCategoryButtons, showCategoryButtons, boutonsCategories } from './gallery.js';

/////////////////////////////////////////////////////////////////////// Fonction pour la connexion de l'utilisateur
async function loginUser(emailInput, passwordInput) {
    // Vérification de la validité du formulaire de connexion
    checkLoginFormValidity(emailInput, passwordInput);

    if (!emailInput.classList.contains('error-input') && !passwordInput.classList.contains('error-input')) {
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!validateEmail(email)) {
            showValidationError(emailInput, 'Format incorrect');
            return;
        }

        const data = {
            email,
            password
        };

        try {
            // Tentative de connexion via une requête asynchrone
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const { token } = await response.json();
                // Stockage du token dans le local storage
                localStorage.setItem('token', token);
                sessionStorage.setItem('connexionStatus', 'success');
                // Redirection vers la page principale après une connexion réussie
                window.location.href = '../index.html?connexionStatus=success';
            } else if (response.status === 401) {
                throw new Error('Adresse mail ou mot de passe invalide');
            } else {
                throw new Error('Erreur lors de la connexion');
            }
        } catch (error) {
            showValidationError(passwordInput, error.message);
            passwordInput.value = '';
            console.error('Erreur de connexion :', error);
        }
    }
}

// Fonction pour masquer les messages d'erreur de validation
function hideValidationError(inputElement) {
    inputElement.classList.remove('error-input');
    const errorElement = inputElement.parentNode.querySelector(`.error-message[data-input="${inputElement.id}"]`);
    if (errorElement) {
        errorElement.remove();
    }
}

// Fonction pour valider le format de l'adresse email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Vérification de la validité du formulaire de connexion
function checkLoginFormValidity(email, password) {
    const emailValue = email.value.trim();
    if (emailValue === '') {
        showValidationError(email, 'Champ requis');
    } else if (!validateEmail(emailValue)) {
        showValidationError(email, 'Format incorrect');
    } else {
        hideValidationError(email);
    }

    if (password.value === '') {
        showValidationError(password, 'Champ requis');
    } else {
        hideValidationError(password);
    }
}

///////////////////////////////////////////////////////////////

// Fonction pour afficher les messages d'erreur de validation
function showValidationError(inputElement, errorMessage) {
    inputElement.classList.add('error-input');

    // Création d'un élément de message d'erreur
    const errorElement = document.createElement('div');
    errorElement.classList.add('error-message');
    errorElement.setAttribute('data-input', inputElement.id);
    errorElement.textContent = errorMessage;

    // Ajout du message d'erreur à l'élément parent de l'input
    inputElement.parentNode.appendChild(errorElement);
}

/////////////////////////////////////////////////////////////// Actions à effectuer une fois que le document est chargé
document.addEventListener('DOMContentLoaded', function () {
    // Vérification de la page actuelle pour les actions spécifiques à la page de connexion
    const isLoginPage = window.location.pathname.includes('/pages/login.html');

    if (isLoginPage) {
        // Gestion du formulaire de connexion
        const submitButton = document.querySelector('#login-submit');
        const emailInput = document.querySelector('#email');
        const passwordInput = document.querySelector('#password');

        if (submitButton && emailInput && passwordInput) {
            // Écouteur d'événement pour la soumission du formulaire
            submitButton.addEventListener('click', function (e) {
                e.preventDefault();
                loginUser(emailInput, passwordInput);
            });
        }
    }

    // Gestion du bouton de déconnexion
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }

    // Vérification de l'état de connexion au chargement de la page
    const connexionStatus = sessionStorage.getItem('connexionStatus');
    if (connexionStatus) {
    }
    // Vérification de l'état de connexion
    checkLoggedIn();
});

///////////////////////////////////////////////////////////// Fonction pour vérifier l'état de connexion et agir en conséquence
export function checkLoggedIn() {
    const token = localStorage.getItem("token");
    const loginButton = document.querySelector('.login-button');
    const logoutButton = document.querySelector('.logout-button');
    const editButton = document.querySelector('.edit-button');

    if (loginButton && logoutButton) {
        const userLoggedIn = !!token;
        // Affichage/masquage des boutons en fonction de l'état de connexion
        loginButton.style.display = userLoggedIn ? 'none' : 'inline-block';
        logoutButton.style.display = userLoggedIn ? 'inline-block' : 'none';
        // Masquage/affichage des boutons en fonction de l'état de connexion
        hideCategoryButtons(!userLoggedIn);
        if (editButton) {
            editButton.style.display = userLoggedIn ? 'block' : 'none';
        }
    }
}

////////////////////////////////////////////////////////////////////////////// Fonction pour la déconnexion de l'utilisateur
export function logoutUser() {
    // Suppression des données de connexion stockées
    localStorage.removeItem('token');
    sessionStorage.removeItem('connexionStatus');
    // Vérification de l'état de connexion après la déconnexion
    checkLoggedIn();
    // Appel de la fonction de mise à jour des boutons de catégorie après la déconnexion
    boutonsCategories();
}
