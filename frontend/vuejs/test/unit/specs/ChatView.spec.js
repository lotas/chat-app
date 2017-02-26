import Vue from 'vue'
import * as sinon from 'sinon';

require('es6-promise').polyfill()
import 'isomorphic-fetch'
import fetchMock from 'fetch-mock'

import { getRenderedWithRouterComponent } from './utils'
import ChatView from 'src/components/ChatView'

import * as api from 'src/api'
import sharedStore from 'src/store'

describe('ChatView.vue', () => {

  var sandbox;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    sharedStore.setUser(null)
    fetchMock.setImplementations({
      Promise: require('es6-promise').Promise
    })
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should render title', () => {
    const vm = getRenderedWithRouterComponent(ChatView);
    expect(vm.$el.querySelector('.users-pane .panel-heading').textContent)
      .to.match(/Users/)
  })

  it('has default data', () => {
    expect(ChatView.data).to.be.a('function');

    const defaultData = ChatView.data()
    expect(defaultData.msgInput).to.equal('')
    expect(defaultData.shared).to.be.a('object')
  });

  it('fetch users and subscribe to socket', (done) => {
    fetchMock.get(`http://${window.location.host}/users`, {
      status: 200,
      body: '["one", "two"]',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    sandbox.stub(api, 'connectWs').returns(true)
    sharedStore.setUser({authToken: 'auth'})

    const vm = getRenderedWithRouterComponent(ChatView, {
      recepient: 'me'
    })

    // .$nextTick() doesn't wait long enough :-/
    setTimeout(() => {
      expect(vm.shared.users).to.include('one')
      expect(vm.shared.users).to.include('two')
      expect(api.connectWs).to.have.been.calledWith('auth')
      done()
    }, 1)
  })

  it('should sendMessage()', done => {
    const msg = {id: '123', to: 'me'}

    fetchMock.post(`http://${window.location.host}/message`, {
      status: 200,
      body: JSON.stringify(msg),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    sharedStore.setUser({authToken: 'auth'})
    sandbox.stub(api, 'sendMessageTo').returns(Promise.resolve({
      data: msg,
      status: 200
    }))

    const vm = getRenderedWithRouterComponent(ChatView, {
      recepient: 'me'
    })
    vm.msgInput = 'msg'
    vm.sendMessage()

    vm.$nextTick(() => {
      expect(api.sendMessageTo).to.have.been.calledWith('me', 'msg', 'auth')
      done()
    })
  })

  it('onMsgResponse()', done => {
    const res = {
      data: {id: '123', to: 'me'},
      status: 200
    }

    sandbox.stub(sharedStore, 'appendMessage').returns(true)
    const vm = getRenderedWithRouterComponent(ChatView, {
      recepient: 'me'
    })

    vm.msgInput = 'trash'
    vm.onMsgResponse(res)
    vm.$nextTick(() => {
      expect(sharedStore.appendMessage).to.have.been.calledWith('me', res.data)
      expect(vm.msgInput).to.equal('')
      done()
    })
  })

})
