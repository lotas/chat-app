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
    name: 'dashboard',
    component: Dashboard
  }, {
    path: '/register',
    name: 'register',
    component: Register
  }, {
    path: '/unregister',
    name: 'unregister',
    component: Unregister
  }, {
    path: '/chat',
    name: 'chat',
    component: ChatView,
  }, {
    path: '/chat/:recepient',
    name: 'chatview',
    component: ChatView,
    props: true
  }]
})
