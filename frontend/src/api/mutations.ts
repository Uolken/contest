import { Query } from "./graphQLApi"
import { SessionResponse, SignInRequestInput, SignUpRequestInput, UserInfo } from "../types"

export const LOGIN: Query<SignInRequestInput, { sessionResponse: SessionResponse }> = {
  query: `
mutation login($email: String!, $password: String!) {
  sessionResponse: login(signInRequest: {email: $email, password: $password}) {
    userInfo {
      id
      email
      role
      groupId
    }
    jwtExpirationPeriod
    refreshTokenExpirationPeriod
  }
}
`
}

export const LOGOUT: Query<{} | undefined, {} | undefined> = {
  query: `
mutation logout {
  logout
}
`
}

export const WHO_AM_I: Query<{} | undefined, { whoAmI: UserInfo }> = {
  query: `
mutation whoAmI {
  whoAmI {
    id
    email
    role
  }
}
`
}

export const REFRESH_TOKEN: Query<{} | undefined, { refreshToken: SessionResponse }> = {
  query: `
mutation refreshToken {
  refreshToken {
    userInfo {
      id
      email
      role
      groupId
    }
    jwtExpirationPeriod
    refreshTokenExpirationPeriod
  }
}
`
}

export const REGISTRATION: Query<SignUpRequestInput, { registration: SessionResponse }> = {
  query: `
mutation registration($email: String!, $password: String!) {
  registration(signUpRequest: {email: $email, password: $password}) {
    userInfo {
      id
      email
      role
      groupId
    }
    jwtExpirationPeriod
    refreshTokenExpirationPeriod
  }
}
`
}

export const SOLVE_PROBLEM: Query<{ problemId: number, language: string, solutionText: string },
  { solveProblem: { submissionId: number } }> = {
  query: `
mutation solveProblem($problemId: Long!, $language: String!, $solutionText: String!) {
  solveProblem(
    problemId: $problemId, 
    solveProblemRequest: {
      language: $language, 
      solutionText: $solutionText 
    }
  ) {
    submissionId
  }
}
`
}
