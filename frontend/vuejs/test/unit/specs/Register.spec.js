import Vue from 'vue'
import * as sinon from 'sinon';
// const sinon = require('sinon');

import { getRenderedComponent } from './utils'
import Register from 'src/components/Register'

import * as api from 'src/api'

describe('Register.vue', () => {

  var sandbox;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
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
        ok: true,
        json: () => Promise.resolve({ name: 'test' })
      }));

    const vm = new Vue(Register).$mount()
    vm.regUserName = 'alice'

    vm.register().then(() => {
      expect(api.registerUser).to.have.been.calledWith('alice');
      done();
    }).catch(done);
  })

  it('submits form and calls api fails', done => {
    sandbox.stub(api, "registerUser")
      .returns(Promise.resolve({
        ok: false,
        text: () => Promise.resolve({ name: 'test' })
      }));

    const vm = new Vue(Register).$mount()
    vm.regUserName = 'bob'

    vm.register().then(() => {
      expect(api.registerUser).to.have.been.calledWith('bob');
      done();
    }).catch(done);
  })

})
