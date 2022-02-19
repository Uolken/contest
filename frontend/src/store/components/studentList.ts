import { Group, User } from "../../types"
import { makeAutoObservable } from "mobx"
import graphQLApi from "../../api/graphQLApi"
import { GROUPS } from "../../api/queries"

class StudentList {
  students: Array<User> | undefined = undefined

  constructor() {
    makeAutoObservable(this)
  }

  fetchStudents() {
    // graphQLApi(, {})
    // .then(r => {
    //   console.log(r)
    //   return this.students = r.
    // })
  }

}

export default new StudentList()
