import { makeAutoObservable } from "mobx"
import { User, Work } from "../../types"
import graphQLApi from "../../api/graphQLApi"
import { USER, USER_WITH_ASSIGNMENT, USER_WITH_PROBLEMS, USER_WORK } from "../../api/queries"

class StudentWorkManagementPage {
  student: User | undefined
  constructor() {
    makeAutoObservable(this)
  }

  fetchAssignment(studentId: number, workId: number) {
    graphQLApi(USER_WITH_ASSIGNMENT, {userId: studentId, workId})
    .then(r => this.student = r.user)
  }
}

export default new StudentWorkManagementPage()
