import { makeAutoObservable } from "mobx"
import { Problem, ProblemSelectorWithPageInput } from "../../types"
import graphQLApi from "../../api/graphQLApi"
import { PROBLEM_COUNT, PROBLEMS } from "../../api/queries"

class ProblemsManagementPage {
  problems: Array<Problem> | undefined
  problemCount: number | undefined

  constructor() {
    makeAutoObservable(this)
  }

  fetchProblems(selector: ProblemSelectorWithPageInput) {
    graphQLApi(PROBLEMS, { selector })
    .then(r => this.problems = r.problems)
    graphQLApi(PROBLEM_COUNT, { selector: selector.problemSelector })
    .then(r => this.problemCount = r.problemCount)
  }
}

export default new ProblemsManagementPage()
