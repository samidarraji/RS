const userIDAdmin = 4;
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
            const user = await loadUsers(userID);

            // Récupérer les commentaires du Local Storage s'il y en a
            const localStorageComments = savedComments[postId] || [];

            // Combiner les commentaires du JSON avec ceux du Local Storage
            const combinedComments = post.comments.concat(localStorageComments);

            // Calculer le nombre de commentaires pour ce post
            const nbrComments = combinedComments.length;
            //console.log(postId);
            //console.log(nbrComments);

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
                            const objUserComment = await loadUsers(userID_comment);
                            
                            
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
loadPosts();

async function loadUsers(id) {
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