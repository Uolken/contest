import { makeAutoObservable } from "mobx"
import { Problem, Work } from "../types"
import graphQLApi from "../api/graphQLApi"
import { USER_WORK_PROBLEM } from "../api/queries"

enum ProblemPageSolutionStatus {
 NONE,
 SOLUTION_SENT,
 START_TESTING,
 TEST_FAILED,
 TEST_SUCCEED
}

class ProblemPage {
  problem: Problem | null = null
  status: ProblemPageSolutionStatus = ProblemPageSolutionStatus.NONE

  constructor() {
    makeAutoObservable(this)
  }

  setProblem(problem: Problem) {
    this.problem = problem
  }


}
export default new ProblemPage()
