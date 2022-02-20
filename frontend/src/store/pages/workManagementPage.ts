import { makeAutoObservable } from "mobx"
import { Group, Problem, Work, WorkGroupAssignment, WorkType } from "../../types"
import graphQLApi from "../../api/graphQLApi"
import GraphQLApi from "../../api/graphQLApi"
import { SAVE_WORK, SAVE_WORK_ASSIGNMENTS, WORK } from "../../api/queries"

class WorkManagementPage {
  get end(): string | undefined {
    return this._end
  }

  set end(value: string | undefined) {
    this._end = value
  }

  get start(): string | undefined {
    return this._start
  }

  set start(value: string | undefined) {
    this._start = value
  }

  work: Work | undefined | null

  workName: string | undefined
  private _start: string | undefined
  private _end: string | undefined
  problems: Array<Problem> = []
  assignments: Array<WorkGroupAssignment> = []

  showProblemSelector = false
  showGroupSelector = false
  editAssignmentGroupId: number | undefined

  constructor() {
    makeAutoObservable(this)
  }

  fetchWork(workId: string) {
    if (workId == "new") {
      this.setWork(null)
    } else {
      graphQLApi(WORK, { workId: +workId })
      .then(r => {
        this.setWork(r.work)
      })
    }

  }

  setWork(work: Work | undefined | null) {
    this.work = work
    this.workName = work?.name
    this._start = work?.start
    this._end = work?.end
    this.problems = work?.problems || []
    this.assignments = work?.assignments || []
    work && this.assignments.forEach(a => a.work = work)
  }

  addProblem(p: Problem) {
    this.problems.push(p)
  }

  problemIds() {
    return this.problems.map(p => p.id)
  }

  clear() {
    this.workName = undefined

    this.problems = []
    this.showProblemSelector = false
  }

  removeProblem(problemId: number) {
    this.problems = this.problems.filter(p => p.id != problemId)

  }

  assignedGroupIds() {
    return this.assignments.map(a => a.group.id)
  }

  addAssignment(group: Group) {
    this.assignments.push({
      work: this.work!,
      type: WorkType.Homework,
      start: this._start,
      end: this._end,
      group: group
    })
  }

  sendUpdates() {
    const workName = this.workName || ""
    return GraphQLApi(SAVE_WORK, {
      work: {
        id: this.work?.id,
        name: workName,
        type: WorkType.Homework,
        start: this._start,
        end: this._end,
        problemIds: this.problems.map(p => p.id),
      }
    })
    .then(r => GraphQLApi(SAVE_WORK_ASSIGNMENTS, {
        workId: r.work.id,
        workAssignments: this.assignments.map(a => {
          return {
            groupId: a.group.id,
            start: a.start,
            end: a.end,
            type: WorkType.Homework,
          }
        })
      })
      .then(_ => r.work.id)
    )
  }

  removeAssignment() {
    this.assignments = this.assignments.filter(a => a.group.id != this.editAssignmentGroupId)
    this.editAssignmentGroupId = undefined
  }

  updateAssignment(assignment: WorkGroupAssignment) {
    const index = this.assignments.findIndex(a => a.group.id == assignment.group.id)
    this.assignments[index] = assignment
    this.editAssignmentGroupId = undefined
  }
}

export default new WorkManagementPage()
