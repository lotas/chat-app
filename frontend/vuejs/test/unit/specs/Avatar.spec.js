import Vue from 'vue'
import Avatar from 'src/components/Avatar'

import { getRenderedText } from './utils'

describe('Avatar.vue', () => {
  it('should render avatar', () => {
    const Constructor = Vue.extend(Avatar)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.avatar .icon').textContent.trim()).to.equal('');
  })

  // Inspect the component instance on mount
  it('correctly sets initials when created', () => {
    const vm = new Vue(Avatar).$mount()
    expect(vm.initials).to.equal('');
  })

  it('renders initials with different props', () => {
    expect(getRenderedText(Avatar, {
      userName: 'Yarik'
    })).to.equal('Y');

    expect(getRenderedText(Avatar, {
      userName: 'Twin Peaks'
    })).to.equal('TP')
  })

})
