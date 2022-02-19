import { Submission, User } from "../../types"
import { makeAutoObservable } from "mobx"
import graphQLApi from "../../api/graphQLApi"
import { SUBMISSIONS, USER_WITH_PROBLEMS } from "../../api/queries"

class StudentManagementPage {
  student: User | undefined
  submissions: Array<Submission> | undefined
  showSubmissionId: string | undefined

  constructor() {
    makeAutoObservable(this)
  }

  setStudent(student: User | undefined) {
    this.student = student
  }

  fetchStudent(studentId: number) {
    this.setStudent(undefined)
    graphQLApi(USER_WITH_PROBLEMS, { userId: studentId })
    .then(r => this.setStudent(r.user))


  }
}

export default new StudentManagementPage()
