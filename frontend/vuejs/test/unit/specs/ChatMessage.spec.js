import Vue from 'vue'
import ChatMessage from 'src/components/ChatMessage'

import { getRenderedText, getRenderedComponent } from './utils'

describe('ChatMessage.vue', () => {
  it('should render ChatMessage', () => {
    const vm = getRenderedComponent(ChatMessage, {
      msg: {
        text: 'test123',
        sentAt: new Date(),
        from: 'user1',
        status: 0
      }
    });

    expect(vm.$el.querySelector('.text').textContent.trim()).to.equal('test123');
  })

  // // Inspect the component instance on mount
  // it('correctly sets initials when created', () => {
  //   const vm = new Vue(ChatMessage).$mount()
  //   expect(vm.initials).to.equal('');
  // })

  // it('renders initials with different props', () => {
  //   expect(getRenderedText(ChatMessage, {
  //     userName: 'Yarik'
  //   })).to.equal('Y');

  //   expect(getRenderedText(ChatMessage, {
  //     userName: 'Twin Peaks'
  //   })).to.equal('TP')
  // })

})
