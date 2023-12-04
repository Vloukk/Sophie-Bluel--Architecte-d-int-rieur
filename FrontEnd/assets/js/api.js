//récupère les données des travaux (photos) à partir de l'API
export function fetchworks() {
  return fetch('http://localhost:5678/api/works')
      .then(response => response.json())
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

