import { makeAutoObservable } from "mobx"
import graphQLApi from "../api/graphQLApi"
import { Work } from "../types"
import { USER_WORK } from "../api/queries"

class WorkPage {
  work: Work | null = null

  constructor() {
    makeAutoObservable(this)
  }

  // setWork(id: number) {
  //   if (this.work?.id == id) {
  //     return
  //   }
  //   this.work = null
  //   this.fetchWork(id)
  // }

  fetchWork(userId: number, workId: number) {
    graphQLApi(USER_WORK, {userId, workId})
    .then(r => {
      this.work = r.work
    })
  }


}
export default new WorkPage()
