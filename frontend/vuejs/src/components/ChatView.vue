<template>
  <div class="chatView row">
    <div class="col-sm-3 panel panel-default users-pane">
      <div class="panel-heading">Users</div>
      <div class="panel-body" v-if="shared.users">
        <UsersList v-bind:users="shared.users" v-bind:recepient="recepient"></UsersList>
      </div>
    </div>
    <div class="col-sm-9">
      <div class="panel panel-default" v-if="recepient">
        <div class="panel-heading">{{ recepient }}</div>
        <div class="panel-body">
          <ul class="list-group" ref="msgList">
            <li v-for="msg in shared.messages[recepient]" class="list-group-item">
              <ChatMessage v-bind:msg="msg"></ChatMessage>
            </li>
          </ul>
          <form v-on:submit.prevent="sendMessage">
            <div class="input-group">
              <input class="form-control" type="text" v-model="msgInput" value="" placeholder="Message">
              <span class="input-group-btn">
                <input class="btn btn-small btn-success" type="submit" value="Send">
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as api from '../api'
  import sharedStore from '../store'
  import UsersList from './UsersList'
  import ChatMessage from './ChatMessage'

  export default {
    props: ['recepient'],
    name: 'chatView',
    components: {
      UsersList,
      ChatMessage
    },
    data() {
      return {
        shared: sharedStore.state,
        msgInput: ''
      }
    },
    created() {
      this.fetchUsersList()
      this.subscribeWebsocket()
    },
    methods: {
      fetchUsersList() {
        return api.fetchUsersList().then(res => {
          this.shared.users = res.data
        })
      },
      subscribeWebsocket() {
        let { user } = this.shared
        if (user && user.authToken) {
          api.connectWs(user.authToken, sharedStore.dispatchApiMsg);
        }
      },
      sendMessage() {
        let { user } = this.shared

        api.sendMessageTo(this.recepient, this.msgInput, user.authToken)
          .then(this.onMsgResponse).catch(err => {
            console.error(err)
          });
      },
      onMsgResponse(res) {
        const msg = res.data
        sharedStore.appendMessage(msg.to, msg);
        this.msgInput = '';
      }
    }
  }

</script>

<style scoped>

</style>