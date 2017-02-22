import Vue from 'vue'

export function getRenderedText(Component, propsData) {
  const vm = getRenderedComponent(Component, propsData)
  return vm.$el.textContent.trim()
}

export function getRenderedComponent(Component, propsData) {
  const Ctor = Vue.extend(Component)
  const vm = new Ctor({ propsData }).$mount()
  return vm
}

export function jsonOk(body) {
  var mockResponse = new window.Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-type': 'application/json'
    }
  });

  return new Promise.resolve(mockResponse);
}

export function jsonError(status, body) {
  var mockResponse = new window.Response(JSON.stringify(body), {
    status: status,
    headers: {
      'Content-type': 'application/json'
    }
  });

  return new Promise.reject(mockResponse);
}