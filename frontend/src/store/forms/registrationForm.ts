import { makeAutoObservable } from 'mobx'
import { FormEvent } from 'react'
import authService from '../../api/services/authService'
import sessionInfo from '../sessionInfo'

class RegistrationForm {
  email = 'email@email.com'

  password = 'test'

  confirmPassword = 'test'

  error = false

  constructor() {
    makeAutoObservable(this)
  }

  changeEmail(newEmail: string) {
    this.email = newEmail
  }

  changePassword(newPassword: string) {
    this.password = newPassword
  }

  changeConfirmPassword(newConfirmPassword: string) {
    this.confirmPassword = newConfirmPassword
  }

  submit(e: FormEvent) {
    e.preventDefault()
    this.registerUser()
  }

  private registerUser() {
    authService.register(this.email, "", "", this.password)
      .then((response) => sessionInfo.updateSessionInfo(response))
      .catch((reason) => { console.log(reason); this.error = true })
  }
}

export default new RegistrationForm()
