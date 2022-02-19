import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import React from 'react'
import registrationForm from '../../../store/forms/registrationForm'

const RegistrationForm = observer(() => (
  <div>
    <h1>Регистрация СГТУ</h1>
    <form onSubmit={(e) => registrationForm.submit(e)}>
      <input type="text" name="email" value={registrationForm.email} onChange={(e) => registrationForm.changeEmail(e.target.value)} />
      <input type="password" name="password" value={registrationForm.password} onChange={(p) => registrationForm.changePassword(p.target.value)} />
      <input type="password" name="confirmPassword" value={registrationForm.confirmPassword} onChange={(cp) => registrationForm.changeConfirmPassword(cp.target.value)} />
      <input type="submit" />
      <div hidden={!registrationForm.error}>Error</div>
    </form>
    <Link to="/auth">Войти</Link>
  </div>
))

export default RegistrationForm
