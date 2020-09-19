import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loggedIn: false,
    loadingLoggedInStatus: true,
    loadingLinks: true,
    links: [],
    linkStats: {}
  },
  mutations: {
    SET_LOGGEDIN(state, loggedIn) {
      state.loggedIn = loggedIn;
      state.loadingLoggedInStatus = false
    },
    SET_LINKS(state, links) {
      state.links = links
      state.loadingLinks = false
    },
    SAVE_LINK_STAT(state, stats) {
      state.linkStats[stats.shortCode] = stats
    }
  },
  actions: {
    checkToken(state) {
      return new Promise(r => {
        axios.get("/api/user/checkToken")
          .then(() => state.commit("SET_LOGGEDIN", true))
          .catch(() => state.commit("SET_LOGGEDIN", false))
          .finally(() => r())
      })
    },
    getLinks(state) {
      axios.get("/api/links/all")
        .then(res => state.commit("SET_LINKS", res.data))
        .catch(err => {
          if (err.response.status === 401 || err.response.status === 403) {
            state.commit("SET_LOGGEDIN", false)
          }
        })
    },
    loadLinkStats(state, link) {
      return new Promise((res, rej) => {
        axios.get(`/api/links/stats/${link.shortCode}`)
          .then(r => {
            state.commit("SAVE_LINK_STAT", r.data)
            res()
          })
          .catch(() => rej("Error!"))
      })
    }
  },
  getters: {
    sortedLinks(state) {
      return state.loadingLinks ? [] : state.links.reverse()
    }
  },
  modules: {
  }
})
