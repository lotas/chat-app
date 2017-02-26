import Vue from 'vue'
import * as sinon from 'sinon';
// const sinon = require('sinon');

import { getRenderedComponent } from './utils'
import Register from 'src/components/Register'

import * as api from 'src/api'
import sharedStore from 'src/store'

describe('Register.vue', () => {

  var sandbox;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    sharedStore.setUser(null)
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should render title', () => {
    const vm = getRenderedComponent(Register);
    expect(vm.$el.querySelector('.register h2').textContent)
      .to.equal('Register')
  })

  it('has default data', () => {
    expect(Register.data).to.be.a('function');

    const defaultData = Register.data()
    expect(defaultData.regUserName).to.equal('')
  });

  it('has register function', () => {
    expect(Register.methods.register).to.be.a('function')
  })

  it('submits form and calls api successfuly', done => {
    sandbox.stub(api, "registerUser")
      .returns(Promise.resolve({
        status: 200,
        data: { name: 'test' }
      }))

    sandbox.stub(sharedStore, 'setUser')

    const vm = getRenderedComponent(Register)

    vm.regUserName = 'alice'
    sandbox.stub(vm, 'navigateTo').returns(true)

    vm.$nextTick(() => {
      vm.register().then(() => {
        expect(api.registerUser).to.have.been.calledWith('alice');
        expect(sharedStore.setUser).to.have.been.calledWith({name: 'test'});
        expect(vm.navigateTo).to.have.been.calledWith({name: 'chat'});
        done();
      }).catch(done);
    })
  })

  it('submits form and calls api fails', done => {
    sandbox.stub(api, "registerUser")
      .returns(Promise.resolve({
        status: 200,
        data: { name: 'test' }
      }));

    const vm = new Vue(Register).$mount()
    vm.regUserName = 'bob'

    vm.register().then(() => {
      expect(api.registerUser).to.have.been.calledWith('bob');
      done();
    }).catch(done);
  })

  it('should submit on click', done => {
    sandbox.stub(api, "registerUser")
      .returns(Promise.resolve());

    const vm = new Vue(Register).$mount()
    vm.regUserName = '123';

    vm.$el.querySelector('.btn').click()
    Vue.nextTick(() => {
      expect(api.registerUser).to.have.been.calledWith('123')
      done()
    })

  })

})
