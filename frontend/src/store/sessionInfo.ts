import { makeAutoObservable } from 'mobx'
import { DateTime, Duration } from 'luxon'
import authService from '../api/services/authService'
import { SessionResponse, UserInfo, UserRole } from "../types"

class SessionInfo {
  private wrappedUserInfo: UserInfo | null = null

  private sessionExpirationDate: DateTime | null = null

  private refreshTokenExpirationDate: DateTime | null = null

  constructor() {
    const userInfoJson = localStorage.getItem('userInfo')
    const sessionExpirationDateJson = localStorage.getItem('sessionExpirationDate')
    const refreshTokenExpirationDateJson = localStorage.getItem('refreshTokenExpirationDate')

    this.wrappedUserInfo = userInfoJson != null ? JSON.parse(userInfoJson) : null
    this.sessionExpirationDate = SessionInfo.parseDateIfPresent(sessionExpirationDateJson)
    this.refreshTokenExpirationDate = SessionInfo.parseDateIfPresent(refreshTokenExpirationDateJson)

    this.addRefreshTokenTask()

    makeAutoObservable(this)
  }

  private static parseDateIfPresent(date: string | null) {
    return date != null ? DateTime.fromMillis(JSON.parse(date)) : null
  }

  isAuthorized() {
    return this.isRefreshTokenValid()
  }

  isTeacher() {
    return this.isAuthorized() && this.wrappedUserInfo?.role == UserRole.Teacher
  }

  isSessionValid(): boolean {
    return SessionInfo.isDatePresentAndNotExpired(this.sessionExpirationDate)
  }

  isRefreshTokenValid(): boolean {
    return SessionInfo.isDatePresentAndNotExpired(this.refreshTokenExpirationDate)
  }

  private static isDatePresentAndNotExpired(token: DateTime | null): boolean {
    return token != null && +token > +DateTime.now()
  }

  updateSessionInfo(sessionInfo: SessionResponse) {
    this.updateUserInfo(sessionInfo.userInfo)
    this.updateSessionExpirationDate(
      SessionInfo.newExpirationDate(sessionInfo.jwtExpirationPeriod),
    )
    this.updateRefreshTokenExpirationDate(
      SessionInfo.newExpirationDate(sessionInfo.jwtExpirationPeriod),
    )
    this.addRefreshTokenTask()
  }

  private static newExpirationDate(expirationInSeconds: number) {
    return DateTime.now().plus(Duration.fromMillis(1000 * expirationInSeconds))
  }

  private addRefreshTokenTask() {
    if (!this.isRefreshTokenValid()) {
      return
    }
    const millisecondsUntilExpiration = this.sessionExpirationDate!.diff(DateTime.now()).milliseconds
    setTimeout(() => {
      this.refreshToken()
    }, millisecondsUntilExpiration - 60000)
  }

  private refreshUser() {
    authService.whoAmI()
      .then((response) => { this.updateUserInfo(response) })
      .catch((response) => {
        console.error('Failed fetch of current user', response)
      })
  }

  private refreshToken() {
    authService.refresh()
      .then((response) => this.updateSessionInfo(response))
      .catch((response) => {
        console.error('Failed refresh token', response)
      })
  }

  private updateUserInfo(value: UserInfo | null) {
    if (value != null) {
      localStorage.setItem('userInfo', JSON.stringify(value))
    } else {
      localStorage.removeItem('userInfo')
    }
    this.wrappedUserInfo = value
  }

  private updateSessionExpirationDate(value: DateTime | null) {
    if (value != null) {
      localStorage.setItem('sessionExpirationDate', JSON.stringify(value.toMillis()))
    } else {
      localStorage.removeItem('sessionExpirationDate')
    }
    this.sessionExpirationDate = value
  }

  private updateRefreshTokenExpirationDate(value: DateTime | null) {
    if (value != null) {
      localStorage.setItem('refreshTokenExpirationDate', JSON.stringify(value.toMillis()))
    } else {
      localStorage.removeItem('refreshTokenExpirationDate')
    }
    this.refreshTokenExpirationDate = value
  }

  logout() {
    authService.logout().then(() => {
      this.clearSessionInfo()
    })
  }

  private clearSessionInfo() {
    this.updateUserInfo(null)
    this.updateSessionExpirationDate(null)
    this.updateRefreshTokenExpirationDate(null)
  }

  get userId(): number | undefined {
    return this.wrappedUserInfo?.id
  }

  get userGroupId(): number | undefined {
    return this.wrappedUserInfo?.groupId
  }

}

export default new SessionInfo()
