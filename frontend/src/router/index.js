import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import LogIn from '../views/LogIn.vue'
import Signup from '../views/Signup.vue'
import Post from '../views/Post.vue'
import Account from '../views/Account.vue'
import User from '../views/User.vue'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: LogIn
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/post',
    name: 'Post',
    component: Post
  },
  {
    path: '/account',
    name: 'Account',
    component: Account
  },
  {
    path: '/user',
    name: 'User',
    component: User
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
