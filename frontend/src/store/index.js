import { createStore } from 'vuex'
import jwt_Decode from "jwt-decode";


export default createStore({
  state: {
    token: null
  },
  mutations: {
    IS_ONLINE(state){
      state.token = jwt_Decode(sessionStorage.userToken);
    },
    IS_OFFLINE(state){
      state.token = null;
    }
  },
  actions: {
    getToken({ commit }) {
          commit('IS_ONLINE')
    },
    deleteToken({ commit }) {
          commit('IS_OFFLINE')
    }
  },
  modules: {
  }
})
