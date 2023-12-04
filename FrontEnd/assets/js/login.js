import { hideCategoryButtons, showCategoryButtons } from './gallery.js';

// Fonctions pour la validation et la gestion de la connexion

function validateLoginForm(email, password) {
    // Vérifications de la validité du formulaire de connexion
    if (email.value.trim() === '') {
        showValidationError(email, false);
    } else if (!validateEmail(email.value.trim())) {
        showValidationError(email, false, 'Format incorrect');
    } else {
        hideValidationError(email);
    }

    if (password.value === '') {
        showValidationError(password, false);
    } else {
        hideValidationError(password);
    }
}

async function loginUser(emailInput, passwordInput) {
    checkLoginFormValidity(emailInput, passwordInput);

    if (!emailInput.classList.contains('error-input') && !passwordInput.classList.contains('error-input')) {
        const email = emailInput.value;
        const password = passwordInput.value;

        if (!validateEmail(email)) {
            showValidationError(emailInput, 'Format incorrect');
            return;
        }

        const data = {
            email: email,
            password: password
        };

        try {
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const responseData = await response.json();
                const token = responseData.token;
                localStorage.setItem('token', token);
                sessionStorage.setItem('connexionStatus', 'success');
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

function hideValidationError(inputElement) {
    inputElement.classList.remove('error-input');
    const errorElement = inputElement.parentNode.querySelector(`.error-message[data-input="${inputElement.id}"]`);
    if (errorElement) {
        errorElement.parentNode.removeChild(errorElement);
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function checkLoginFormValidity(email, password) {
    if (email.value.trim() === '') {
        showValidationError(email, false);
    } else if (!validateEmail(email.value.trim())) {
        showValidationError(email, false, 'Format incorrect');
    } else {
        hideValidationError(email);
    }

    if (password.value === '') {
        showValidationError(password, false);
    } else {
        hideValidationError(password);
    }
}

// Événements et actions lors du chargement du document

document.addEventListener('DOMContentLoaded', function() {
    const isLoginPage = window.location.pathname.includes('/pages/login.html');

    if (isLoginPage) {
        const submitButton = document.querySelector('#login-submit');
        const emailInput = document.querySelector('#email');
        const passwordInput = document.querySelector('#password');

        if (submitButton && emailInput && passwordInput) {
            submitButton.addEventListener('click', function(e) {
                e.preventDefault();
                loginUser(emailInput, passwordInput);
            });
        } else {
            console.error('Elements for login form not found or selected incorrectly!');
        }
    } 

    // Vérification de l'existence du bouton de déconnexion
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
        console.log('Logout button found!');
        logoutButton.addEventListener('click', function() {
            logoutUser();
        });
    } else {
        console.error('Element .logout-button not found!');
    }

    // Vérification de l'état de connexion au chargement de la page
    const connexionStatus = sessionStorage.getItem('connexionStatus');
    if (connexionStatus) {
        // Actions supplémentaires si nécessaire
    }
    checkLoggedIn(); // Vérifie l'état de connexion
});

// Fonction pour vérifier l'état de connexion et agir en conséquence
export function checkLoggedIn() {
    const token = localStorage.getItem("token");
    const loginButton = document.querySelector('.login-button');
    const logoutButton = document.querySelector('.logout-button');
    const editButton = document.querySelector('.edit-button');

    if (loginButton && logoutButton) {
        if (token) {
            console.log("Utilisateur connecté");
            loginButton.style.display = 'none';
            logoutButton.style.display = 'inline-block';
            hideCategoryButtons();
            if (editButton) {
                editButton.style.display = 'block'; // Affichage de editButton quand connecté
            }
        } else {
            console.log("Utilisateur non connecté");
            loginButton.style.display = 'inline-block';
            logoutButton.style.display = 'none';
            showCategoryButtons();
            if (editButton) {
                editButton.style.display = 'none'; // Masquage de editButton quand déconnecté
            }
        }
    } else {
        console.error('One or both buttons not found!');
    }
}


//////////////////////////////////////////////////////////////

export function logoutUser() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('connexionStatus');
    checkLoggedIn(); // Mettre à jour l'état de connexion après la déconnexion
}



