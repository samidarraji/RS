let UserProfil=[{idUser:1,name:"Sami Darrji",picture:"./dist/img/pict_profil2.jpg",Bio:"L'automne est le printemps de l'hiver."},{idUser:2,name:"Houssem Saadi",picture:"./dist/img/pict_profil_houss.jpg",Bio:"L'automne est une saison sage et de bon conseil."},{idUser:3,name:"Marwen Khamessi",picture:"./dist/img/Pict_profil_marwen.jpg",Bio:"Automne. Le post-scriptum du soleil."}],timeline=[{id:1,idUser:1,name:"Sami Darrji",type:"text",text:"L'automne est le printemps de l'hiver.",urlImage:"",urlVideo:"",datePub:"2024-11-01 10:24 AM"},{id:2,idUser:2,name:"Houssem Saadi",type:"image",text:"L'automne est une saison sage et de bon conseil.",urlImage:"",urlVideo:"",datePub:"2024-10-11 02:44 PM"},{id:3,idUser:3,name:"Marwen Khamessi",type:"video",text:"Automne. Le post-scriptum du soleil",urlImage:"",urlVideo:"",datePub:"2024-09-24 13:00 PM"},{id:4,idUser:1,name:"Sami Darrji",type:"image",text:"Le succès, c'est se promener d'échec en échec tout en restant motivé.",urlImage:"",urlVideo:"",datePub:"2024-09-24 13:00 PM"}];function parcourirTimeline(){timeline.reverse();var t;timeline.forEach(e=>{t=e.text,userID=e.idUser,afficher_Publication_in_HTML_page(t,userID)})}window.onload=function(){parcourirTimeline()};let divTimeline=document.querySelector("#timeline");function afficher_Publication_in_HTML_page(e,t){var t=getUserProfil(t);t?(t=`
    <div class="container-text container-post-global">
                            <!-- user picture and menu signal btn -->
                            <div class="header-post-block">
                                <div class="user-profil-and-name">
                                    <div class="user-picture-post">
                                        <a href="#">
                                            <img src="`+t.picture+`" alt="photo de profil" srcset="">
                                        </a>
                                    </div>
                                    <h4 >`+t.name+`</h4>
                                </div>   
                                <a href="#" class="menu-signal">
                                    <span class="material-symbols-outlined">
                                        more_horiz
                                    </span>
                                </a> 
                            </div>
                            <!-- block text -->
                            <div class="text">
                                <p id="get-text">`+e+`
                                </p>
                            </div>   
                        </div>
    `,divTimeline.innerHTML+=t):console.error("Utilisateur non trouvé")}function getUserProfil(t){var e=UserProfil.find(e=>e.idUser===t);return e?{name:e.name,picture:e.picture}:null}let button_search_header=document.getElementById("search-friend"),button_delete_in_iput_search=document.getElementById("delete-txt-search-friend");function appearBtnDelete(){""==button_search_header.value?button_delete_in_iput_search.style.opacity=0:button_delete_in_iput_search.style.opacity=1}let writeNew=document.querySelector("#input-text"),cancelShareBtn=document.querySelector("#cancel-share"),shareBtn=document.querySelector("#share-new-post-btn"),writPostDiv=document.querySelector(".write-post"),inputWriteText=document.querySelector("#input-write-text"),iconePost=document.querySelector(".icone-post"),addPictToPost=document.querySelector("#add-picture-post"),addVideoToPost=document.querySelector("#add-video-post"),newPostDiv=document.querySelector("#new-post"),howAreYou=document.querySelector("#how-are-you"),userIDAdmin=(writeNew.addEventListener("click",function(){writeNew.style.zIndex="7",cancelShareBtn.style.zIndex="8",howAreYou.style.display="none",newPostDiv.style.borderRadius="0px",newPostDiv.style.borderTopLeftRadius="28px",newPostDiv.style.borderTopRightRadius="28px",cancelShareBtn.style.opacity=1,writPostDiv.style.minHeight="220px",writPostDiv.style.opacity=1,inputWriteText.style.height="calc(100% - 50px)",inputWriteText.style.opacity=1,shareBtn.style.opacity=1,addPictToPost.style.opacity=1,addVideoToPost.style.opacity=1}),cancelShareBtn.addEventListener("click",function(){writeNew.style.zIndex="8",cancelShareBtn.style.zIndex="7",howAreYou.style.display="block",newPostDiv.style.borderRadius="50px",newPostDiv.style.borderTopLeftRadius="50px",newPostDiv.style.borderTopRightRadius="50px",cancelShareBtn.style.opacity=0,writPostDiv.style.minHeight="0px",writPostDiv.style.opacity=0,inputWriteText.style.height="0px",inputWriteText.style.opacity=0,shareBtn.style.opacity=0,addPictToPost.style.opacity=0,addVideoToPost.style.opacity=0}),4);async function loadPosts(){try{var e=await(await fetch("./dist/js/posts.json")).json(),t=JSON.parse(localStorage.getItem("comments"))||{};for(let i of e){var o=i.id,s=await loadUsers(i.userID),n=t[o]||[],r=i.comments.concat(n),a=r.length,c=`
                <div class="post" id="post-${i.id}">
                    <div class="author">
                        <img src="${s.picture}" alt="${s.name}" class="profile-picture">
                        <span>${s.name}</span>
                    </div>
                    <p class="post-text">${i.content.text}</p>
                    ${l=i,l.content.photo?`<img class="post-photo" src="${l.content.photo}" onclick="agrandirPhoto('${l.content.photo}')">`:""}
                    <div class="reactions">
                        <button class="reaction like">👍 ${i.reactions.like}</button>
                        <button class="reaction love">❤️ ${i.reactions.love}</button>
                        <button class="reaction dislike">👎 ${i.reactions.dislike}</button>
                    </div>
                   <div class="comments" id="comments-${i.id}">
                        ${await Promise.all(r.map(async e=>{var t=await loadUsers(e.userID);return`
                                <div class="comment" id="${i.id}-${e.id}">
                                    <div class="user-comment">
                                        <div class="author">
                                            <img src="${t.picture}" alt="${t.name}" class="profile-picture">
                                            <strong>${t.name}</strong> 
                                        </div>   
                                        <small>${e.date}</small>
                                    </div>
                                    <p>${e.text}</p>
                                    <span class="material-symbols-outlined btn-delete" onclick="deleteComment(${i.id},${e.id})">
                                        close
                                    </span>
                                </div>
                            `})).then(e=>e.join(""))} <!-- Ajout de join('') ici -->
                    </div>

                    <div class="add-comment">
                        <input type="text" id="comment-input-${i.id}" placeholder="Votre commentaire..." />
                        <button onclick="addComment(${i.id},${a})">Ajouter</button>
                    </div>
                </div>
            `;document.getElementById("feed").innerHTML+=c}}catch(e){console.error("Erreur lors du chargement des posts :",e)}var l}async function loadUsers(t){var e=(await(await fetch("./dist/js/users.json")).json()).find(e=>e.id===t);return e?{name:e.author.name,picture:e.author.profilePicture}:(console.error("Utilisateur non trouvé pour userID: 4"),{name:"Sami Darraji",picture:"./dist/img/pict_profil2.jpg",id:4})}function agrandirPhoto(e){let t=document.createElement("div");t.className="fullscreen",t.innerHTML=`<img src="${e}" class="fullscreen-image">`,document.body.appendChild(t),t.addEventListener("click",()=>{document.body.removeChild(t)})}function addComment(e,t){var i=document.getElementById("comment-input-"+e),o=i.value.trim(),t=t+1;o&&(t={userID:userIDAdmin,id:t,text:o,date:(new Date).toLocaleString()},document.getElementById("comments-"+e).innerHTML+=`
        <div class="comment" id="${e}-${t.id}">
            <div class="user-comment">
                <div class="author">
                    <img src="./dist/img/pict_profil2.jpg" alt="Sami Darraji" class="profile-picture">
                    <strong>Sami Darraji</strong> 
                </div>   
                <small>${t.date}</small>
            </div>
            <p>${t.text}</p>
            <span class="material-symbols-outlined btn-delete" onclick="deleteComment(${e},${t.id})">
               close
            </span>
        </div>
    `,i.value="",(o=JSON.parse(localStorage.getItem("comments"))||{})[e]||(o[e]=[]),o[e].push(t),localStorage.setItem("comments",JSON.stringify(o)))}function deleteComment(e,t){var i=document.getElementById(e+"-"+t),i=(i&&i.remove(),JSON.parse(localStorage.getItem("comments"))||{});i[e]&&(i[e]=i[e].filter(e=>e.id!==t),localStorage.setItem("comments",JSON.stringify(i)))}loadPosts();