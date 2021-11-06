<template>

    <!-- Conteneur d'un commentaire -->
    <div  class="comment-card" >
      <!-- Informations de l'utilisateur à l'origine du commentaire -->
      <div class="comment-card__infos">
        <span > 
          <img v-if="profilepic" class="profile_pic-post" :src="profilepic"  :alt="'Photo de profil de l\'utilisateur' + userid">
          <i v-else class="fas fa-user-circle profile_nopic-post"></i>
        </span>
        <span>
          <a class="post-card_links" :href="'/user?id=' + userid">{{ lastname }} {{ firstname}}</a>
        </span>
        <span>
          {{ createdat }}
        </span>
        <!-- Conteneur modération du post, afficher si utilisateur est à l'origine du post, ou s'il a un user_level de 1 -->
        <span v-if="tokenid === userid || tokenlevel === 1 " class="user_control">
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
            @click="deleteCom"
            v-if="tokenid === userid || tokenlevel === 1 " 
            :data-id="id"><i class="fas fa-trash"></i> Supprimer
          </button>
        </span>
      </div>
      <!-- Conteneur du message -->
      <div  class="comment-card__message">
          <p v-show="!showModify" class="comment-card__message-text" v-html="decodedMessage"></p>

        <div v-if="imageurl !== null" class="comment-card__message-img">
          <img :src="imageurl" />
        </div>
      </div>

        <!-- Formulaire de modification qui apparaît à l'appel utilisateur -->
        <form @submit="modifyCom" :data-id="id" v-show="showModify" name="modify_com" class="modify_form" method="PUT">
          <textarea type="text" class="message_form" name="message" :value="message" rows="3" />
          <label class="file_upload">Ajouter une image <i class="far fa-file-image"></i>
            <input @change="onFileChange" type="file" class="hide" name="file" :img-id="id" accept="image/*"> 
          </label>
          <div class="preview" v-if="previewUrl">
            <img :src="previewUrl" /><br />
            <i @click="deleteImg" :data-id="id" class="fas fa-window-close preview_delete"></i>
          </div>
          <label for="delete_image">Supprimer image</label>
          <input type="checkbox" v-model="checked" name="delete_image" value="supprimer image">
          <input type="submit" class="submit" value="Publier">
        <span class="post_error" v-if="preventEmptyPost !== null">{{ preventEmptyPost }}</span>
        </form>
      
    </div>



</template>

<script>
import store from '../store'

export default {
  name: 'CommmentTemplate',
  props: ['lastname', 'firstname', 'createdat', 'id', 'message', 'decodedMessage', 'imageurl', 'userid', 'tokenid',
          'tokenlevel', 'profilepic'],
  data() {
    return {
      showModify: false,
      showComments: false,
      previewUrl: null,
      preventEmptyPost: null
    }
  },
    methods: {
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
    // Modification d'un commentaire
    modifyCom : function(e) {
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
        const commentData = {
          message: e.target.message.value,
          user_id: store.state.token.user_id
        };

        // Rentrer les données sous chaine JSON afin de les parser dans le backend
        const comment = JSON.stringify(commentData);
        formData.append("Comment", comment);

          // Si "Supprimer image" cochée, insérer "deleteImg" dans le formData
          // Le backend comprendre que l'image préalablement présente doit être supprimée
          if (e.target.delete_image.checked){
          formData.append("deleteImg", null);
          }
          // Si fichier inséré dans le formulaire, l'ajouter au formData
          if (e.target.file.files[0]) {
          formData.append("image", e.target.file.files[0], e.target.file.files[0].name );
          }
            // Envoyer le commentaire au backend
            fetch("http://localhost:3000/api/posts/comments/" + id,{
              method: "PUT",
              headers: {"Authorization": `Bearer ${sessionStorage.userToken}`},
              mode: 'cors',
              body: formData
              })
            .then( function(response) {
              return response.json() })
          .then(() => this.showModify = false)
          .then(() => this.$parent.getComments() )
          .catch((error) => { error})  
      }
    },
    // Suppresion du post
    deleteCom : function(e) { 
    // Vérifier la volonté de supprimer le commentaire
      if(window.confirm('Souhaitez vous supprimer ce Commentaire ?')){
        let id = e.target.getAttribute("data-id")
          fetch("http://localhost:3000/api/posts/comments/" + id,{
            method: "delete",
            headers: {"Authorization": `Bearer ${sessionStorage.userToken}`},
            mode: 'cors'
            })
        .then( function(response) {
                return response.json() })
        .then(() => this.$parent.getComments() )
        .catch((error) => { error})  
      }
    }
  }
}
</script>
