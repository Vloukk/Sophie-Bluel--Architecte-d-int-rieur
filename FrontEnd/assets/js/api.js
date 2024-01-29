//récupère les données des travaux (photos) à partir de l'API
export function fetchworks() {
    return fetch('http://localhost:5678/api/works')
      .then(response => response.json())
      .then(dataFromAPI => {
        // Mapper les données pour ajouter la propriété `imageId`
        const dataWithImageId = dataFromAPI.map(item => {
          return {
            ...item,
            imageId: item.id // Crée une nouvelle propriété `imageId` avec la valeur de `id`
          };
        });
  
        return dataWithImageId; // Retourne les données avec la propriété `imageId`
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des travaux :', error);
        throw error;
      });
  }  
  

//récupère les données des catégories à partir de l'API
export function fetchCategories() {
  return fetch('http://localhost:5678/api/categories')
      .then(response => response.json())
      .catch(error => {
          console.error('Erreur lors de la récupération des catégories :', error);
          throw error;
      });
}


// Verifie la connexion au Back-end
const backendURL = 'http://localhost:5678/api-docs/';

fetch(backendURL)
  .then(response => {
    if (!response.ok) {
      // Si la réponse n'est pas OK, l'utilisateur n'est pas connecté
      alert("Vous n'êtes pas connecté au serveur backend.");
    } 
  })
  .catch(error => {
    // En cas d'erreur, l'utilisateur n'est pas connecté
    alert("Erreur de connexion au serveur backend. Veuillez réessayer plus tard.");
    console.error("Erreur de connexion au serveur backend:", error);
  });










