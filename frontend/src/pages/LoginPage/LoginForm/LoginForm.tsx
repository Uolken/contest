import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import loginForm from '../../../store/forms/loginForm'
import styles from './LoginForm.module.css'
import authService from "../../../api/services/authService"
import sessionInfo from "../../../store/sessionInfo"

const LoginForm = observer(() => {
  const[email, setEmail] = useState("")
  const[password, setPassword] = useState("")
  const[errorMessage, setErrorMessage] = useState<string | undefined>()

  const login = () => {
    setErrorMessage(undefined)
    authService.login(email, password)
    .then((response) => sessionInfo.updateSessionInfo(response))
    .catch((reason) => {
      setErrorMessage("Неверный пароль")
    })
  }

  return <div className={styles.loginColumn}>
    <form className={styles.loginForm}  onSubmit={e => {
      e.preventDefault()
      login()
    }}>
      <h1 className={styles.header}>Контест СГТУ</h1>
      <div className={styles.form}>
        <label className={styles.field}>
          <div className={styles.labelText}>Логин</div>
          <input
            className={styles.input}
            type="text"
            name="login"
            value={email}
            onChange={(l) => setEmail(l.target.value)}
          />
        </label>
        <label className={styles.field}>
          <div className={styles.labelText}>Пароль</div>
          <input
            className={styles.input}
            type="password"
            name="password"
            value={password}
            onChange={(p) => setPassword(p.target.value)}
          />
        </label>
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
        {/*<div hidden={!errorMessage}>ошибка</div>*/}
        <input className={styles.submitButton} type={"submit"} value="Войти"/>
      </div>
      <Link to="/registration">Регистрация</Link>
    </form>

  </div>

})

export default LoginForm
