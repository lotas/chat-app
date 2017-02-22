import { getFromStorage, setToStorage } from './api'

const sharedStore = {
  state: {
    user: getFromStorage('auth.user', null)
  },
  setUser(user) {
    this.state.user = user
    setToStorage('auth.user', user)
  }
}

export default sharedStore
