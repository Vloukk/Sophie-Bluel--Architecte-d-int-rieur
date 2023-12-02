import { toggleCategories } from './gallery.js';

document.querySelector("form").addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const previousError = document.querySelector(".error");
    if (previousError) {
        previousError.remove();
    }

    const loginFormDatas = {
        email: e.target.querySelector("[name=email]").value,
        password: e.target.querySelector("[name=password]").value
    };
    const datas = JSON.stringify(loginFormDatas);

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: datas
        });

        if (response.ok) {
            const body = await response.json();
            window.localStorage.setItem("bearerAuth", JSON.stringify(body));
            window.location.href = "../index.html";
        } else if (response.status === 404 || response.status === 401) {
            throw new Error("Données d'identification incorrectes");
        }
    } catch (error) {
        const errorDiv = document.createElement("div");
        errorDiv.classList.add("error");
        errorDiv.innerHTML = error.message;
        document.querySelector("form").prepend(errorDiv);
    }
});


////////////////////////////////////////////////////////////////////////

export function updateLoginButton() {
    const loginButton = document.querySelector('.login');
    const isLoggedIn = window.localStorage.getItem('bearerAuth');

    if (isLoggedIn) {
        // L'utilisateur est connecté, changez le texte du bouton en "Logout"
        loginButton.textContent = 'Logout';
        console.log('L\'utilisateur est connecté');

        // Ajoutez un gestionnaire d'événements pour la déconnexion
        loginButton.addEventListener('click', () => {
            // Code pour la déconnexion : par exemple, supprimer le token du local storage
            window.localStorage.removeItem('bearerAuth');
            // Mettre à jour l'interface après la connexion réussie
            updateInterfaceAfterLogin();
            // Afficher ou masquer les catégories
            toggleCategories()
            // Rediriger l'utilisateur vers la page de connexion ou une autre page
            window.location.href = 'login.html'; // Remplacez 'login.html' par votre page de connexion
        });
    } else {
        // L'utilisateur n'est pas connecté, laissez le texte du bouton en "Login"
        loginButton.textContent = 'Login';
        // Ajoutez un gestionnaire d'événements pour la connexion
        loginButton.addEventListener('click', () => {
            // Redirection vers la page de connexion
            window.location.href = 'login.html'; // Remplacez 'login.html' par votre page de connexion
        });
        // L'utilisateur n'est pas connecté, peut-être ne pas initialiser la galerie
        console.log('L\'utilisateur n\'est pas connecté');
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
