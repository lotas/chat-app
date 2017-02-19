import Vue from 'vue'
import Router from 'vue-router'

import Dashboard from 'components/Dashboard'
import Register from 'components/Register'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  }, {
    path: '/register',
    name: 'Register',
    component: Register
  }]
})
