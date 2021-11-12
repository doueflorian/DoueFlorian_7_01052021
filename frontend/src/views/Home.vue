<template>
  <div>
    <h1>Accueil</h1>

    <!-- conteneur de preview de l'image insérée dans le formulaire -->
    <div v-if="error == null" class="send_post">
      <div class="preview" v-if="previewUrl">
        <img :src="previewUrl" /><br />
        <span  @click="deleteImg" :data-id="id" class="preview_delete"> Supprimer </span>
      </div>
    <!-- Formulaire d'envoi de post -->
      <form v-if="error == null" @submit="sendPost" id="send_post" name="send_post" class="send_form" method="post">
        <textarea name="message" class="message" placeholder="Votre message" rows="1"></textarea>
        <label class="file_upload">Ajouter une image <i class="far fa-file-image"></i>
          <input @change="onFileChange" type="file" data-name="post_image" class="file" name="file" accept="image/*">
        </label>
        <input type="submit" class="submit" value="Publier">
      </form>
      <span class="post_error" v-if="preventEmptyPost !== null">{{ preventEmptyPost }}</span>
    </div>

    <!-- Conteneur qui affiche une erreur si besoin -->
    <div v-if="error !== null" class="home_error">
      <h2>{{ error }}</h2>
    </div>
   
    <!-- Conteneur qui affiche les posts -->
   <div id="home">
      <PostTemplate  class="home-post" v-for="post in posts" :key="post.id"
        :lastname="post.User.last_name"
        :firstname="post.User.first_name"
        :createdat="post.created_at.replace(/T|Z|:\d\d\.\d\d\d/g,' ')"
        :id="post.id"
        :decodedMessage="post.message.replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/ig, this.getUrl)"
        :message="post.message"
        :imageurl="post.image_url"
        :profilepic="post.User.profile_pic"
        :userid="post.user_id"
        :tokenid="token.user_id"
        :tokenlevel="token.user_level"
        :likes="post.likes"
        :dislikes="post.dislikes"
      />

  </div>
      

  </div>
</template>

<script>
import router from '../router';
import store from '../store'
import PostTemplate from '../components/PostTemplate.vue'

export default {
  name: 'Posts',
  components: {
    PostTemplate
  },
  data(){
      return {
        token: store.state.token,
        posts: [],
        error: null,
        previewUrl: null,
        preventEmptyPost: null
        }
  },
  methods: {
    // Transformer liens texte en liens
    getUrl(url) {
      return `<a href="http://${url}"  target="_blank">${url}</a>`
    },
    // Récupérer tous les posts
    getPosts() {
      fetch("http://localhost:3000/api/posts",{
        headers: {"Authorization": `Bearer ${sessionStorage.userToken}`},
        mode: 'cors'
        })
        .then( (response) => {
          if(response.ok) {
            return response.json();
          }else{
            throw 'Posts indisponibles'
          }
        })
      .then(data => this.posts = data)
      .catch((error) => this.error = error)
    },
    // Afficher une miniature de l'image insérée dans le formulaire avant envoi
    onFileChange(e) {
      const file = e.target.files[0];
      // Créer une URL temporaire afin de l'afficher
      this.previewUrl = URL.createObjectURL(file);
    },
    // Supprimer l'image insérée dans le formulaire avant envoi
    deleteImg() {
      // Remplacer l'image par une valeur nulle
      document.querySelector(`[data-name="post_image"]`).value = "";
      // Masquer le preview
      this.previewUrl = null;
    },
    // Création d'un post
    sendPost(e) {
      e.preventDefault();

      // Vérification qu'une des deux inputs principales soit remplie
      if(!e.target.message.value && !e.target.file.files[0]){
        return this.preventEmptyPost = "Veuillez écrire un message ou envoyer une image"
      }else{

        // Créer un FormData et le rendre vide
        let formData = new FormData();
        formData.delete('message');

        // Récupérer les données du formulaire et du token
        const postData = {
          message: e.target.message.value,
          user_id: store.state.token.user_id
        };

        // Rentrer les données sous chaine JSON afin de les parser dans le backend
        const Post = JSON.stringify(postData);
        // Les rentrer dans le FormData sous le nom attendu par le backend
        formData.append("Post", Post);
        
            // Si fichier inséré dans le formulaire, l'ajouter au formData
            if (e.target.file.files[0]) {
            formData.append("image", e.target.file.files[0], e.target.file.files[0].name );
            }

            // Envoyer le post au backend
            fetch("http://localhost:3000/api/posts", {
              method : "POST",
              headers: {
                "Authorization": `Bearer ${sessionStorage.userToken}`
              },
              mode: 'cors',
              body: formData
            })
            .then(function(response){
              return response.json();
            })
            .then(() => this.getPosts() )
            .then(() => this.previewUrl = null)
            .catch((error) => {error})
          e.target.reset();
      }
    } 
  },
  // Avant création, vérifier la présence d'un token dans le sessionStorage
  // Si null, renvoyer au login
  beforeCreate () {
    if (!sessionStorage.userToken) {
      router.push('/');
    }else {
      store.dispatch('getToken');
    }
  },
  created () {
    // Récupérer les posts
    this.getPosts();
  }
}
</script>

<style lang="scss">

  .home_error{
    text-align: center;
  }

  .post_error{
    color: #000;
  }

// Style du formulaire d'envoi de post de cette vue
  .send_post {
    margin: auto;
    display: flex;
    width: 95%;
    flex-direction: column;
    border-radius: 0.2em;
    padding: 0.2em 0.1em 0.2em;
    align-items: center;
    background-color: #fff;

      @media (min-width: 811px) {
        width: 60%;
      }
  }

  .home-img_preview {
    text-align: center;
    margin: auto;
    width: 50%;
    padding: 0em 0.5em;
    color: #000;
  }

  .home-post{
    background-color: #fff;
    padding: 1em;
    margin: 1em auto;

    @media (min-width: 811px) {
      width: 80%;
      border-radius: 0.5em;
    }
  }

  .post-card {
    color: #000;
    margin-top: 2em;
    border: 1px solid transparent;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;

    &__infos {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0em 0.5em;
    margin-bottom: 1em;
    flex-wrap: wrap;
      @media (max-width: 1024px) {
        flex-direction: column;
      }

      span:nth-child(1){
        flex: 1;
      }

      span:nth-child(2){
        @media (min-width: 1024px) {
          margin-right: 1em;
        }
      }

      &-user {
        display: flex;
        align-items: center;
      }
    }

    &__message {
      background-color: #fff;
      padding: 0em 1.5em;
      display:flex;
      flex-direction: column;
      font-size: 1.1em;

      &-img {
      max-height: 20em;
      align-self: center;
      text-align: center;
        
        &-file{
        width: 100%;
        height: 100%;
        object-fit: contain;
        }
      }

      a{
        color: #1327e6;
        &:hover{
          color: #1327e6
        }
      }
    }
    
    &_end {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      
      @media (max-width: 810px) {
        text-align: center;
        flex-direction: column;
      }
    }

    &_links{
      text-decoration: none;
      color: #000;

        &:hover{
          text-decoration: underline;
        }
    }
  }

  .show_likes{
    cursor: pointer;
    color: #000;
  }  

</style>