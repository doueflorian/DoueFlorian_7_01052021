<template>

    <!-- Conteneur d'un post -->
    <div class="post-card">
      <!-- Informations de l'utilisateur à l'origine du post -->
      <div class="post-card__infos">
        <span class="post-card__infos-user"> 
          <img v-if="profilepic" class="profile_pic-post" :src="profilepic"  :alt="'Photo de profil de l\'utilisateur' + userid">
          <i v-else class="fas fa-user-circle profile_nopic-post"></i>
          <a class="post-card_links" :href="'/user?id=' + userid">{{ lastname }} {{ firstname}}</a>
        </span>
        <span>
          {{ createdat }}
          <a class="post-card_links" :href="'/post?id=' + id">Post #{{ id }}</a>
        </span>

        <!-- Conteneur modération du post, afficher si utilisateur est à l'origine du post, ou s'il a un user_level de 1 -->        
        <span v-if="tokenid === userid || tokenlevel === 1" class="user_control">
          <!-- Afficher formulaire modification -->
          <button
            @click="showModify  = !showModify" v-show="!showModify">
            <i class="fas fa-pen"></i> Modifier
          </button>
          <!-- Cacher formulaire modification -->
          <button
            @click="showModify  = !showModify" v-show="showModify">
            <i class="fas fa-pen"></i> Annuler
          </button>
          <!-- Supprimer le post -->
          <button
            @click="deletePost"
            v-if="tokenid === userid || tokenlevel === 1 " 
            :data-id="id"><i class="fas fa-trash"></i> Supprimer
          </button>
        </span>
      </div>
      <!-- Conteneur du message -->
      <div  class="post-card__message">
        <!-- message du post, disparait en cas de modification -->
        <p v-show="!showModify" v-html="decodedMessage" class="post-card__message-text"></p>
        <!-- Image -->
        <div v-if="imageurl !== null" class="post-card__message-img">
          <img class="post-card__message-img-file" :src="imageurl" />
        </div>

        <!-- Formulaire de modification qui apparaît à l'appel utilisateur -->
        <form @submit="modifyPost" :data-id="id" v-show="showModify" name="modify_post" class="modify_form" method="PUT">
          <textarea type="text" class="message_form" name="message" :value="message" rows="3" />
          <label class="file_upload">Ajouter une image <i class="far fa-file-image"></i>
            <input @change="onFileChange" type="file" :img-id="id" class="hide" name="file" accept="image/*">
          </label>
          <div class="preview" v-if="previewUrl">
            <img :src="previewUrl" /><br />
            <i @click="deleteImg" :data-id="id" class="fas fa-window-close preview_delete"></i>
          </div>
          <label>Supprimer l'image de la publication
          <input type="checkbox" v-model="checked" name="delete_uploaded_image" value="supprimer image"></label>
          <input type="submit"  class="submit" value="Publier">
          <span class="post_error" v-if="preventEmptyPost !== null">{{ preventEmptyPost }}</span>
        </form>

      </div>
      <!-- Conteneur des réactions au post -->
      <div class="post-card_end"> 
        <span>
          <i :data-id="id" @click="send_like" class="fas fa-thumbs-up"></i> {{likes}} 
          <i :data-id="id" @click="send_dislike" class="fas fa-thumbs-down"></i> {{ dislikes}} 
        </span>
        <!-- Réaction du post, montrer différents conteneurs selon leur nombre -->
        <!-- si 0 réaction -->
        <div v-if="reactions.length == 0">
          <span> Personne n'a réagi à ce post </span>
        </div>
        <!-- si 1 réaction -->
        <div v-if="reactions.length === 1">
          <span v-for="reaction in reactions" :key="reaction.id"> {{ reaction.User.last_name }} {{ reaction.User.first_name }} </span>
          <span> a réagi à ce post </span>
        </div>
        <!-- si > 1 et <= 4 réactions -->
        <div v-if="reactions.length > 1 && reactions.length <= 4">
          <span v-for="reaction in reactions" :key="reaction.id"> {{ reaction.User.last_name }} {{ reaction.User.first_name }}  , </span>
          <span> ont réagi à ce post </span>
        </div>
        <!-- si >= 5 réactions -->
        <div  v-if="reactions.length >= 5">
          <span> {{ reactions.length }} personnes ont réagi à ce post -</span>
          <span @click ="showLikes = !showLikes" class="show_likes"> Voir toutes les reactions </span>
          <div v-show="showLikes">
            <span v-for="reaction in reactions" :key="reaction.id"> {{ reaction.User.last_name }} {{ reaction.User.first_name }}  , </span>
            <span> ont réagi à ce post </span>
          </div>
        </div>
    
      <a class="post-card_links" v-if="this.$route.name === 'Home'" :href="'/post?id=' + id">Voir le post - Commenter</a>

      </div>
    </div>

</template>

<script>
import store from '../store'

export default {
  name: 'PostTemplate',
  props: ['lastname', 'firstname', 'createdat', 'id', 'message', 'decodedMessage', 'imageurl', 'userid', 'tokenid',
          'tokenlevel', 'likes', 'dislikes', 'profilepic'],
  data() {
    return {
      token: store.state.token,
      comments: [],
      reactions: [],
      showModify: false,
      showComments: false,
      previewUrl: null,
      error: null,
      preventEmptyPost: null,
      showLikes: null
    }
  },
  methods: {
    // Récupérer les réactions du post
    getReactions(){
        fetch("http://localhost:3000/api/posts/" + this.id + "/reactions",{
        headers: {Authorization: `Bearer ${sessionStorage.userToken}`},
        mode: 'cors' })
      .then( (response) => {
        if(response.ok) {
          return response.json();
        }else{
          throw 'Reactions indisponibles'
        }
      })
      .then(data => this.reactions = data)
      .catch((error) => console.log(error))
    },
    // Afficher une miniature de l'image insérée dans le formulaire avant envoi
    onFileChange(e) {
      const file = e.target.files[0];
      // Créer une URL temporaire afin de l'afficher
      this.previewUrl = URL.createObjectURL(file);
    },
    // Supprimer l'image insérée dans le formulaire avant envoi
    deleteImg(e) {
      // Remplacer l'image par une valeur nulle
      let id = e.target.getAttribute("data-id");
      document.querySelector(`[img-id="${id}"]`).value = "";
      // Masquer le preview
      this.previewUrl = null;
    },
    // Modification d'un post
    modifyPost : function(e) {
        e.preventDefault();

      // Vérification qu'une des deux inputs principales soit remplie
      if(!e.target.message.value && !e.target.file.files[0]){
        return this.preventEmptyPost = "Veuillez écrire un message ou envoyer une image"

      }else{
        let id = e.target.getAttribute("data-id");

        // Créer un FormData et le rendre vide
        let formData = new FormData();
        formData.delete("message");

        // Récupérer les données du formulaire et du token
        const postData = {
          message: e.target.message.value,
          user_id: store.state.token.user_id,
          user_level: store.state.token.user_level,
          last_name: store.state.token.last_name,
          first_name: store.state.token.first_name
        };

        // Rentrer les données sous chaine JSON afin de les parser dans le backend
        const Post = JSON.stringify(postData);
        formData.append("Post", Post);
      
          // Si "Supprimer image" cochée, insérer "deleteImg" dans le formData
          // Le backend comprendre que l'image préalablement présente doit être supprimée
          if (e.target.delete_uploaded_image.checked){
            formData.append("deleteImg", null);
          }
          // Si fichier inséré dans le formulaire, l'ajouter au formData
          if (e.target.file.files[0]) {
            formData.append("image", e.target.file.files[0], e.target.file.files[0].name );
          }
            // Envoyer le post au backend
            fetch("http://localhost:3000/api/posts/" + id,{
              method: "PUT",
              headers: {"Authorization": `Bearer ${sessionStorage.userToken}`},
              mode: 'cors',
              body: formData
              })
            .then( function(response) {
              return response.json() })
          .then(() => this.showModify = false)
          .then(() => this.$parent.getPosts())
          .catch((error) => { error})  
      }
    },
    // Suppresion du post
    deletePost : function(e) { 
      // Vérifier la volonté de supprimer le post
      if(window.confirm('Souhaitez vous supprimer ce Post ?')){

        let id = e.target.getAttribute("data-id")
          fetch("http://localhost:3000/api/posts/" + id,{
            method: "delete",
            headers: {"Authorization": `Bearer ${sessionStorage.userToken}`},
            mode: 'cors'
            })
        .then( function(response) {
                return response.json() })
        .then(() => this.$parent.getPosts())
        .catch((error) => { error})  
      }
    },
    // Envoi d'un like
    send_like(e) {
      let id = e.target.getAttribute("data-id")

        fetch("http://localhost:3000/api/posts/" + id + "/reactions",{
          method: "POST",
          headers: {"Authorization": `Bearer ${sessionStorage.userToken}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
          },
          mode: 'cors',
          // Envoyer "1" au backend avec les infos utilisateur
          body: JSON.stringify({
            "like_data": 1,
            "user_id": store.state.token.user_id,
            "post_id": id
            })
      })
      .then( function(response) {
              return response.json() })
      .then(() => this.getReactions())
      .then(() => this.$parent.getPosts())
      .catch((error) => { error})  
    },
    // Envoyer d'un dislike
    send_dislike(e) {
      let id = e.target.getAttribute("data-id")

        fetch("http://localhost:3000/api/posts/" + id + "/reactions",{
          method: "POST",
          headers: {"Authorization": `Bearer ${sessionStorage.userToken}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
          },
          mode: 'cors',
          // Envoyer "-1" au backend avec les infos utilisateur
          body: JSON.stringify({
            "like_data": -1,
            "user_id": store.state.token.user_id,
            "post_id": id,
            })
      })
      .then( function(response) {
              return response.json() })
      .then(() => this.getReactions())
      .then(() => this.$parent.getPosts())
      .catch((error) => { error})  
    },         
  },
  // Avant création, vérifier la présence d'un token dans le sessionStorage
  // Si null, renvoyer au login
  beforeCreate () {
      store.dispatch('getToken');
  },
  created () {
    // Récupérer les reactions
    this.getReactions();
  }
}
</script>