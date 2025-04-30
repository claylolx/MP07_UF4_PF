import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    token: localStorage.getItem('token') || null
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    CLEAR_AUTH(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    }
  },
  actions: {
    async login({ commit }, credentials) {
      const response = await axios.post('/api/login', credentials)
      commit('SET_USER', response.data.user)
      commit('SET_TOKEN', response.data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
    },
    logout({ commit }) {
      commit('CLEAR_AUTH')
      delete axios.defaults.headers.common['Authorization']
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    isAdmin: state => state.user?.role === 'admin'
  }
})