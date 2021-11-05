<template>
 <div>
   <form class="login_form" @submit.prevent="login">
     <h1>Sign in</h1>
     <label>Email</label><br/>
     <input required v-model="email" type="text" placeholder="Your Email"/>
     <br />
     <label>Password</label><br/>
     <input required v-model="password" type="password" placeholder="Password"/>
     <hr/>
     <button type="submit">Login</button>
    <span class="login_error"> {{ error }} </span>
   </form>


 </div>
</template>

<script>
import router from '../router'

export default {
  name: 'LogIn',
  data() {
    return {
      error: null
    }
  },
  methods: {
      login: function () {

            fetch("http://localhost:3000/api/users/login", {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                      email: this.email,
                      password: this.password
                    })
              } )
            .then( (response) => {
              if(response.ok) {
                return response.json();
              }else if(response.status == 404){
                throw 'utilisateur non enregistré'
              }else{
                throw 'mot de passe incorrect'
              }
            })
            .then( function(response) { 
              sessionStorage.removeItem('userToken');
              sessionStorage.setItem('userToken', response.token);
              router.push('/');
             })
            .catch((error) => this.error = error)
      },
  }
}
</script>

<style lang="scss">
  .login_error{
    margin-left: 1em;
    font-size : 1.2em;
    // color: red;
  } 

  .login_form {
    @media (max-width: 810px) {
      width: 80%;
      margin: auto;
    }
    line-height: 1.5em;
  }
</style>