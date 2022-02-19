import { makeAutoObservable } from "mobx"
import { Group } from "../../types"
import graphQLApi from "../../api/graphQLApi"
import { GROUPS } from "../../api/queries"



class GroupList {
  groups: Array<Group> | undefined = undefined

  constructor() {
    makeAutoObservable(this)
  }

  fetchGroups() {
    graphQLApi(GROUPS, {})
    .then(r => {
      return this.groups = r.groups
    })
  }

}

export default new GroupList()
