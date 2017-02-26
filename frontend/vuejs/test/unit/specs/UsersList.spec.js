import Vue from 'vue'
import UsersList from 'src/components/UsersList'

import { getRenderedWithRouterComponent } from './utils'

describe('UsersList.vue', () => {

  it('should render list', () => {
    const vm = getRenderedWithRouterComponent(UsersList, {
      recepient: 'me',
      users: ['me', 'he', 'she']
    })

    expect(vm.$el.querySelectorAll('.list-group-item').length).to.equal(3);
  })

  it('should mark isActive', (done) => {
    const vm = getRenderedWithRouterComponent(UsersList, {
      recepient: 'me',
      users: []
    })

    vm.$nextTick(() => {
      expect(vm.isActive('me')).to.equal(true);
      expect(vm.isActive('not-me')).to.equal(false);
      done()
    })
  })

})
