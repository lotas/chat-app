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

  export default {
    name: 'register',
    data: function () {
      return {
        regUserName: '',
        error: null
      }
    },
    methods: {
      register() {
        if (!this.regUserName) {
          return Promise.reject('no username')
        }

        const errHandler = (err, status) => this.error = err;

        return api.registerUser(this.regUserName)
          .then(res => {
            sharedStore.setUser(res.data)
            this.navigateTo({name: 'chat'})
          }, errHandler)
          .catch(errHandler)
      },
      navigateTo(opts) {
        this.$router.push(opts)
      }
    }
  }

</script>

<style scoped>

</style>