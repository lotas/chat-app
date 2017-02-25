import Vue from 'vue'
import * as sinon from 'sinon'

require('es6-promise').polyfill()
import 'isomorphic-fetch'
import fetchMock from 'fetch-mock'

import { getRenderedComponent, jsonError, jsonOk } from './utils'

import * as api from 'src/api'
import sharedStore, { MESSAGE_STATUS_DELIVERED } from 'src/store'

describe('store', () => {

  var sandbox;
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
  })

  afterEach(function () {
    sandbox.restore()

    sharedStore.state.messages = {}
    sharedStore.state.counts = {}
  })

  it('should provide state', () => {
    expect(sharedStore.state).to.have.property('user')
    expect(sharedStore.state).to.have.property('users')
    expect(sharedStore.state).to.have.property('messages')
    expect(sharedStore.state).to.have.property('counts')
  })

  it('setUser() should save user to storage', () => {
    sandbox.stub(api, 'setToStorage').returns(true)

    const user = {name: 'yarik'}

    expect(sharedStore.state.user).to.equal(null)
    sharedStore.setUser(user)
    expect(sharedStore.state.user).to.equal(user)
    expect(api.setToStorage).to.have.been.calledWith('auth.user', user)
  })

  it('should appendMessage()', () => {
    expect(sharedStore.appendMessage).to.be.a('function')

    sharedStore.appendMessage('user1', 'msg1')
    expect(sharedStore.state.messages).to.have.property('user1')
    expect(sharedStore.state.messages['user1'][0]).to.equal('msg1')
  })

  it('should updateMessageStatus()', () => {
    sharedStore.appendMessage('user2', {
      id: '123',
      status: 0,
      text: 'test'
    })

    sharedStore.updateMessageStatus('user2', '123', 2)
    expect(sharedStore.state.messages['user2'][0].status).to.equal(2)
  })

  describe('should dispatchApiMsg()', () => {
    const ws = {
      sendMsg: sinon.stub().returns(true)
    }

    it('ChatMessage', () => {
      sandbox.stub(sharedStore, 'appendMessage').returns(true)

      let msg = {
        id: 1,
        from: 'me',
        to: 'you',
        status: 0
      }

      sharedStore.dispatchApiMsg({
        type: 'ChatMessage',
        payload: { msg }
      }, ws)

      expect(sharedStore.appendMessage).to.have.been.calledWith('me', msg)
      expect(ws.sendMsg).to.have.been.calledWith({
        type: 'MessageAck',
        messageId: 1,
        from: 'me',
        to: 'you'
      })
    })

    it('MessageDelivered', () => {
      sandbox.stub(sharedStore, 'updateMessageStatus').returns(true)

      sharedStore.dispatchApiMsg({
        type: 'MessageDelivered',
        payload: {
          to: 'me',
          messageId: 3
        }
      }, ws)

      expect(sharedStore.updateMessageStatus).to.have.been.calledWith(
        'me', 3, MESSAGE_STATUS_DELIVERED
      )
    })

    it('UserListChange', () => {
        sharedStore.state.users = []

        sharedStore.dispatchApiMsg({
          type: 'UserListChange',
          payload: {
            users: 'new users'
          }
        })

        expect(sharedStore.state.users).to.equal('new users')
    })

  })

})

