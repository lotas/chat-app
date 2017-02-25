// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ChatApp from './ChatApp'
import router from './router'

import * as api from './api'
import sharedStore from './store'

import 'bootstrap/dist/css/bootstrap.css'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  data: {
    shared: sharedStore.state
  },
  template: '<ChatApp v-bind:user="shared.user" />',
  components: { ChatApp },
  created() {
    if (!this.shared.user) {
      router.push({name: 'register'})
    } else {
      router.push({name: 'chat'})
    }
  }
})
