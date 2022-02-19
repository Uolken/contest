import BreadCrumbs from "../../../../components/BreadCrumbs/BreadCrumbs"
import { RouteComponentProps } from "react-router"
import problemManagementPage from "../../../../store/pages/problemManagementPage"
import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import 'draft-js/dist/Draft.css'
import styles from './ProblemManagementPage.module.css'
import { Example } from "../../../../types"
import TextEditor from "./TextEditor"
import { ContentState, Editor, EditorState, getDefaultKeyBinding } from "draft-js"
import { ReactComponent as TrashIcon } from '../../../../images/icons/trash-icon.svg'
import { ReactComponent as PlusIcon } from '../../../../images/icons/plus-icon.svg'
import { ReactComponent as EditIcon } from '../../../../images/icons/edit-icon.svg'
import TestCasesEditorBlock from "./TestCaseEditorBlock/TestCasesEditorBlock"
import ErrorPopup from "../../../../components/ErrorPopup/ErrorPopup"
import { useHistory } from "react-router-dom"
import EditableField from "../../../../components/EditableField/EditableField"

const ProblemManagementPage = observer(({ match }: RouteComponentProps<{ problemId: string }>) => {
  useEffect(() => {
    if (match.params.problemId == "new") {
      problemManagementPage.setProblem(null)
      return
    }
    problemManagementPage.fetchProblem(+match.params.problemId)
  }, [match.params.problemId])
  const history = useHistory()
  const problem = problemManagementPage.problem
  if (problem === undefined) return <div>LOADING</div>

  return <div className={"page"}>
    <BreadCrumbs elements={[
      {
        name: "Задачи",
        url: "/teaching/problems"
      },
      {
        name: problem?.name || "Новая задача",
        url: `/teaching/problems/${problem?.id || "new"}`
      }
    ]}/>
    <div className={"pageHeader"}>
      <EditableField value={problemManagementPage.problemName || ""}
                         placeholder={"Название"}
                         onChange={v => problemManagementPage.problemName = v}/>
      <button onClick={() => problemManagementPage.sendUpdates()
      .then((problemId) => {
        if (match.params.problemId == "new") history.push(`/teaching/problems/${problemId}`)
        window.location.reload()
      })}>Сохранить изменения
      </button>
    </div>

    <ContentEditorBlock/>

    <TestCasesEditorBlock/>
    {problemManagementPage.showError &&
        <ErrorPopup errorMessage={problemManagementPage.errorMessage || ""} onClose={() => {
          problemManagementPage.showError = false
        }}/>}
  </div>
})

const ContentEditorBlock = observer(() => {
  const examples = problemManagementPage.problemExamples

  return <div className={styles.contentEditor}>
    <TextEditor/>
    <div className={styles.examplesEditor}>
      <h2>Примеры</h2>
      {examples && examples.map((e, i) => <ExampleBlock key={`${e.input} ${e.output} ${i}`}
                                                        example={e} index={i}
                                                        onChange={(i, e) => problemManagementPage.problemExamples![i] = e}
      />)}
      <button className={"addButton"} onClick={() => problemManagementPage.addExample()}>
        <PlusIcon/>
        <div>Добавить пример</div>
      </button>
    </div>
  </div>
})

const ExampleBlock = ({
                        example,
                        index,
                        onChange
                      }: { example: Example, index: number, onChange: (index: number, newValue: Example) => void }) => {
  const [input, setInput] = useState(example.input)
  const [editInput, setEditInput] = useState(false)
  const [inputState, setInputState] = useState(editInput ? EditorState.createWithContent(ContentState.createFromText(input)) : undefined)

  const [output, setOutput] = useState(example.output)
  const [editOutput, setEditOutput] = useState(false)
  const [outputState, setOutputState] = useState(editInput ? EditorState.createWithContent(ContentState.createFromText(output)) : undefined)

  const [comment, setComment] = useState(example.comment)
  const [editComment, setEditComment] = useState(false)
  const [commentState, setCommentState] = useState(editInput ? EditorState.createWithContent(ContentState.createFromText(comment || "")) : undefined)

  // useEffect(() => {onChange(index,{input, output, comment})}, [input, output, comment])

  return <div className={styles.exampleEditorBlock}>
    <div>
      <button className={styles.deleteExampleButton}
              onClick={() => problemManagementPage.removeExample(index)}><TrashIcon/></button>
    </div>
    <div className={styles.example}>
      <div className={styles.inputAndOutput}>
        <div className={styles.input} onBlur={() => {
          setEditInput(false)
          onChange(index, {
            input,
            output,
            comment
          })
        }} onClick={() => {
          if (editInput) return
          setEditInput(true)
          setInputState(EditorState.moveFocusToEnd(EditorState.createWithContent(ContentState.createFromText(input))))
        }}>
          <div className={styles.exampleTitle}>Ввод</div>
          <div>
            {editInput ? <Editor editorState={inputState!} onChange={s => {
              setInputState(s)
              setInput(s.getCurrentContent()
              .getPlainText())
            }}/> : <div className={"text"}>{input}</div>}
          </div>
        </div>

        <div className={styles.output} onBlur={() => {
          setEditOutput(false)
          onChange(index, {
            input,
            output,
            comment
          })
        }} onClick={() => {
          if (editOutput) return
          setEditOutput(true)
          setOutputState(EditorState.moveFocusToEnd(EditorState.createWithContent(ContentState.createFromText(output))))
        }}>
          <div className={styles.exampleTitle}>Вывод</div>
          <div>
            {editOutput ? <Editor editorState={outputState!} onChange={s => {
              setOutputState(s)
              setOutput(s.getCurrentContent()
              .getPlainText())
            }}/> : <div className={"text"}>{output}</div>}
          </div>
        </div>
      </div>
      <div className={styles.comment} onBlur={() => {
        setEditComment(false)
        onChange(index, {
          input,
          output,
          comment
        })
      }} onClick={() => {
        if (editComment) return
        setEditComment(true)
        setCommentState(EditorState.moveFocusToEnd(EditorState.createWithContent(ContentState.createFromText(comment || ""))))
      }}>
        {editComment ? <Editor editorState={commentState!} onChange={s => {
          setCommentState(s)
          setComment(s.getCurrentContent()
          .getPlainText())
        }}/> : comment ? <div className={"text"}>{comment}</div> :
          <div className={styles.placeholder}>Комментарий</div>}
      </div>
    </div>
  </div>
}
export default ProblemManagementPage
