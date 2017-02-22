<template>
  <div class="register">
    <h2>Register</h2>
    <div>
      <form v-on:submit.prevent="register">
        <input type="text" v-model="regUserName" placeholder="username" />
        <input class="btn btn-primary" type="submit" value="Register" />
      </form>
    </div>
  </div>
</template>

<script>
  import * as api from '../api'
  import sharedStore from '../store'
  // import router from '../router'

  export default {
    name: 'register',
    data: function () {
      return {
        regUserName: '',
        error: null,
        shared: sharedStore.state
      }
    },
    methods: {
      register: function register() {
        if (!this.regUserName) {
          return false
        }

        const errHandler = (err, status) => this.error = err;

        return api.registerUser(this.regUserName)
          .then((user, status) => {
            sharedStore.setUser(user)

            this.$router.push('chatview')
          }, errHandler)
          .catch(errHandler)
      }
    }
  }

</script>

<style scoped>

</style>