import { WorkGroupAssignment } from "../types"
import { makeAutoObservable } from "mobx"
import graphQLApi from "../api/graphQLApi"
import { ASSIGNED_WORKS_WITH_SOLUTION_INFO } from "../api/queries"

class WorkList {
  assignments: Array<WorkGroupAssignment> | undefined

  constructor() {
    makeAutoObservable(this)
  }

  fetchAssignedWorks(groupId: number, userId: number) {
    graphQLApi(ASSIGNED_WORKS_WITH_SOLUTION_INFO, {
      groupId,
      userId
    })
    .then(response => {
      return this.assignments = response.workAssignments
    })
    .catch(e => {
      console.error(e)
      console.log(e.data.errors)
    })
  }

}

export default new WorkList()
