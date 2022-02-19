import { makeAutoObservable } from "mobx"
import { Group, Problem, Work, WorkGroupAssignment, WorkType } from "../../types"
import graphQLApi from "../../api/graphQLApi"
import GraphQLApi from "../../api/graphQLApi"
import { SAVE_WORK, SAVE_WORK_ASSIGNMENTS, WORK } from "../../api/queries"
import { DateTime } from "luxon"
import { fromDateString } from "../../utils"

class WorkManagementPage {
  get start(): string | undefined {
    return this._start
  }
  set start(value: string | undefined) {
    this._start = value
  }
  work: Work | undefined | null

  workName: string | undefined
  private _start: string | undefined
  end: string | undefined
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
    this._start = work?.start && DateTime.fromISO(work?.start).toUTC()
    .toFormat("yyyy-MM-dd\'T\'hh:mm") || null
    this.end = work?.end && DateTime.fromISO(work?.end).toUTC()
    .toFormat("yyyy-MM-dd\'T\'hh:mm") || null
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
      start: this._start ? DateTime.fromFormat(this._start, "yyyy-MM-dd\'T\'hh:mm")
      .toISO() : undefined,
      end: this.end ? DateTime.fromFormat(this.end, "yyyy-MM-dd\'T\'hh:mm")
      .toISO() : undefined,
      group: group
    })
  }

  sendUpdates() {
    const workName = this.workName || ""
    const startStr = this._start && this._start + "Z" || null
    const endStr = this.end && this.end + "Z" || null
    return GraphQLApi(SAVE_WORK, {
      work: {
        id: this.work?.id,
        name: workName,
        type: WorkType.Homework,
        start: startStr,
        end: endStr,
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
