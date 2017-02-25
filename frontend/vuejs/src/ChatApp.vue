<template>
  <div class="container">
    <h1>Chat App</h1>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  props: ['user'],
  name: 'chatApp'
}

</script>

<style>
#chatApp {

}
</style>
