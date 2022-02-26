import graphQLApi from "../graphQLApi"
import { LOGIN, LOGOUT, REFRESH_TOKEN, REGISTRATION, WHO_AM_I } from "../mutations"
import { SessionResponse, UserInfo } from "../../types"

export class AuthService {

  login(email: string, password: string): Promise<SessionResponse> {
    return graphQLApi(LOGIN, {email, password})
      .then(response => response.sessionResponse)
  }

  logout() {
    return graphQLApi(LOGOUT, {})
  }

  register(email: string, firstName: string, lastName: string, password: string): Promise<SessionResponse> {
    return graphQLApi(REGISTRATION, { signUpRequest: {
        email,
        firstName,
        lastName,
        password
      }
    })
    .then(response => response.registration)
  }

  whoAmI(): Promise<UserInfo> {
    return graphQLApi(WHO_AM_I, {})
      .then(response => response.whoAmI)
  }

  refresh(): Promise<SessionResponse> {
    return graphQLApi(REFRESH_TOKEN, {})
    .then(response => response.refreshToken)
  }
}

export default new AuthService()
