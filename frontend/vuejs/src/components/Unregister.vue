<template>
  <div class="unregister">
    <h2>Good bye!</h2>
    <p class="error" v-show="error">{{error}}</p>
  </div>
</template>
<script>
  import * as api from '../api'
  import sharedStore from '../store'

  export default {
    name: 'unregister',
    data: function() {
      return {
        error: null,
        shared: sharedStore.state
      }
    },
    created() {
      if (this.shared.user) {
        api.unregisterUser(this.shared.user.authToken)
          .then(res => {
            sharedStore.setUser(null)
          }, err => {
            this.error = err
          })
          .catch(err => {
            this.error = err
          })
      }
    }
  }
</script>
<style scoped>
.error {
  color: red;
}
</style>