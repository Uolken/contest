import { Problem, Work } from "../types"
import { makeAutoObservable } from "mobx"
import graphQLApi from "../api/graphQLApi"
import { USER_WORK_PROBLEM } from "../api/queries"

class WorkProblemPage {

  work: Work | null = null
  problem: Problem | null = null

  constructor() {
    makeAutoObservable(this)
  }


  fetchWorkAndProblem(userId: number, workId: number, problemId: number) {
    graphQLApi(USER_WORK_PROBLEM, {userId, workId, problemId})
    .then(r => {
      this.work = r.work
      this.problem = r.problem
    })
  }
}

export default new WorkProblemPage()
