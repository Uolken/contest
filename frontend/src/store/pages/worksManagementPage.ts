import { Work, WorkSelectorWithPageInput } from "../../types"
import { makeAutoObservable } from "mobx"
import graphQLApi from "../../api/graphQLApi"
import { WORKS, WORK_COUNT } from "../../api/queries"

class WorksManagementPage {
  works: Array<Work> | undefined
  workCount: number | undefined

  constructor() {
    makeAutoObservable(this)
  }

  fetchWorks(selector: WorkSelectorWithPageInput) {
    graphQLApi(WORK_COUNT, { selector: selector.workSelector })
    .then(r => {
      return this.workCount = r.workCount
    })

    graphQLApi(WORKS, { selector })
    .then(r => this.works = r.works)
  }
}

export default new WorksManagementPage
