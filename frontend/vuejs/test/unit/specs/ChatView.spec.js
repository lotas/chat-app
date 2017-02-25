import Vue from 'vue'
import * as sinon from 'sinon';
// const sinon = require('sinon');

import { getRenderedComponent } from './utils'
import ChatView from 'src/components/ChatView'

import * as api from 'src/api'
import sharedStore from 'src/store'

describe('ChatView.vue', () => {

  var sandbox;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    sharedStore.setUser(null)
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should render title', () => {
    const vm = getRenderedComponent(ChatView);
    expect(vm.$el.querySelector('.users-pane .panel-heading').textContent)
      .to.match(/Users/)
  })

  it('has default data', () => {
    expect(ChatView.data).to.be.a('function');

    const defaultData = ChatView.data()
    expect(defaultData.regUserName).to.equal('')
  });

  // it('has ChatView function', () => {
  //   expect(ChatView.methods.ChatView).to.be.a('function')
  // })

  // it('submits form and calls api successfuly', done => {
  //   sandbox.stub(api, "ChatViewUser")
  //     .returns(Promise.resolve({ name: 'test' }))

  //   sandbox.stub(sharedStore, 'setUser')

  //   const vm = new Vue(ChatView).$mount()
  //   vm.regUserName = 'alice'

  //   vm.ChatView().then(() => {
  //     expect(api.ChatViewUser).to.have.been.calledWith('alice');
  //     expect(sharedStore.setUser).to.have.been.calledWith({name: 'test'});
  //     done();
  //   }).catch(done);
  // })

  // it('submits form and calls api fails', done => {
  //   sandbox.stub(api, "ChatViewUser")
  //     .returns(Promise.resolve({
  //       ok: false,
  //       text: () => Promise.resolve({ name: 'test' })
  //     }));

  //   const vm = new Vue(ChatView).$mount()
  //   vm.regUserName = 'bob'

  //   vm.ChatView().then(() => {
  //     expect(api.ChatViewUser).to.have.been.calledWith('bob');
  //     done();
  //   }).catch(done);
  // })

  // it('should submit on click', done => {
  //   sandbox.stub(api, "ChatViewUser")
  //     .returns(Promise.resolve());

  //   const vm = new Vue(ChatView).$mount()
  //   vm.regUserName = '123';

  //   vm.$el.querySelector('.btn').click()
  //   Vue.nextTick(() => {
  //     expect(api.ChatViewUser).to.have.been.calledWith('123')
  //     done()
  //   })

  // })

})
