import Vue from 'vue'
import * as sinon from 'sinon';

import { getRenderedComponent } from './utils'
import Unregister from 'src/components/Unregister'

import * as api from 'src/api'
import sharedStore from 'src/store'

describe('Unregister.vue', () => {

  var sandbox;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    sharedStore.setUser(null)
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should render text', () => {
    const vm = getRenderedComponent(Unregister);
    expect(vm.$el.querySelector('.unregister h2').textContent)
      .to.equal('Good bye!')
  })

  it('has default data', () => {
    expect(Unregister.data).to.be.a('function')

    const defaultData = Unregister.data()
    expect(defaultData.error).to.be.null
  });

  it('calls unregisterUser', done => {
    expect(Unregister.created).to.be.a('function')

    sandbox.stub(api, "unregisterUser")
      .returns(Promise.resolve(true));

    sharedStore.setUser({
      authToken: 'testToken'
    })

    const vm = new Vue(Unregister).$mount()

    Vue.nextTick(() => {
      expect(api.unregisterUser).to.have.been.calledWith('testToken')
      done()
    });
  })

})
