import { LIBRARY_PROBLEMS, USER_WORK_PROBLEM } from "../api/queries"
import { Problem } from "../types"
import { makeAutoObservable } from "mobx"
import graphQLApi from "../api/graphQLApi"

class LibraryPage {
  currentPage: number = 0
  problems: Problem[] | undefined = undefined

  constructor() {
    makeAutoObservable(this)
  }

  setPage(page: number) {
    this.currentPage = page
    this.problems = undefined
    this.fetchProblems()
  }

  fetchProblems() {
    graphQLApi(LIBRARY_PROBLEMS, {page: this.currentPage, size: 20})
    .then(r => {
      this.problems = r.problems
    })
  }

}
export default new LibraryPage()
