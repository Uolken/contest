import React from 'react'
import './App.css'
import { Switch } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import sessionInfo from './store/sessionInfo'
import RegistrationPage from './pages/RegistrationPage/RegistrationPage'
import AuthorizedRoute from './routes/AuthorizedRoute'
import GuestRoute from './routes/GuestRoute'
import AuthorizedUserPages from './pages/AuthorizedUsersPages/AuthorizedUserPages'
import LoginPage from './pages/LoginPage/LoginPage'
import "@fontsource/inter";
import { Settings } from "luxon"
import Lab2 from "./csec/lab2/Lab2"
import Lab3 from "./csec/lab3/Lab3"
import Lab5 from "./csec/lab5/Lab5"
import Lab5Decode from "./csec/lab5/Lab5Decode"
import Lab4 from "./csec/lab4/Lab4"

const App = observer(() => {
  Settings.defaultLocale = "ru"
  return (
    <div>
      <Switch>
        {/*<GuestRoute path="/csec2" component={Lab2} />*/}
        {/*<GuestRoute path="/csec3" component={Lab3} />*/}
        {/*<GuestRoute path="/csec4" component={Lab4} />*/}
        {/*<GuestRoute path="/csec5" exact={true} component={Lab5} />*/}
        {/*<GuestRoute path="/csec5/decode" component={Lab5Decode} />*/}
        <GuestRoute path="/auth" component={LoginPage} />
        <GuestRoute path="/registration" component={RegistrationPage} />
        <AuthorizedRoute path="/*" component={AuthorizedUserPages} />
      </Switch>
    </div>
  )
})

export default App
