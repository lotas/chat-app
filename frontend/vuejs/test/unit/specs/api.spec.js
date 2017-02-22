

import Vue from 'vue'
import * as sinon from 'sinon'

require('es6-promise').polyfill()
import 'isomorphic-fetch'
import fetchMock from 'fetch-mock'

import { getRenderedComponent, jsonError, jsonOk } from './utils'

import * as api from 'src/api'
import sharedStore from 'src/store'


describe('api', () => {

  var sandbox;
  beforeEach(function () {
    sandbox = sinon.sandbox.create()

    fetchMock.setImplementations({
      Promise: require('es6-promise').Promise
    })
  })

  afterEach(function () {
    sandbox.restore();
    fetchMock.restore()
  })


  it('store: should save user to storage', () => {
    sinon.stub(api, 'setToStorage').returns(true)

    const user = {name: 'yarik'}

    expect(sharedStore.state.user).to.equal(null)
    sharedStore.setUser(user)
    expect(sharedStore.state.user).to.equal(user)
    expect(api.setToStorage).to.have.been.calledWith('auth.user', user)
  })

  it('should makeApiCall()', done => {
    fetchMock.post('*', {
      body: '{"field": "value"}',
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    api.makeApiCall('url', {method: 'POST'})
      .then(res => {
        expect(res.data).to.have.property('field', 'value')
        expect(res.status).to.equal(200)
        done()
      }, done)
      .catch(done)
  })

  it('should fail makeApiCall()', done => {
    fetchMock.get('*', {
      body: 'err',
      status: 404
    })

    api.makeApiCall('url')
      .then(done, res => {
        expect(res.data).to.equal('err')
        expect(res.status).to.equal(404)
        done()
      })
      .catch(done)
  })

  it('should call registerUser()', done => {
    fetchMock.post('*', {
      status: 200,
      body: 'response'
    });

    api.registerUser('test1').then(res => {
      expect(res.data).to.equal('response')
      expect(res.status).to.equal(200)
      done()
    }, done).catch(done)

  })

})

