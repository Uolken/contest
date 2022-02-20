import BreadCrumbs from "../../../components/BreadCrumbs/BreadCrumbs"
import Button from "../../../components/Button/Button"
import styles from './SettingsPage.module.css'
import { useState } from "react"
import ErrorPopup from "../../../components/ErrorPopup/ErrorPopup"
import graphQLApi, { Query } from "../../../api/graphQLApi"
import { ResetPasswordRequestInput } from "../../../types"

const RESET_PASSWORD: Query<{ resetPasswordRequest: ResetPasswordRequestInput }, {}> = {
  query: `
mutation resetPassword($resetPasswordRequest: ResetPasswordRequestInput!) {
  resetPassword(resetPasswordRequest: $resetPasswordRequest) {
    id
  }
}
`
}

const SettingsPage = () => {
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [checkNewPassword, setCheckNewPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  return <div className="page">
    <BreadCrumbs elements={[{
      name: "Настройки",
      url: "/settings"
    }]}/>
    <h1>Настройки</h1>
    <div className={styles.settingsBlock}>
      <h2>Смена пароля</h2>
      <label className={styles.input}>
        <span>Текущий пароль:</span>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
      </label>
      <label className={styles.input}>
        <span>Новый пароль:</span>
        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}/>
      </label>
      <label className={styles.input}>
        <span>Новый пароль еще раз:</span>
        <input type="password" value={checkNewPassword}
               onChange={e => setCheckNewPassword(e.target.value)}/>
      </label>
      <Button text={"Сменить пароль"} action={() => {
        if (newPassword != checkNewPassword) {
          setErrorMessage("Пароли не совпадают")
          return
        }
        graphQLApi(RESET_PASSWORD, { resetPasswordRequest: {password, newPassword} })
        .then(() => window.location.reload())
        .catch(() => {
          setErrorMessage("Введенный не верный пароль")
        })
        console.log(password, newPassword, checkNewPassword)
      }}/>
    </div>
    {errorMessage &&
        <ErrorPopup errorMessage={errorMessage} onClose={() => setErrorMessage(undefined)}/>}

  </div>
}

export default SettingsPage
