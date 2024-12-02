/** JSON POST */
const UserProfil = [
    {idUser:1, name:"Sami Darrji", picture:"./dist/img/pict_profil2.jpg", Bio:"L'automne est le printemps de l'hiver." },
    {idUser:2, name:"Houssem Saadi", picture:"./dist/img/pict_profil2.jpg", Bio:"L'automne est une saison sage et de bon conseil."},
    {idUser:3, name:"Marwen Khamessi", picture:"./dist/img/pict_profil2.jpg", Bio:"Automne. Le post-scriptum du soleil." }
];

const timeline = [
    { id:1 , idUser:1 ,name:"Sami Darrji", type:"text", text:"L'automne est le printemps de l'hiver.", urlImage:"", urlVideo:"", datePub : "2024-11-01 10:24 AM" },
    { id:2 , idUser:2, name:"Houssem Saadi", type:"image", text:"L'automne est une saison sage et de bon conseil.",  urlImage:"", urlVideo:"", datePub : "2024-10-11 02:44 PM" },
    { id:3 , idUser:3, name:"Marwen Khamessi", type:"video", text:"Automne. Le post-scriptum du soleil",  urlImage:"", urlVideo:"", datePub : "2024-09-24 13:00 PM" },
    { id:4 , idUser:1, name:"Sami Darrji", type:"image", text:"Le succès, c'est se promener d'échec en échec tout en restant motivé.",  urlImage:"", urlVideo:"", datePub : "2024-09-24 13:00 PM" },
  ];  

window.onload = function() {
    parcourirTimeline();
  };

/** Parcourir Timeline  */
function parcourirTimeline(){
    timeline.reverse();
    var timelineText="";
    timeline.forEach(timeline => {
        /************************ */
        timelineText = timeline.text;
        userID = timeline.idUser;
        //console.log(timelineText);
        //console.log(userID);
        /************************ */
        //console.log(`Name: ${timeline.name}, Type: ${timeline.type} , Date partage: ${timeline.datePub}`);
        afficher_Publication_in_HTML_page(timelineText, userID);
      });
  }

/** Afficher le Timeline dans la page html */
const divTimeline = document.querySelector('#timeline');
function afficher_Publication_in_HTML_page(timelineText, userID){
    const userObj = getUserProfil(userID); // Récupérer les informations utilisateur
    if (!userObj) {
        console.error("Utilisateur non trouvé");
        return; // Arrêter si l'utilisateur n'est pas trouvé
    }
   //console.log(userObj);
    var divPostHtml = `
    <div class="container-text container-post-global">
                            <!-- user picture and menu signal btn -->
                            <div class="header-post-block">
                                <div class="user-profil-and-name">
                                    <div class="user-picture-post">
                                        <a href="#">
                                            <img src="` + userObj.picture +`" alt="photo de profil" srcset="">
                                        </a>
                                    </div>
                                    <h4 >`+ userObj.name +`</h4>
                                </div>   
                                <a href="#" class="menu-signal">
                                    <span class="material-symbols-outlined">
                                        more_horiz
                                    </span>
                                </a> 
                            </div>
                            <!-- block text -->
                            <div class="text">
                                <p id="get-text">`
                                + timelineText +`
                                </p>
                            </div>   
                        </div>
    `;
    divTimeline.innerHTML += divPostHtml;
}


/** afficher les infos de l'utilisateur */
function getUserProfil(userID){
    // Rechercher l'utilisateur dans UserProfil et retourner son objet
    const user = UserProfil.find(user => user.idUser === userID);
    if (user) {
        return { name: user.name, picture: user.picture };
    } else {
        return null; // Si aucun utilisateur n'est trouvé
    }
}
