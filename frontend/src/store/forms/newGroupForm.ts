import { makeAutoObservable } from "mobx"
import graphQLApi from "../../api/graphQLApi"
import { UPDATE_GROUP } from "../../api/queries"
import { Group, User } from "../../types"

class NewGroupForm {
  groupName = ""
  students: Array<User> = []

  showError = false
  errorMessage = "Группа с таким именем уже существует"
  showStudentSelector: boolean = false

  constructor() {
    makeAutoObservable(this)
  }

  createGroup(): Promise<Group> {
    return graphQLApi(UPDATE_GROUP, {
      updateGroupRequest: {
        name: this.groupName,
        studentIds: this.students.map(s => s.id)
      }
    })
    .then(g => g.group)
  }

  clearData() {
    this.groupName = ""
    this.students = []

  }

  addStudent(s: User) {
    console.log(s)
    this.students.push(s)
  }

  removeStudent(user: User) {
    this.students = this.students.filter(u => u.id != user.id)
  }
}

export default new NewGroupForm()
