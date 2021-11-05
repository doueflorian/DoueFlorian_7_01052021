<template>

    <h1>Post n° {{ post.id }}</h1>


    <div id="post">

      <PostTemplate class="comments-post" :key="post.id"
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


      <!-- Différents conteneurs selon le nombre de commentaires -->
      <!-- Si + de 3 commentaires, afficher 3 commentaires -->
      <div v-if="showMore === false && comments.length > 3">
        <p class="more_coms" >
          <span> Nombre de commentaires :  {{ comments.length }} </span>
      <!--lien clickable pour en afficher + de 3 commentaires -->
          <span @click="showMore = true"> Voir plus de commentaires </span>   
        </p>

        <CommentTemplate v-for="comment in comments.slice(0, 3)" :key="comment.id"
          :lastname="comment.User.last_name"
          :firstname="comment.User.first_name"
          :createdat="comment.created_at.replace(/T|Z|:\d\d\.\d\d\d/g,' ')"
          :id="comment.id"
          :decodedMessage="comment.message.replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/ig, this.getUrl)"
          :message="comment.message"
          :imageurl="comment.image_url"
          :profilepic="comment.User.profile_pic"
          :userid="comment.user_id"
          :tokenid="token.user_id"
          :tokenlevel="token.user_level"
        />

      </div>
      
      <!-- Si moins de 3 commentaires, tout afficher -->
      <div v-else>
        <p class="more_coms" >
          <span> Nombre de commentaires :  {{ comments.length }} </span>
      <!-- afficher un lien clickable pour voir moins de trois commentaires si + de 3 commentaires -->
          <span v-if="comments.length > 3" @click="showMore = false"> Voir moins de commentaires </span>
        </p>

        <CommentTemplate v-for="comment in comments" :key="comment.id"
          :lastname="comment.User.last_name"
          :firstname="comment.User.first_name"
          :createdat="comment.created_at.replace(/T|Z|:\d\d\.\d\d\d/g,' ')"
          :id="comment.id"
          :decodedMessage="comment.message.replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/ig, this.getUrl)"
          :message="comment.message"
          :imageurl="comment.image_url"
          :profilepic="comment.User.profile_pic"
          :userid="comment.user_id"
          :tokenid="token.user_id"
          :tokenlevel="token.user_level"
        />

      </div>

      <div class="send_comment">
        <div class="home-img_preview" v-if="previewUrl">
          <img class="preview"  :src="previewUrl" /><br />
          <i @click="deleteImg" :data-id="id" class="fas fa-times-circle"></i>
        </div>

        <form @submit="sendComment" :data-id="id" name="send_comment" class="send_form" method="post">
          <input type="text" name="message" class="message" placeholder="Votre commentaire" rows="3" />
         <label class="file_upload">Ajouter une image <i class="far fa-file-image"></i>
          <input @change="onFileChange" data-name="comment_img" type="file" class="file" name="file" accept="image/*">
        </label>
        <input type="submit" class="submit" value="Publier">
        </form>
          <span class="post_error" v-if="preventEmptyPost !== null">{{ preventEmptyPost }}</span>
      </div>
  </div>
  
</template>

<script>
import router from '../router';
import store from '../store';
import PostTemplate from '../components/PostTemplate.vue'
import CommentTemplate from '../components/CommentTemplate.vue'

const post_id = new URLSearchParams(window.location.search).get('id');

export default {
  name: 'Post',
    components: {
    PostTemplate,
    CommentTemplate
  },
    data(){
      return {
        token: store.state.token,
        post: {},
        comments: [],
        previewUrl: null,
        showMore: false,
        preventEmptyPost: null
      }
  },
  methods: {
    // Transformer liens texte en liens
    getUrl(url) {
      return `<a href="http://${url}"  target="_blank">${url}</a>`
    },
    getPosts() {
      fetch("http://localhost:3000/api/posts/" + post_id,{
        headers: {Authorization: `Bearer ${sessionStorage.userToken}`},
        mode: 'cors'
        })
        .then( function(response) {
          return response.json() })
        .then( data => this.post = data )
        .catch((error) => { console.log(error, "Couldn't find posts") } );
    },
    getComments() {
      fetch("http://localhost:3000/api/posts/" + post_id + "/comments",{
        headers: {Authorization: `Bearer ${sessionStorage.userToken}`},
        mode: 'cors' })
        .then( function(response) {
          return response.json() })
        .then(data => this.comments = data)
        .catch((error) => { console.log(error, "Couldn't find comments") } );
    },
    deleteImg() {
      document.querySelector(`[data-name="comment_img"]`).value = "";
      this.previewUrl = null;
    },
    onFileChange(e) {
      const file = e.target.files[0];
      this.previewUrl = URL.createObjectURL(file);
    },
    modifyPost : function(e) {
        e.preventDefault();

      let id = e.target.getAttribute("modify-post-id");

        let formData = new FormData();

        formData.delete('message');
        const postData = {
          message: e.target.message.value,
          user_id: store.state.token.user_id,
          last_name: store.state.token.last_name,
          first_name: store.state.token.first_name
        };
        const fileInput = document.getElementById('file');
      
        const Post = JSON.stringify(postData);
      
          formData.append("Post", Post);

          if (fileInput.files[0]) {
          formData.append("image", fileInput.files[0], fileInput.files[0].name );
          }

          console.log(...formData)
            fetch("http://localhost:3000/api/posts/" + id,{
              method: "PUT",
              headers: {"Authorization": `Bearer ${sessionStorage.userToken}`},
              mode: 'cors',
              body: formData
              })
            .then( function(response) {
              return response.json() })
          .then(() => this.getPosts())
          .catch((error) => { error})  
    },
    
    deletePost : function(e) { 
    
    let id = e.target.getAttribute("data-id")
  
    fetch("http://localhost:3000/api/posts/" + id,{
      method: "DELETE",
      headers: {"Authorization": `Bearer ${sessionStorage.userToken}`},
      mode: 'cors'
      })
      .then( function(response) {
        return response.json() })
      .then(() => router.push('/'))
      .catch((error) => { error})  
    },

    sendComment : function(e) { 
      e.preventDefault();

      if(!e.target.message.value && !e.target.file.files[0]){
        return this.preventEmptyPost = "Veuillez écrire un message ou envoyer une image"

      }else{

        let formData = new FormData();
        formData.delete('message');

        const commentData = {
        message: e.target.message.value,
        user_id: store.state.token.user_id,
        last_name: store.state.token.last_name,
        first_name: store.state.token.first_name,
        post_id: post_id
        }

        const Comment = JSON.stringify(commentData);

          formData.append("Comment", Comment);


          if (e.target.file.files[0]) {
          formData.append("image", e.target.file.files[0], e.target.file.files[0].name );
          }

        fetch("http://localhost:3000/api/posts/" + `${post_id}` + "/comments", {
          method : "POST",
          headers: {
            "Authorization": `Bearer ${sessionStorage.userToken}`},
          mode: 'cors',
          body : formData
        })
        .then(function(response){
          return response.json();
        })
        .then(() => this.getComments() )
        .catch((error) => { console.log(error, "Couldn't post comment") } );
      e.target.reset();
      }
    } 
  },
  beforeCreate () {
    if (!sessionStorage.userToken) {
      router.push('/login');
    }else {
      store.dispatch('getToken');
    }
  },
  created () {
    this.getPosts();
    this.getComments();
  }
}
</script>

<style lang="scss">

  .more_coms {
    width: 100%;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    margin-bottom: 1em;
    margin: 0;
    user-select: none;
    color: #000;
  }

// Style du formulaire d'envoi de commentaire
  .send_comment {
    margin: auto;
    display: flex;
    width: 95%;
    flex-direction: column;
    align-items: center;
    border-radius: 0.2em;
    padding: 0.2em 0.5em 0.5em 0em;
    align-items: center;
    background-color: #fff;
    
      @media (min-width: 1136px) {
        width: 60%;
      }
  }


  #post {
    background-color: #fff; 
    align-self: center;
    margin: 0em auto;
    padding: 1em;
      @media (min-width: 811px) {
      width: 80%;
      border-radius: 0.5em;
    }

  }

  .comments-post{
    background-color: #fff;
    padding: 1em;
    margin: auto;
    border-bottom: 1px solid black;
    
  }

  .comment-card {
    margin: auto;
    color: #000;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1em;
    border-bottom: 1px solid black;
    width: 90%;
    

    
    &__infos {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0em 0.5em;
    margin-bottom: 1em;

      @media (max-width: 810px) {
        justify-content: center;
      }

      span:nth-child(2){
        flex: 1;
      }
      span:nth-child(3){
        margin-right: 1em;
      }
    }

    &__message {
      padding: 0em 1.5em;
      display:flex;
      flex-direction: column;
      font-size: 1.1em;

      &-img {
      width: 80%;
      max-height: 30vh;
      align-self: center;
      }
      
      img{
      width: 100%;
      height: 100%;
      object-fit: contain;
      }

      a{
        color: #1327e6;
        &:hover{
          color: #1327e6
        }
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

</style>




