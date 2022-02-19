import { makeAutoObservable } from 'mobx'
import { FormEvent } from 'react'
import authService from '../../api/services/authService'
import sessionInfo from '../sessionInfo'

class LoginForm {
  email = 'login'

  password = 'test'

  showError = false

  constructor() {
    makeAutoObservable(this)
  }

  changeLogin(newEmail: string) {
    this.email = newEmail
  }

  changePassword(newPassword: string) {
    this.password = newPassword
  }

  setShowError(showError: boolean) {
    this.showError = showError
  }

  submit(e: FormEvent) {
    e.preventDefault()
    this.loginUser()
  }

  private loginUser() {
    authService.login(this.email, this.password)
    .then((response) => sessionInfo.updateSessionInfo(response))
    .catch((reason) => {
      console.log(reason)
      this.setShowError(true)
    })
  }
}

export default new LoginForm()
