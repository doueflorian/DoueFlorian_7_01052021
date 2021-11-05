<template>

<h1>Mon Compte</h1>

  <!-- Conteneur qui affiche les informations utilisateur -->
  <div id="account">
    <div class="user-card">
      <!-- Informations utilisateurs 1 -->
      <div class="user-card__infos">
          <h2>{{ user.last_name }} {{ user.first_name }}</h2>
          <span> Utilisateur n° {{ user.id }} </span>
          <span> Inscrit le {{ user.created_at.replace(/T|Z|:\d\d\.\d\d\d/g,' ') }} </span>
          <span class="user_control">
            <button @click="showModify = !showModify" class="modify_post"><i class="fas fa-pen"></i> Modifier </button>
            <button @click="showDelete = !showDelete" class="delete_post"><i class="fas fa-trash"></i> Supprimer mon compte</button>
          </span>
      </div>
      <!-- Suppresion du compte, demande le mot de passe -->
        <form v-show="showDelete" @submit="deleteUser" :data-id="user.id" class="delete_form">
          <h2>Supprimer mon compte</h2>
          <label>Mot de passe </label>
          <input required v-model="password" type="password" placeholder="Password"/>
          <button type="submit">Supprimer</button>
      </form>
      <!-- Modification du compte -->
      <form @submit="modifyUser" :data-id="id" v-show="showModify" name="modify_com" class="modify_form" method="PUT">
      <h2>Modifier mon compte</h2>
        <label>Nom : 
          <input type="text" name="last_name" :value="user.last_name" required>
        </label>
        <label>Prénom : 
          <input type="text" name="first_name" :value="user.first_name" required>
        </label>
        <label>Date de naissance : 
          <input v-if="user.date_of_birth === null" type="date" name="date_of_birth" >
          <input v-else type="date" name="date_of_birth" :value="user.date_of_birth">
        </label>
        <label>Adresse eMail : 
          <input type="email" name="email" :value="user.email" required>
        </label>
        <label>Poste occupé : 
          <input v-if="user.occupation === null" type="text" name="occupation">
          <input v-else type="text" name="occupation" :value="user.occupation">
        </label>
        <label class="file_upload">Ajouter une photo de profil <i class="far fa-file-image"></i>
          <input @change="onFileChange" type="file" data-name="account_image" class="hide" name="file" accept="image/*">
        </label>
        <div class="preview" v-if="previewUrl">
          <img class="img-user" :src="previewUrl" /><br />
          <span  @click="deleteImg" :data-id="id" class="preview_delete"> Supprimer </span>
        </div>
        <label class="checkbox_label">Supprimer sa photo de profil <input type="checkbox" v-model="checked" name="delete_uploaded_image" value="supprimer image"></label>
        <input type="submit" class="submit" value="Publier">
      </form>
      <!-- Informations utilisateurs 2 -->
      <div class="user-card__infos-2">
            <p>
              <span v-if="user.profile_pic !== null"> <img :src="user.profile_pic" class="profile_pic-account" :alt="'Photo de profil de l\'utilisateur' + user.id"> </span>
              <span v-else> <i class="fas fa-user-circle profile_nopic-account"></i> </span>
            </p>
            <p>Anniversaire : 
              <span v-if="user.date_of_birth !== null">{{ user.date_of_birth }}</span>
              <span v-else>Non renseigné</span>
            </p>
            <p>Poste occupé : 
              <span v-if="user.occupation !== null">{{ user.occupation }}</span>
              <span v-else>Non renseigné</span>
            </p>
      </div>
    </div>
  </div>

  <!-- Conteneur pour afficher les posts de l'utilisateur -->
  <div>
      <button class="display-user-posts" @click="showPosts  = !showPosts">Afficher les posts de l'utilisateur</button>

      <PostTemplate v-show="showPosts" class="home-post" v-for="post in posts" :key="post.id"
        :lastname="post.User.last_name"
        :firstname="post.User.first_name"
        :createdat="post.created_at.replace(/T|Z|:\d\d\.\d\d\d/g,' ')"
        :id="post.id"
        :message="post.message.replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/ig, this.getUrl)"
        :imageurl="post.image_url"
        :profilepic="post.User.profile_pic"
        :userid="post.user_id"
        :tokenid="token.user_id"
        :tokenlevel="token.user_level"
        :likes="post.likes"
        :dislikes="post.dislikes"
      />
  </div>
</template>

<script>
import router from '../router';
import store from '../store';
import PostTemplate from '../components/PostTemplate.vue'

export default {
  name: 'Account',
  components: {
    PostTemplate
  },
    data(){
      return {
        user: {},
        posts: [],
        token: store.state.token,
        showPosts: false,
        showDelete: false,
        showModify: false,
        previewUrl: null,
        error: null
      }
  },
  methods: {
    // Transformer liens texte en liens
    getUrl(url) {
      return `<a href="${url}">${url}</a>`
    },
    // Afficher une miniature de l'iumage insérée dans le formulaire avant envoi
    onFileChange(e) {
      const file = e.target.files[0];
      // Créer une URL temporaire afin de l'afficher
      this.previewUrl = URL.createObjectURL(file);
    },
    // Supprimer l'image insérée dans le formulaire avant envoi
    deleteImg() {
      // Remplacer l'image par une valeur nulle
      document.querySelector(`[data-name="account_image"]`).value = "";
      // Masquer le preview
      this.previewUrl = null;
    },
    // Suppression utilisateur
    deleteUser : function(e) { 
      e.preventDefault();
      let id = e.target.getAttribute("data-id")
        fetch("http://localhost:3000/api/users/delete/" + id,{
          method: "DELETE",
          headers: {"Authorization": `Bearer ${sessionStorage.userToken}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
          },
            mode: 'cors',
            body: JSON.stringify({
                user_id: store.state.token.user_id,
                user_level: store.state.token.user_level,
                password: this.password
              })
            })
            .then( (response) => {
              if(response.ok) {
                return response.json();
              }else{
                throw 'mot de passe incorrect'
              }
            })
        .then(function() {
          sessionStorage.removeItem('userToken');
          alert("utilisateur supprimé");
          router.push('/signup')
        })
        .catch((error) => alert(error) )

    },
    // Modification utilisateur
    modifyUser : function(e) {
        e.preventDefault();

        // Créer un FormData et l'object User
        let formData = new FormData();
        let userData = {}

      // Vérifier les données de dates de naissance et d'occupation
      // Si null, ne pas envoyer et laisser la DB générer une valeur nulle
      if(e.target.date_of_birth.value == "" && e.target.occupation.value == ""){
        userData = {
          last_name: e.target.last_name.value.toUpperCase(),
          first_name: e.target.first_name.value,
          date_of_birth: null,
          occupation: null,
          id: store.state.token.user_id,
          user_level: store.state.token.user_level
        }
      }else if(e.target.date_of_birth.value == ""){
        userData = {
          last_name: e.target.last_name.value.toUpperCase(),
          first_name: e.target.first_name.value,
          date_of_birth: null,
          occupation: e.target.occupation.value,
          id: store.state.token.user_id,
          user_level: store.state.token.user_level
        }
      }else if(e.target.occupation.value == ""){
        userData = {
          last_name: e.target.last_name.value.toUpperCase(),
          first_name: e.target.first_name.value,
          date_of_birth: e.target.date_of_birth.value,
          occupation: null,
          id: store.state.token.user_id,
          user_level: store.state.token.user_level
        }
      }else{
        userData = {
          last_name: e.target.last_name.value.toUpperCase(),
          first_name: e.target.first_name.value,
          date_of_birth: e.target.date_of_birth.value,
          occupation: e.target.occupation.value,
          id: store.state.token.user_id,
          user_level: store.state.token.user_level
        }
      }
        
        // Rentrer les données sous chaine JSON afin de les parser dans le backend
        const User = JSON.stringify(userData);
        formData.append("User", User);
      
          // Si "Supprimer image" cochée, insérer "deleteImg" dans le formData
          // Le backend comprendre que l'image préalablement présente doit être supprimée
          if (e.target.delete_uploaded_image.checked){
            formData.append("deleteImg", null);
          }
            
          // Si fichier inséré dans le formulaire, l'ajouter au formData
          if (e.target.file.files[0]) {
            formData.append("image", e.target.file.files[0], e.target.file.files[0].name );
          }

        // Si fichier n'est pas JPG ou PNG, alerter l'utilisateur
        if (e.target.file.files[0] && !e.target.file.files[0].name.match(/.(jpg|jpeg|png)$/i)) {
            alert(`Format ${e.target.file.files[0].type} non accepté`);

        // Sinon, envoyer au backend
        }else {

            fetch("http://localhost:3000/api/users/" + store.state.token.user_id,{
              method: "PUT",
              headers: {"Authorization": `Bearer ${sessionStorage.userToken}`},
              mode: 'cors',
              body: formData
              })
          .then( (response) => {
              if(response.ok) {
                return response.json();
              }else{
                throw 'Erreur lors de la modification'
              }
            })
          .then(() => router.go())
          .catch((error) => this.modifyError = error)
        }

      }
  },
  // Avant création, vérifier la présence d'un token dans le sessionStorage
  // Si null, renvoyer au login
  beforeCreate () {
    if (!sessionStorage.userToken) {
      router.push('/login');
    }else {
      store.dispatch('getToken');
    }
  },
  created () {
        // Récupérer les infos utilisateur depuis la DB
        fetch("http://localhost:3000/api/users/" + store.state.token.user_id ,{
            headers: {"Authorization": `Bearer ${sessionStorage.userToken}`},
            mode: 'cors'
            })
        .then( function(response) {
            return response.json() })
        .then(data => this.user = data)
        .catch((error) => { console.log(error, "Couldn't find products");});

        // Récupérer les posts utilisateur depuis la DB
        fetch("http://localhost:3000/api/users/" + store.state.token.user_id + "/posts",{
            headers: {"Authorization": `Bearer ${sessionStorage.userToken}`},
            mode: 'cors'
            })
        .then( function(response) {
            return response.json() })
        .then(data => this.posts = data)
        .catch((error) => { error });
    
  }
}
</script>

<style lang="scss">

  .user-card {
    margin: 1em auto;
    color: #000;
    margin-top: 2em;
    border: 1px solid transparent;
    border-radius: 0.5em;
    background-color: #fff;
    width: 80%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1em;

    .profile_pic-account {
      border-radius: 10em;
      width: 10em;
    }

    .profile_nopic-account{
      font-size: 10em;
    }

    &__infos {
      display: flex;
      justify-content: space-between;
      padding: 0em 0.5em;
      margin-bottom: 1em;
      align-items: baseline;
      
      @media (max-width: 810px) {
        flex-direction: column;
        align-items: center;
      }

      span:nth-child(1){
        flex: 1;
      }
      span:nth-child(2){
        margin-right: 1em;
      }
    }

    &__infos-2 {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
          @media (max-width: 810px) {
        flex-direction: column;
        align-items: center;
      }
    }
  }

  .delete_form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .display-user-posts {
    margin-left: 10%;
  }

</style>