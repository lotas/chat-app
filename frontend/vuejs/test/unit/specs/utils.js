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
