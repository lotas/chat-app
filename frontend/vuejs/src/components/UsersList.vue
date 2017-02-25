<template>
  <ul class="list-group">
      <li class="list-group-item" v-for="user in users" v-bind:class="{active: isActive(user)}">
          <!--<span class="badge">{{user.cnt}}</span>-->
          <Avatar v-bind:userName="user" />
          <router-link :to="{ name: 'chatview', params: { recepient: user }}">{{ user }}</router-link>
      </li>
  </ul>
</template>

<script>
import Avatar from './Avatar'

export default {
  props: ['users', 'recepient'],
  name: 'usersList',
  components: {
    Avatar
  },
  methods: {
    isActive: (user) => this.recepient === user
  }
}

</script>
