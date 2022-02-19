import { makeAutoObservable } from "mobx"
import { Example, Problem, TestCase } from "../../types"
import graphQLApi from "../../api/graphQLApi"
import { PROBLEM, SAVE_PROBLEM, SAVE_TEST_CASES } from "../../api/queries"
import { EditorState } from "draft-js"
import { stateFromHTML } from "draft-js-import-html"
import { stateToHTML } from "draft-js-export-html"
import { Tag } from "react-tag-autocomplete"

class ProblemManagementPage {
  problemName: string | undefined
  problemText: string | undefined
  problemExamples: Array<Example> | undefined
  problemTestCases: Array<TestCase> | undefined
  tags: Array<Tag> | undefined

  editorState: EditorState = EditorState.createEmpty()

  openedTestCaseEditor: number | undefined

  problem: Problem | undefined | null

  focusOutput: number | undefined


  errorMessage: string | undefined
  showError: boolean = false
  constructor() {
    makeAutoObservable(this)
  }

  setProblem(problem: Problem | undefined | null) {
    this.problemName = problem?.name
    this.problemText = problem?.text
    this.problemExamples = JSON.parse(JSON.stringify(problem?.examples || []))
    this.editorState = EditorState.createWithContent(stateFromHTML(problem?.text || ""))
    this.problemTestCases = problem?.testCases.sort((o1, o2) => o1.id - o2.id) || []
    this.tags = problem?.tags || []

    this.problem = problem
  }

  setOpenedTestCaseEditor(value: number | undefined) {
    this.openedTestCaseEditor = value
    this.focusOutput = undefined
  }

  setEditorState(state: EditorState) {
    this.editorState = state
  }

  fetchProblem(problemId: number) {
    this.setProblem(undefined)
    graphQLApi(PROBLEM, { problemId })
    .then(r => {
      this.setProblem(r.problem)
    })
  }

  removeExample(index: number) {
    this.problemExamples?.splice(index, 1)
  }

  addExample() {
    this.problemExamples?.push({
      input: "",
      output: ""
    })
  }

  removeTestCase(index: number) {
    this.problemTestCases?.splice(index, 1)
    this.openedTestCaseEditor = undefined
  }

  setTestCaseOutput(testCaseIndex: number, outputIndex: number, value: string) {
    this.problemTestCases![testCaseIndex].outputs[outputIndex] = value
  }

  testCaseCount() {
    return this.problemTestCases?.length
  }

  addTestCase() {
    this.problemTestCases?.push({
      id: 0,
      input: "",
      outputs: [""]
    })
    this.setOpenedTestCaseEditor(this.problemTestCases!.length - 1)
  }

  addTestCaseOutput(index: number) {
    this.problemTestCases![index].outputs.push("")
    this.focusOutput = this.problemTestCases![index].outputs.length - 1
  }

  removeOutputIfEmpty(testCaseIndex: number, outputIndex: number) {
    if (this.problemTestCases![testCaseIndex].outputs[outputIndex] == "" && this.problemTestCases![testCaseIndex].outputs.length > 1) {
      this.problemTestCases![testCaseIndex].outputs.splice(outputIndex, 1)
    }
  }

  setTestCaseInput(index: number, value: string) {
    this.problemTestCases![index].input = value
  }

  async sendUpdates() {
    const name = this.problemName || this.error("Необходимо указать название задачи")
    const problemIdPromise = graphQLApi(SAVE_PROBLEM, {
      problem: {
        id: this.problem?.id || 0,
        name,
        text: stateToHTML(this.editorState.getCurrentContent()),
        examples: this.problemExamples!,
        inLibrary: true,
        tags: this.tags?.map(t => {
          return {
            id: t.id as number || 0,
            name: t.name
          }
        }) || []
      }
    })
    .then(r => {
      return r.problem.id
    })

    // const problemId: number = 0 || await problemIdPromise
    const problemId: number = this.problem?.id || await problemIdPromise
    return graphQLApi(SAVE_TEST_CASES, {
      problemId,
      testCases: this.problemTestCases!
    })
    .then(r => problemId)
  }

  error(text: string): string {
    this.errorMessage = text
    this.showError = true
    throw Error(text)
  }

  addTag(tag: Tag) {
    this.tags?.push(tag)
  }

  removeTagByIndex(index: number) {
    this.tags?.splice(index, 1)
  }
}

export default new ProblemManagementPage()
