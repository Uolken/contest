import { makeAutoObservable } from "mobx"
import graphQLApi from "../../api/graphQLApi"
import { SOLVE_PROBLEM } from "../../api/mutations"

type EditorLanguage = { title: string, value: string }

class CodeEditor {
  languages = [
    {title: "Java", value: "java" },
    {title: "C", value: "c" },
    {title: "Kotlin", value: "kotlin" }
  ]

  currentLanguage: EditorLanguage = this.languages[0]
  text: string | undefined
  problemId: number = 1

  constructor() {
    makeAutoObservable(this)
  }

  selectLanguage(languageValue: string) {
    this.currentLanguage = this.languages.find(l => l.value == languageValue)!
  }

  send() {
    if (!this.text) return
    graphQLApi(SOLVE_PROBLEM, {
      problemId: this.problemId,
      language: this.currentLanguage.value,
      solutionText: this.text
    }).then(r => console.log(r.solveProblem.submissionId))
  }

  setText(text: string | undefined) {
    this.text = text
  }
}

export default new CodeEditor()
