import { getFromStorage } from './api'

const sharedStore = {
  state: {
    user: getFromStorage('auth.user', null)
  },
  setUser(user) {
    this.state.user = user
  }
}

export default sharedStore
