import { Problem } from "../types"
import { makeAutoObservable } from "mobx"
import graphQLApi from "../api/graphQLApi"
import { LIBRARY_PROBLEM } from "../api/queries"
import problemPage from "./problemPage"

class LibraryProblemPage {
  problem: Problem | null = null

  constructor() {
    makeAutoObservable(this)
  }

  fetchProblem(userId: number, problemId: number) {
    graphQLApi(LIBRARY_PROBLEM, { userId, problemId })
    .then(r => {
      this.problem = r.problem
      problemPage.setProblem(this.problem)
    })
  }
}

export default new LibraryProblemPage()
