  <template>
    <div id="app">
      <div id="nav">
        <router-link to="/"><img id="head_logo" alt="Groupomania logo" src="./assets/icon-left-font-monochrome-white.svg" /></router-link>
        
        <!-- Navigation entre les différentes vues -->
        <div id="nav__links">
        <!-- Ne pas montrer ces liens si utilisateur sur la page de login ou signin -->
          <router-link v-if="!isLogin && !isSignin" to="/"><i class="fas fa-home"></i></router-link>
          <router-link v-if="!isLogin && !isSignin" to="/account"><i class="fas fa-user"></i></router-link>
        </div>
        <!-- Liens utilisateurs -->
        <div id="nav__user-links">
        <!-- Ne pas montrer ces liens si utilisateur sur la page de login ou signin -->
          <button v-if="isLogin || isSignin"><router-link to="/login">Log In</router-link></button>
          <button v-if="isLogin || isSignin"><router-link to="/signup">Sign Up</router-link></button>
        <!-- montrer ce bouton lorsque l'utilisateur navigue hors des pages login et signin -->
          <button v-else @click="disconnectUser">Disconnect</button>
        </div>
      </div>

    <div class="view">
      <router-view>
      </router-view>
    </div>

      <footer>
        <p> All Right Reserved Groupomania 2021 </p>
        <!-- lien provisoire -->
        <a @click.prevent href='#'>Contact</a>

      </footer>
    </div>
  </template>

  <script>
import router from './router'
import store from './store'

export default {
  methods: {
    // Methode de déconnection
    // Supprime le token en local et dans le store, renvoi au login
    disconnectUser : function(e) {
      e.preventDefault();
      sessionStorage.removeItem('userToken');
      store.dispatch('deleteToken');
      router.push('/login');
    }
  },
  data(){
      return {
        }
  },
  computed: {
    // Données calculées afin de savoir sur quelle vue nous sommes
    // Au login et signin
    isLogin() {
      return this.$route.name === "Login"
    },
    isSignin() {
      return this.$route.name === "Signup"
    }
  }
}
  
</script>
  
<style lang="scss">
 
  body {
    background-color:#1f1f1f;
    margin: auto;
    overflow-x: hidden;
    color: #fff;
    
    @media (min-width: 811px) {
    width: 80%;
    }
  }

// css de la div principale
  #app {
     display: flex;
    flex-direction: column;
    min-height: 100vh;
// Que la vue prenne toujours la hauteur d'écran max
    .view {
      flex: 1;
    }
  }

  #head_logo {
    width: 15em;
  }

  #nav {
    padding-top: 2em;
    display : flex;
    justify-content: space-between;
    align-items: center;
      @media (max-width: 810px) {
        flex-direction: column;
        justify-content: center;
      }

    &__links  {
      display : flex;
      justify-content: space-between;
      flex-wrap: wrap;
      width: 6em;
              
      a {
        width: 20px;
        height: 20px;
        text-align: center;
        color: #fff;
        padding: 0.3em;

        &:hover{
          border-radius: 2em;
          background-color: #868686;
        }
      }
    }

    &__user-links {  

      button{
        margin-right: 0.2em;
        border: none;
        background: none;
        color: #fff;

          &:hover{
            text-decoration: underline;
          }
      }
           
      a {
        width: 20px;
        height: 20px;
        text-align: center;
        color: #fff;
        text-decoration: none;
        padding: 0.3em;
      }
    }
  }

  footer {
    padding-bottom: 1em;
    margin: auto;
    color: #fff;
    padding: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 40%;
    justify-content: space-between;

    @media (max-width: 1366px){
      flex-direction: column;
    }

      p {
        text-align: center;
      }

      a {        
      color: #fff;
      text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }

  }

  h1{
    margin-left: 1.4em;
    width: max-content;
    @media (max-width: 810px) {
      margin: 1em auto;
    }
  }

// Style de tous les formulaires d'envoi des vues
  .send_form {
    display: flex;
    align-items: center;
    width: 100%;
    line-height: 2em;

    .file {
        display:none;
    }

    .message {
        flex: 1;
        margin: auto;
        border: none;
        outline: none;
        resize: vertical;

    }

    .file_upload{
        cursor: pointer;
        margin-bottom: 1em;
        color: #000;
        margin: 0 1em;
    }

    .submit {
      background: none;
      border-radius: 0.5em;
      padding: 0.5em 0.2em;
      color: #000;
    }
  }

// Style des formulaires de mofications
  .modify_form {
    margin: auto;
    width: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 1em;
    padding: 1em;
    line-height: 1.5em;

    .file_upload{
      cursor: pointer;
      margin-bottom: 1em;
      margin: 0 1em;
    }

    .message_form {
      width: 100%;
      margin: auto;
      margin-bottom: 1em;
      border: 1px transparent black;
      border-radius: 0.4em;
      resize: none;
      outline: none;
    }

    .submit{
        width: 20%;
    }
  }

// Style des checkbox de tous les formulaires
  .checkbox_label{
    user-select: none;
    cursor: pointer;
  }


//  Style des previews d'image de tous les formulaires
  .preview {
    width: 8em;
    margin-top: 1em;
    position: relative;

    img{
      width: 100%;
      object-fit: contain;
    }

    // Bordures rondes pour la profile pic
    .img-user {
      border-radius: 10em;
    }

    &_delete {
      color: #fff;
    background-color: #000;
    user-select: none;
    cursor: pointer;
    position: absolute;
    bottom: 4px;
    right: 0;
    padding: 0.2em;
    
    }

  }

// Style des images d'utilisateur
  .profile_pic-post{
    border-radius: 10em;
    width: 2em;
    margin-right: 1em;
  }

  .profile_nopic-post{
    border-radius: 10em;
    font-size: 2em;
    margin-right: 0.5em;
  }

// Style des boutons de modération post/comm
  .user_control{
    button{
      background: none;
      border: none;
      padding: 0.5em;

      &:hover{
      background-color: #868686;
      border-radius: 1em;
      }
    }
  }
   
  .hide {
    display: none;
  }
  </style>
