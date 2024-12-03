

/** button search header */
const button_search_header = document.getElementById('search-friend');
const button_delete_in_iput_search = document.getElementById('delete-txt-search-friend');

function appearBtnDelete(){
    if(button_search_header.value==""){
        button_delete_in_iput_search.style.opacity=0;
    } else{
        button_delete_in_iput_search.style.opacity=1;
    }
}

/***  new post */
// get the div element
const writeNew = document.querySelector('#input-text');
const cancelShareBtn = document.querySelector('#cancel-share');
const shareBtn = document.querySelector('#share-new-post-btn');
const writPostDiv = document.querySelector('.write-post');
const inputWriteText = document.querySelector('#input-write-text');
const iconePost = document.querySelector('.icone-post');
const addPictToPost = document.querySelector('#add-picture-post');
const addVideoToPost = document.querySelector('#add-video-post');
const newPostDiv = document.querySelector('#new-post');
const howAreYou = document.querySelector('#how-are-you');

// add a click event listener to the div
writeNew.addEventListener('click', function() {
  // specify the action to take when the div is clicked
  writeNew.style.zIndex = "7";
  cancelShareBtn.style.zIndex = "8";
  howAreYou.style.display = "none";

  newPostDiv.style.borderRadius = "0px"; 
  newPostDiv.style.borderTopLeftRadius = "28px"; 
  newPostDiv.style.borderTopRightRadius = "28px"; 

  cancelShareBtn.style.opacity = 1;
  writPostDiv.style.minHeight = "220px"; 
  //writPostDiv.style.height = "auto"; 
  writPostDiv.style.opacity = 1; 

  inputWriteText.style.height = "calc(100% - 50px)";
  inputWriteText.style.opacity = 1;
  
  shareBtn.style.opacity = 1;
  addPictToPost.style.opacity = 1;
  addVideoToPost.style.opacity = 1;
});
cancelShareBtn.addEventListener('click', function() {
    // specify the action to take when the div is clicked
    writeNew.style.zIndex = "8";
    cancelShareBtn.style.zIndex = "7";
    howAreYou.style.display = "block";

    newPostDiv.style.borderRadius = "50px"; 
    newPostDiv.style.borderTopLeftRadius = "50px"; 
    newPostDiv.style.borderTopRightRadius = "50px"; 

    cancelShareBtn.style.opacity = 0;
    writPostDiv.style.minHeight = "0px"; 
    writPostDiv.style.opacity = 0; 

    inputWriteText.style.height = "0px";
    inputWriteText.style.opacity = 0;
    
    shareBtn.style.opacity = 0;
    addPictToPost.style.opacity = 0;
    addVideoToPost.style.opacity = 0;
  });
  
/**********************************/  
/**********************************/
// Timeline

/** L'ID du l'utilisateur principal */
const userIDAdmin = 4;

// Fonction pour charger les posts  
async function loadPosts() {
      try {
          // Charger les posts depuis le JSON local
          const response = await fetch('./dist/js/posts.json');
          const posts = await response.json();
  
          // Charger les commentaires enregistrés dans le Local Storage
          const savedComments = JSON.parse(localStorage.getItem('comments')) || {};
  
          for (const post of posts) {
              const postId = post.id;
              const userID = post.userID;
  
              // Récupérer les données de l'utilisateur de manière asynchrone
              const user = await findUsers(userID);
  
              // Récupérer les commentaires du Local Storage s'il y en a
              const localStorageComments = savedComments[postId] || [];
  
              // Combiner les commentaires du JSON avec ceux du Local Storage
              const combinedComments = post.comments.concat(localStorageComments);
  
              // Calculer le nombre de commentaires pour ce post
              const nbrComments = combinedComments.length;
  
              // Fonction pour afficher la photo si elle existe
              const findPhoto = function (post) {
                  return post.content.photo
                      ? `<img class="post-photo" src="${post.content.photo}" onclick="agrandirPhoto('${post.content.photo}')">`
                      : ''; // Retourne une chaîne vide si la photo n'existe pas
              };
  
              // Créer le HTML du post
              const postHTML = `
                  <div class="post" id="post-${post.id}">
                      <div class="author">
                          <img src="${user.picture}" alt="${user.name}" class="profile-picture">
                          <span>${user.name}</span>
                      </div>
                      <p class="post-text">${post.content.text}</p>
                      ${findPhoto(post)}
                      <div class="reactions">
                          <button class="reaction like">👍 ${post.reactions.like}</button>
                          <button class="reaction love">❤️ ${post.reactions.love}</button>
                          <button class="reaction dislike">👎 ${post.reactions.dislike}</button>
                      </div>
                     <div class="comments" id="comments-${post.id}">
                          ${await Promise.all(combinedComments.map(async comment => {
                              const userID_comment = comment.userID;
                              const objUserComment = await findUsers(userID_comment);
                              
                              
                              return `
                                  <div class="comment" id="${post.id}-${comment.id}">
                                      <div class="user-comment">
                                          <div class="author">
                                              <img src="${objUserComment.picture}" alt="${objUserComment.name}" class="profile-picture">
                                              <strong>${objUserComment.name}</strong> 
                                          </div>   
                                          <small>${comment.date}</small>
                                      </div>
                                      <p>${comment.text}</p>
                                      <span class="material-symbols-outlined btn-delete" onclick="deleteComment(${post.id},${comment.id})">
                                          close
                                      </span>
                                  </div>
                              `;
                          })).then(results => results.join(''))} <!-- Ajout de join('') ici -->
                      </div>
  
                      <div class="add-comment">
                          <input type="text" id="comment-input-${post.id}" placeholder="Votre commentaire..." />
                          <button onclick="addComment(${post.id},${nbrComments})">Ajouter</button>
                      </div>
                  </div>
              `;
              document.getElementById('feed').innerHTML += postHTML;
          }
      } catch (error) {
          console.error('Erreur lors du chargement des posts :', error);
      }
}

// Fonction pour Retrouver les utilisateurs 
 async function findUsers(id) {
      // Charger les utilisateurs depuis le JSON local
      const response = await fetch('./dist/js/users.json');
      const users = await response.json();
      
      // Trouver l'utilisateur correspondant au userID
      const user = users.find(user => user.id === id);
      
      // Vérifiez si l'utilisateur a été trouvé
      if (!user) {
          //console.error(`Utilisateur non trouvé pour userID: ${id}`);
          console.error(`Utilisateur non trouvé pour userID: 4`);
          return { name: 'Sami Darraji', picture: './dist/img/pict_profil2.jpg', id: 4 }; // Image par défaut
      }
  
      return {
          name: user.author.name, picture: user.author.profilePicture // Assurez-vous d'utiliser la bonne propriété
      };
}

// Fonction pour charger les utilisateurs 
async function loadUsers() {
    try {
        const response = await fetch('./dist/js/users.json');
        const users = await response.json();
        return users;  // Retourner tous les utilisateurs
    } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        return [];  // Retourne un tableau vide en cas d'erreur
    }
}

// Fonction pour charger les utilisateurs 
async function loadFriends() {
    try {
        const response = await fetch('./dist/js/friends.json');
        const friends = await response.json();
        return friends;  // Retourner tous les utilisateurs
    } catch (error) {
        console.error('Erreur lors du chargement des amis:', error);
        return [];  // Retourne un tableau vide en cas d'erreur
    }
}
  
// Fonction pour agrandir l'image en plein écran
function agrandirPhoto(photoUrl) {
      const fullScreenImage = document.createElement('div');
      fullScreenImage.className = 'fullscreen';
      fullScreenImage.innerHTML = `<img src="${photoUrl}" class="fullscreen-image">`;
      document.body.appendChild(fullScreenImage);
  
      // Ajouter un événement pour fermer l'image plein écran en cliquant dessus
      fullScreenImage.addEventListener('click', () => {
          document.body.removeChild(fullScreenImage);
      });
}
  
// Fonction pour ajouter un commentaire
function addComment(postId, numberComments) {
      const input = document.getElementById(`comment-input-${postId}`);
      const commentText = input.value.trim();
      const idcomment = numberComments+1;
      if (!commentText) return;
  
      // Créer un nouvel objet de commentaire
      const newComment = {
          userID: userIDAdmin, // Remplacez ceci par l'ID de l'utilisateur actuel
          id: idcomment,
          text: commentText,
          date: new Date().toLocaleString()
      };
  
      // Ajouter le commentaire dans la zone de commentaires en temps réel
      const commentsContainer = document.getElementById(`comments-${postId}`);
      commentsContainer.innerHTML += `
          <div class="comment" id="${postId}-${newComment.id}">
              <div class="user-comment">
                  <div class="author">
                      <img src="./dist/img/pict_profil2.jpg" alt="Sami Darraji" class="profile-picture">
                      <strong>Sami Darraji</strong> 
                  </div>   
                  <small>${newComment.date}</small>
              </div>
              <p>${newComment.text}</p>
              <span class="material-symbols-outlined btn-delete" onclick="deleteComment(${postId},${newComment.id})">
                 close
              </span>
          </div>
      `;
      input.value = ''; // Effacer l'input
  
      // Enregistrer les commentaires dans Local Storage
      const savedComments = JSON.parse(localStorage.getItem('comments')) || {};
      if (!savedComments[postId]) savedComments[postId] = [];
      savedComments[postId].push(newComment);
      localStorage.setItem('comments', JSON.stringify(savedComments));
}
  
// Fonction pour supprimer les commentaire
function deleteComment(postId, commentId) {
  
      // Supprimer le commentaire du DOM
      const commentElement = document.getElementById(`${postId}-${commentId}`);
      if (commentElement) {
          commentElement.remove();
      }
  
      // Supprimer le commentaire de Local Storage
      const savedComments = JSON.parse(localStorage.getItem('comments')) || {};
      if (savedComments[postId]) {
          savedComments[postId] = savedComments[postId].filter(comment => comment.id !== commentId);
          localStorage.setItem('comments', JSON.stringify(savedComments));
      }
      
}
// deleteComment(1, 3); //exemple delete
  
// Fonction pour charger les messages depuis un fichier JSON et ajouter les éléments au dropdown
async function loadMessages() {
    try {
        // Chargement du fichier JSON contenant les messages
        const response = await fetch('./dist/js/messages.json');
        const messages = await response.json();

        // Sélectionner l'élément ul du menu dropdown
        const dropdownList = document.querySelector('.dropdown-menu #ulMessages');

        // Ajouter chaque message dans le dropdown
        for (const message of messages) {
            // Récupérer les données de l'utilisateur de manière asynchrone
            const user = await findUsers(message.senderID); // Chargement de l'utilisateur par son ID
            

            // Créer l'élément li pour le message
            const li = document.createElement('li');
            if(message.unread === "yes"){
                li.classList.add("unread");
            }
            li.innerHTML = `
                <div class="author">
                    <img src="${user.picture}" alt="${user.name}" class="profile-picture">
                    <span class="message-text">${message.message}</span>
                </div>
            `;

            // Ajouter l'élément li au dropdown
            dropdownList.appendChild(li);

            // Ajouter un gestionnaire d'événements si tu veux faire quelque chose avec le message
            li.addEventListener('click', () => {
                alert(`Message sélectionné : ${message.message}`);
                li.classList.remove("unread");
            });
        }
    } catch (error) {
        console.error('Erreur lors du chargement des messages:', error);
    }
}

 // Fonction pour rechercher des utilisateurs en fonction du texte saisi
async function searchUsers() {
    const searchTerm = document.getElementById('search-friend').value.toLowerCase();
    const resultsContainer = document.getElementById('user-results');
    const deleteBtn = document.getElementById('delete-txt-search-friend');

    // Afficher ou cacher le bouton de suppression selon si la barre de recherche est vide ou non
    if (searchTerm === "") {
        deleteBtn.style.opacity = 0; // Cacher le bouton de suppression si rien n'est saisi
    } else {
        deleteBtn.style.opacity = 1; // Afficher le bouton de suppression si du texte est saisi
    }

    try {
        // Charger les utilisateurs depuis le fichier JSON
        const users = await loadUsers(); // Charger tous les utilisateurs du reseau
        const friends = await loadFriends() // Charger tous les amis

        // Filtrer les utilisateurs qui correspondent à la recherche
        const filteredUsers = users.filter(user => user.author.name.toLowerCase().includes(searchTerm));

        // Afficher les résultats de la recherche
        resultsContainer.innerHTML = ''; // Réinitialiser le conteneur de résultats
        if (filteredUsers.length > 0) {
            filteredUsers.forEach(user => {
                
                const userElement = document.createElement('div');
                userElement.classList.add('user-result');

                // Trouver si l'utilisateur dans votre liste d'amis
                 const friend = friends.find(friend => friend.id === user.id);
                 
                 if(friend){
                    if(friend.id != 4){
                        userElement.innerHTML = ` 
                        <div class="users">
                            <a href="#" class="link-profil-friend">
                                <img src="${user.author.profilePicture}" alt="${user.author.name}">
                                <h4>${user.author.name}</h4>
                            </a>
                            <a href="#" class="btn-chat">
                                <span class="material-symbols-outlined">
                                    chat
                                </span>
                            </a>
                        </div>`;
                    }
                    
                 }else{
                    userElement.innerHTML = `
                    <div class="users">
                        <a href="#" class="link-profil-friend">
                            <img src="${user.author.profilePicture}" alt="${user.author.name}">
                            <h4>${user.author.name}</h4>
                        </a>
                        <a href="#" class="btn-add-friend">
                            <span class="material-symbols-outlined">
                                person_add
                            </span>
                        </a>
                    </div>`;
                 }
                
                document.getElementById('masqueUL').style.display = 'block';
                resultsContainer.appendChild(userElement);
            });
        } else {
            resultsContainer.innerHTML = '<p>Aucun utilisateur trouvé.</p>';
        }
    } catch (error) {
        console.error('Erreur lors de la recherche des utilisateurs:', error);
    }
}

// Fonction pour gérer l'affichage du dropdown
function toggleDropdown(element) {
    const dropdownMenuMessage = document.getElementById('dropdownMenuMessage');
    const dropdownMenuNotification = document.getElementById('dropdownMenuNotification');
    document.getElementById('masqueUL').style.display = 'block';
    clearSearch();

    if(element === 1){
        if(dropdownMenuNotification.style.display === 'block'){
            dropdownMenuNotification.style.display = 'none'
        }
        dropdownMenuMessage.style.display = dropdownMenuMessage.style.display === 'block' ? 'none' : 'block';
    }
    if(element === 2){
        if(dropdownMenuMessage.style.display === 'block'){
            dropdownMenuMessage.style.display = 'none'
        }
        dropdownMenuNotification.style.display = dropdownMenuNotification.style.display === 'block' ? 'none' : 'block';
    }
}

// Effacer le texte de la barre de recherche
function clearSearch() {
    document.getElementById('search-friend').value = '';
    //searchUsers(); // Rechercher à nouveau pour afficher tous les utilisateurs
    const resultsContainer = document.getElementById('user-results');
    resultsContainer.innerHTML = "";
    document.querySelector('#delete-txt-search-friend').style.opacity=0;
}


// Gestion du clic sur l'icône pour masquer le dropdown en dehor de header
document.getElementById('masqueUL').addEventListener('click', (event) => {
    event.preventDefault(); // Empêche le comportement par défaut du lien
    dropdownMenuNotification.style.display = 'none';
    dropdownMenuMessage.style.display = 'none';
    document.getElementById('masqueUL').style.display = 'none';
    document.getElementById('search').style.display= "none";
    clearSearch();
});

document.getElementById('icone-search').addEventListener('click', (event) => {
    const search = document.getElementById('search');
    const masqueSearch = document.getElementById('masqueUL');
    search.style.display = search.style.display === 'block' ? 'none' : 'block';
    masqueSearch.style.display = masqueSearch.style.display === 'block' ? 'none' : 'block';
});

/************************* */
/*** CHARGER MES FONCTIONS */

// Charger les messages lors de l'initialisation
loadMessages();

// Charger les Posts lors de l'initialisation
loadPosts();