import { makeAutoObservable } from "mobx"
import { Problem } from "../../types"

class WorkCreationPage {
  private _name: string = ""
  private _problems: Array<Problem> = []

  private _showProblemSelector = false

  get name(): string {
    return this._name
  }

  set name(value: string) {
    this._name = value
  }

  get problems(): Array<Problem> {
    return this._problems
  }

  set problems(value: Array<Problem>) {
    this._problems = value
  }

  get showProblemSelector(): boolean {
    return this._showProblemSelector
  }

  set showProblemSelector(value: boolean) {
    this._showProblemSelector = value
  }


  constructor() {
    makeAutoObservable(this)
  }

  addProblem(p: Problem) {
    this._problems.push(p)
  }

  problemIds() {
    return this._problems.map(p => p.id)
  }

  clear() {
    this._name = ""

    this._problems = []
    this._showProblemSelector = false
  }
}

export default new WorkCreationPage()
