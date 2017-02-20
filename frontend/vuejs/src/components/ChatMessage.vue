<template>
  <div class="chatMessage">
      <Avatar userName="msg.from" />
      <strong>{{msg.from}}</strong>&gt;
      <span class="text">{{msg.text}}</span>
      <span class="pull-right label label-default">
          {{status}}
      </span>
      <em class="pull-right date">
          {{date}}
      </em>
  </div>
</template>

<script>
import Avatar from './Avatar'

export default {
  name: 'chatMessage',
  components: {
    'Avatar': Avatar
  },
  props: ['msg'],
  computed: {
      date: function date() {
          return new Date(this.msg.sentAt).toLocaleString();
      },
      status: function status() {
          switch(this.msg.status) {
              case 0: return 'sent';
              case 1: return 'delivered';
              case 2: return 'offline';
              default: return '';
          }
      }
  }
}
</script>

<style scoped>

</style>
