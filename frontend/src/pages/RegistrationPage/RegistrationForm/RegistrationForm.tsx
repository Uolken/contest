import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import authService from "../../../api/services/authService"
import sessionInfo from "../../../store/sessionInfo"
import styles from "../../LoginPage/LoginForm/LoginForm.module.css"
import { validateEmail } from "../../../utils"

const RegistrationForm = observer(() => {
    const [email, setEmail] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [checkPassword, setCheckPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState<string | undefined>()

    const register = () => {
      setErrorMessage(undefined)
      if (!email || !firstName || !lastName || !password || ! checkPassword) return
      if (password != checkPassword) {
        setErrorMessage("Пароли не совпадают")
        return
      }
      authService.register(email, firstName, lastName, password)
      .then((response) => sessionInfo.updateSessionInfo(response))
      .catch((reason) => {
        setErrorMessage("Email уже занят")
      })
    }

    return <div className={styles.loginColumn}>
      <form className={styles.registrationForm} onSubmit={e => {
        e.preventDefault()
        register()
      }}>
        <h1 className={styles.header}>Контест СГТУ</h1>
        <div className={styles.form}>
          <label className={styles.field}>
            <div className={styles.labelText}>Почта</div>
            <input
              className={styles.input}
              type="text"
              name="login"
              value={email}
              onChange={(l) => setEmail(l.target.value)}
            />
          </label>
          <div className={styles.formsRow}>
            <label className={styles.field}>
              <div className={styles.labelText}>Фамилия</div>
              <input
                className={styles.input}
                type="text"
                name="password"
                value={lastName}
                onChange={(p) => setLastName(p.target.value)}
              />
            </label>
            <label className={styles.field}>

              <div className={styles.labelText}>Имя</div>
              <input
                className={styles.input}
                type="text"
                name="password"
                value={firstName}
                onChange={(p) => setFirstName(p.target.value)}
              />
            </label>
          </div>
          <div className={styles.formsRow}>
            <label className={styles.field}>
              <div className={styles.labelText}>Пароль</div>
              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={(p) => setPassword(p.target.value)}
              />
            </label>
            <label className={styles.field}>

              <div className={styles.labelText}>Пароль еще раз</div>
              <input
                className={styles.input}
                type="password"
                value={checkPassword}
                onChange={(p) => setCheckPassword(p.target.value)}
              />
            </label>
          </div>
          {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
          {/*<div hidden={!errorMessage}>ошибка</div>*/}
          <input className={styles.submitButton} type={"submit"} value="Зарегистрироваться"
                 />
        </div>
        <Link to="/auth">Войти</Link>
      </form>

    </div>
  }
)

export default RegistrationForm
