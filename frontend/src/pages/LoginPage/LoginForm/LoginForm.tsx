import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import React from 'react'
import loginForm from '../../../store/forms/loginForm'
import styles from './LoginForm.module.css'

const LoginForm = observer(() => (
  <div className={styles.loginColumn}>
    <div className={styles.loginForm}>
      <h1 className={styles.header}>Контест СГТУ</h1>
      <form onSubmit={(e) => loginForm.submit(e)} className={styles.form}>
        <label className={styles.field}>
          <div className={styles.labelText}>Логин</div>
          <input
            className={styles.input}
            type="text"
            name="login"
            value={loginForm.email}
            onChange={(l) => loginForm.changeLogin(l.target.value)}
          />
        </label>
        <label className={styles.field}>
          <div className={styles.labelText}>Пароль</div>
          <input
            className={styles.input}
            type="text"
            name="password"
            value={loginForm.password}
            onChange={(p) => loginForm.changePassword(p.target.value)}
          />
        </label>
        <div hidden={!loginForm.showError}>ошибка</div>
        <input type="submit" className={styles.submitButton} value="Войти"/>
      </form>
      <Link to="/registration">Регистрация</Link>
    </div>

  </div>
))

export default LoginForm
