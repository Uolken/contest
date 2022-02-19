import { makeAutoObservable } from "mobx"
import { CreateUserRequestInput, Group, User, UserRole } from "../../types"
import { validateEmail } from "../../utils"
import graphQLApi, { Query } from "../../api/graphQLApi"

const saveUserQuery: Query<{ createUserRequest: CreateUserRequestInput }, { user: User }> = {
  query: `
mutation saveUser($createUserRequest: CreateUserRequestInput!) {
  user: saveUser(createUserRequest: $createUserRequest) {
    id
  }
}
`
}

class CreateStudentPage {
  firstName: string | undefined
  lastName: string | undefined
  email: string | undefined
  showGroupSelector: boolean = false
  group: Group | undefined
  showErrorMessage: boolean = false
  errorMessage: string = ""

  constructor() {
    makeAutoObservable(this)
  }

  createUser() {
    if (!this.firstName) {
      this.errorMessage = "Поле имя должно быть заполнено"
      this.showErrorMessage = true
      return
    }
    if (!this.lastName) {
      this.errorMessage = "Поле фамилия должно быть заполнено"
      this.showErrorMessage = true
      return
    }
    if (!this.email) {
      this.errorMessage = "Поле email должно быть заполнено"
      this.showErrorMessage = true
      return
    }
    if (!validateEmail(this.email)) {
      this.errorMessage = "В поле email введен не корректный email"
      this.showErrorMessage = true
      return
    }

    return graphQLApi(saveUserQuery, {
      createUserRequest: {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        role: UserRole.Student,
        groupId: this.group?.id
      }
    }).then(r => r.user)

  }

}

export default new CreateStudentPage()
