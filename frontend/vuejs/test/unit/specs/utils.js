import Vue from 'vue'

import router from 'src/router'

export function getRenderedText(Component, propsData) {
  const vm = getRenderedComponent(Component, propsData)
  return vm.$el.textContent.trim()
}

export function getRenderedComponent(Component, propsData) {
  const Ctor = Vue.extend(Component)
  const vm = new Ctor({ propsData }).$mount()
  return vm
}

export function getRenderedWithRouterComponent(Component, propsData) {
  const vm = new Vue({
    router,
    template: `<div><xComp v-bind="props"></xComp></div>`,
    data: {
      props: propsData
    },
    components: {
      xComp: Component
    }
  }).$mount()

  return vm.$children[0]  // component itself
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