import { makeAutoObservable } from "mobx"
import { User, UserSelectorInput } from "../types"
import graphQLApi from "../api/graphQLApi"
import { USER_COUNT, USERS } from "../api/queries"

class StudentsManagementPage {
  students : Array<User> | undefined
  studentCount: number | undefined

  fetchStudentCount(userSelector: UserSelectorInput) {
    graphQLApi(USER_COUNT, {selector: userSelector}).then(r => {
      this.studentCount = r.userCount
    })
  }

  fetchStudents(userSelector: UserSelectorInput) {
    this.fetchStudentCount(userSelector)
    graphQLApi(USERS, {selector: userSelector}).then(r => {
      this.students = r.users
    })
  }
  constructor() {
    makeAutoObservable(this)
  }
}

export default new StudentsManagementPage()
