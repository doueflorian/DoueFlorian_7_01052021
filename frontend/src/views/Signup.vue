<template>
 <div  id="signup">
   <form class="signup_form" @submit.prevent="signup">
    <h1>Sign up</h1>
        <label>Email</label><br/>
        <input required type="email" name="email" placeholder="Email"/><br/>
        <label>Password</label><br/>
        <input required type="password" name="password" placeholder="Mot de Passe"/><br/>
        <label>Nom</label><br/>
        <input required type="text" name="last_name" placeholder="Nom"/><br/>
        <label>Prénom</label><br/>
        <input required type="text" name="first_name" placeholder="Prénom"/><br/>
        <label>Date de naissance (non obligatoire)</label><br/>
        <input name="date_of_birth" type="date" value=""><br/>
        <label>Poste dans l'entreprise (non obligatoire)</label><br/>
        <input type="text" name="occupation" placeholder="Poste dans l'entreprise"><br/>
      <label class="file_upload">Ajouter une photo de profil <i class="far fa-file-image"></i><br />
       (format jpg ou png)
        <input @change="onFileChange" type="file" data-name="account_image" class="hide" name="file" accept="image/*">
      </label>
      <div class="preview" v-if="previewUrl">
        <img class="img-user" :src="previewUrl" /><br />
        <span  @click="deleteImg" :data-id="id" class="preview_delete"> Supprimer </span>
      </div>
      <hr />
     <button data-name="submit" type="submit">Sign Up</button>
     <span class="signup_error"> {{ error }} </span>
   </form>
 </div>
</template>

<script>
import router from '../router'

export default {
  name: 'Signup',
  data () {
    return {
        previewUrl: null,
        error: null
    }
  },
  methods: {
    deleteImg() {
      document.querySelector(`[data-name="account_image"]`).value = "";
      this.previewUrl = null;
    },
    onFileChange(e) {
      const file = e.target.files[0];
      this.previewUrl = URL.createObjectURL(file);
    },
    signup: function(e) {
    let formData = new FormData();
    let userData = {};

      if(e.target.date_of_birth.value == "" && e.target.occupation.value == ""){
        userData = {
          email: e.target.email.value,
          password: e.target.password.value,
          last_name: e.target.last_name.value.toUpperCase(),
          first_name: e.target.first_name.value,
          date_of_birth: null,
          occupation: null
        };
      }else if(e.target.date_of_birth.value == ""){
        userData = {
          email: e.target.email.value,
          password: e.target.password.value,
          last_name: e.target.last_name.value,
          first_name: e.target.first_name.value,
          date_of_birth: null,
          occupation: e.target.occupation.value
        };
      }else if(e.target.occupation.value == ""){
        userData = {
          email: e.target.email.value,
          password: e.target.password.value,
          last_name: e.target.last_name.value,
          first_name: e.target.first_name.value,
          date_of_birth: e.target.date_of_birth.value,
          occupation: null
        };
      }else{
        userData = {
          email: e.target.email.value,
          password: e.target.password.value,
          last_name: e.target.last_name.value,
          first_name: e.target.first_name.value,
          date_of_birth: e.target.date_of_birth.value,
          occupation: e.target.occupation.value
        };
      }
        
      const User = JSON.stringify(userData);
      
        formData.append("User", User);

        if (e.target.file.files[0]){
            formData.append("image", e.target.file.files[0], e.target.file.files[0].name );
        }
      
        if (e.target.file.files[0] && !e.target.file.files[0].name.match(/.(jpg|jpeg|png)$/i)) {
            alert(`Format ${e.target.file.files[0].type} non accepté`);
        }else {
          
          fetch("http://localhost:3000/api/users/signup", {
            method: 'POST',
            body: formData
                })
            .then( (response) => {
                if(response.ok) {
                  return response.json();
                }else{
                  throw 'Utilisateur déjà enregistré'
                }
              })
            .then( function(){
                fetch("http://localhost:3000/api/users/login", {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                          email: e.target.email.value,
                          password: e.target.password.value
                        })
                  } )
                .then( (response) => {
                  if(response.ok) {
                    return response.json();
                  }else{
                    throw 'Erreur lors de la connexion'
                  }
                })
                .then( function(response) { 
                  sessionStorage.removeItem('userToken');
                  sessionStorage.setItem('userToken', response.token);
                  router.push('/');
                })
                .catch((error) => this.error = error)
            } )
            .catch((error) => this.error = error)
        }
            
      }
  }
}
</script>

<style lang="scss">
  .signup_error{
    margin-left: 1em;
    font-size : 1.2em;
    // color: red;
  } 

  .signup_form{
    @media (max-width: 810px) {
      width: 80%;
      margin: auto;
    }
  }
</style>