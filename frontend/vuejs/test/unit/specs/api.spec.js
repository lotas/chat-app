import Vue from 'vue'
import * as sinon from 'sinon'

require('es6-promise').polyfill()
import 'isomorphic-fetch'
import fetchMock from 'fetch-mock'

import { getRenderedComponent, jsonError, jsonOk } from './utils'

import * as api from 'src/api'


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
    fetchMock.post(`http://${window.location.host}/user`, {
      status: 200,
      body: 'response'
    });

    api.registerUser('test1').then(res => {
      expect(res.data).to.equal('response')
      expect(res.status).to.equal(200)
      done()
    }, done).catch(done)
  })

  it('should call unregisterUser()', done => {
    fetchMock.delete(`http://${window.location.host}/user`, {
      status: 200,
      body: 'response'
    });

    api.unregisterUser('token').then(res => {
      expect(res.data).to.equal('response')
      expect(res.status).to.equal(200)
      done()
    }, done).catch(done)
  })

  it('should call fetchUsersList()', done => {
    fetchMock.get(`http://${window.location.host}/users`, {
      status: 200,
      body: '[]'
    });

    api.fetchUsersList().then(res => {
      expect(res.data).to.equal('[]')
      expect(res.status).to.equal(200)
      done()
    }, done).catch(done)
  })

  it('should call sendMessageTo()', done => {
    fetchMock.post(`http://${window.location.host}/message`, {
      status: 200,
      body: '[]'
    });

    api.sendMessageTo('to', 'text', 'token').then(res => {
      expect(res.data).to.equal('[]')
      expect(res.status).to.equal(200)
      done()
    }, done).catch(done)
  })

  it('should getStorag()', () => {
    expect(api.getStorage).to.be.a('function')
    expect(api.getStorage()).to.be.defined
  })

  it('should setToStorage() and getFromStorage()', () => {
    expect(api.getFromStorage).to.be.a('function')
    expect(api.setToStorage).to.be.a('function')

    sandbox.stub(api, 'getStorage').returns({})

    expect(api.getFromStorage('test.key', null)).to.be.null
    api.setToStorage('test.key', 'newvalue')
    expect(api.getFromStorage('test.key')).to.equal('newvalue')
  })

})

