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

  export default {
    name: 'register',
    data: function () {
      return {
        regUserName: ''
      }
    },
    methods: {
      register: function register() {
        return api.registerUser(this.regUserName)
          .then(res => {
            if (res.ok) {
              res.json().then(authUser => {
                // ChatApp.user = authUser;
                // setToStorage(STORAGE_USER, authUser);

                // debug(authUser);
                // window.ChatApi.connectWs(authUser.authToken, onSocketMsg);
                // window.ChatApi.fetchUsersList().then(renderUsers);
              });
            } else {
              res.text().then(data => {
                // debug('Register not ok: ', data);
              })
            }
          });
      }
    }
  }

</script>

<style scoped>

</style>