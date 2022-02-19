import { Group, User, Work, WorkGroupAssignment, WorkType } from "../types"
import graphQLApi from "../api/graphQLApi"
import GraphQLApi from "../api/graphQLApi"
import { GROUP, SAVE_GROUP_ASSIGNMENTS, UPDATE_GROUP } from "../api/queries"
import { makeAutoObservable } from "mobx"
import { DateTime } from "luxon"

class GroupManagementPage {
  group: Group | undefined
  groupName: string | undefined
  students: Array<User> = []
  assignments: Array<WorkGroupAssignment> = []

  showStudentSelector = false
  showWorkSelector = false
  editAssignmentWorkId: number | undefined

  constructor() {
    makeAutoObservable(this)
  }

  fetchGroup(groupId: number) {
    this.group = undefined
    graphQLApi(GROUP, { groupId })
    .then(r => {
      this.setGroup(r.group)
    })
  }

  setGroup(group: Group | undefined) {
    this.group = group
    this.groupName = group?.name
    this.assignments = group?.workAssignments || []
    group && this.assignments.forEach(a => a.group = group)
    this.students = group?.students || []
  }

  sendUpdate() {
    const groupName = this.groupName
    if (!groupName || groupName.length <= 0) throw Error()
    return graphQLApi(UPDATE_GROUP, {
      updateGroupRequest: {
        id: this.group?.id!,
        name: groupName,
        studentIds: this.students.map(s => s.id)
      }
    })
    .then(r => GraphQLApi(SAVE_GROUP_ASSIGNMENTS, {
        groupId: r.group.id,
        workAssignments: this.assignments.map(a => {
          console.log(a.start)
          return {
            workId: a.work.id,
            start: a.start,
            end: a.end,
            type: WorkType.Homework,
          }
        })
      })
      .then(_ => r.group.id)
    )
  }

  removeStudent(student: User) {
    this.students = this.students.filter(s => s.id != student.id)
  }

  addStudent(s: User) {
    this.students.push(s)
  }

  addWorkAssignment(w: Work) {
    this.assignments.push({
      work: w!,
      type: WorkType.Homework,
      start: w.start,
      end: w.end,
      group: this.group!
    })
  }

  updateAssignment(assignment: WorkGroupAssignment) {
    console.log(assignment)
    const index = this.assignments.findIndex(a => assignment.work.id == a.work.id)
    this.assignments[index] = assignment
    this.editAssignmentWorkId = undefined
    this.sendUpdate()
  }

  removeAssignment() {
    this.assignments = this.assignments.filter(a => a.work.id != this.editAssignmentWorkId)
    this.editAssignmentWorkId = undefined
    this.sendUpdate()
  }
}

export default new GroupManagementPage()
