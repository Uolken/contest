import { Problem, User } from "../../types"
import { makeAutoObservable } from "mobx"
import graphQLApi from "../../api/graphQLApi"
import { USER_WITH_WORK_PROBLEM } from "../../api/queries"

class StudentWorkProblemManagementPage {
  student: User | undefined
  problem: Problem | undefined

  constructor() {
    makeAutoObservable(this)
  }

  fetchData(studentId: number, workId: number, problemId: number) {
    graphQLApi(USER_WITH_WORK_PROBLEM, {
      userId: studentId,
      workId,
      problemId
    })
    .then(r => {
        this.student = r.user
        this.problem = r.problem
      }
    )
  }
}

export default new StudentWorkProblemManagementPage()
