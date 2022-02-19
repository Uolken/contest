import React from 'react'
import { observer } from 'mobx-react-lite'
import RegistrationForm from './RegistrationForm/RegistrationForm'
import TwoColumnsWithLogo from '../../layouts/TwoColumnsWithLogo/TwoColumnsWithLogo'

const RegistrationPage = observer(() => (
  <TwoColumnsWithLogo>
    <RegistrationForm />
  </TwoColumnsWithLogo>
))

export default RegistrationPage
