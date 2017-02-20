import Vue from 'vue'
import Router from 'vue-router'

import Dashboard from 'components/Dashboard'
import ChatView from 'components/ChatView'
import Register from 'components/Register'
import Unregister from 'components/Unregister'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  }, {
    path: '/register',
    name: 'Register',
    component: Unregister
  }, {
    path: '/unregister',
    name: 'Quit chat',
    component: Unregister
  }, {
    path: '/chat/:recepient',
    name: 'Chat',
    component: ChatView,
    props: true
  }]
})
