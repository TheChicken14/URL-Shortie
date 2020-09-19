import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Account from '../views/Account.vue'
import store from '../store'

Vue.use(VueRouter)

const withAuth = async (to, from, next) => {
  if (store.state.loggedIn) {
    next()
  } else if (store.state.loadingLoggedInStatus) {
    await store.dispatch("checkToken")
    if (!store.state.loggedIn) {
      next({ name: 'Login' })
    } else next()
  } else {
    next({ name: 'Login' })
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: "Login",
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: withAuth
  },
  {
    path: '/account',
    name: "Account",
    component: Account,
    beforeEnter: withAuth
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
