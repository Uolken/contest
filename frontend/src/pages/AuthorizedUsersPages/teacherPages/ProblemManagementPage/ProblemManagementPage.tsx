import BreadCrumbs from "../../../../components/BreadCrumbs/BreadCrumbs"
import { RouteComponentProps } from "react-router"
import problemManagementPage from "../../../../store/pages/problemManagementPage"
import * as React from "react"
import { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import 'draft-js/dist/Draft.css'
import styles from './ProblemManagementPage.module.css'
import { Example, Tag } from "../../../../types"
import TextEditor from "./TextEditor"
import { ContentState, Editor, EditorState } from "draft-js"
import { ReactComponent as TrashIcon } from '../../../../images/icons/trash-icon.svg'
import { ReactComponent as PlusIcon } from '../../../../images/icons/plus-icon.svg'
import TestCasesEditorBlock from "./TestCaseEditorBlock/TestCasesEditorBlock"
import ErrorPopup from "../../../../components/ErrorPopup/ErrorPopup"
import { useHistory } from "react-router-dom"
import EditableField from "../../../../components/EditableField/EditableField"
import AutocomplitableTags from "../../../../components/AutocmplitableTags/AutocomplitableTags"
import graphQLApi from "../../../../api/graphQLApi"
import { TAGS } from "../../../../api/queries"
import Button from "../../../../components/Button/Button"
import ContentLoader from "react-content-loader"

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

  return <div className={"page"}>
    <BreadCrumbs elements={[
      {
        name: "Задачи",
        url: "/teaching/problems"
      },
      problemManagementPage.problem !== undefined ? {
        name: problem?.name || "Новая задача",
        url: `/teaching/problems/${problem?.id || "new"}`
      }: undefined
    ]}/>
    <div className={"pageHeader"}>
      { problemManagementPage.problem !== undefined ?
      <EditableField value={problemManagementPage.problemName || ""}
                     placeholder={"Название"}
                     onChange={v => problemManagementPage.problemName = v}/>
        :  <ContentLoader backgroundColor={'#bbb'}
                          foregroundColor={'#ddd'}
                          height={30} width={150}
        >
          <rect x="0" y="0" rx="4" ry="4" width="150" height="30"/>
        </ContentLoader>}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 16
      }}>
        <label>
            <span className={"withInfo"}
                  title={"Доступ к этой задаче будет возможен не только через работы, но и через библиотеку задач"}>Общий доступ</span>
          <input type="checkbox" checked={problemManagementPage.inLibrary || false} onChange={e => problemManagementPage.inLibrary = e.target.checked}/>
        </label>
        <Button action={() => problemManagementPage.sendUpdates()
        .then((problemId) => {
          if (match.params.problemId == "new") history.push(`/teaching/problems/${problemId}`)
          window.location.reload()
        })} text={"Сохранить"}/>
      </div>
    </div>


    <ContentEditorBlock/>

    <TestCasesEditorBlock/>
    {problemManagementPage.showError &&
        <ErrorPopup errorMessage={problemManagementPage.errorMessage || ""} onClose={() => {
          problemManagementPage.showError = false
        }}/>}
  </div>
})

const TagBlock = ({tags, onTagAdd, onTagRemove}: {tags: Array<Tag>, onTagAdd: (tag: Tag) => void, onTagRemove: (index: number) => void}) => {
  const [suggestions, setSuggestions] = useState<Array<Tag>>()
  useEffect(() => {
    graphQLApi(TAGS,{}).then(r => setSuggestions(r.tags))
  }, [])
  return <AutocomplitableTags tags={tags} suggestions={suggestions || []} onTagAdd={onTagAdd} onTagRemove={onTagRemove}/>
}

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
    <div className={styles.tagsEditor}>
      <h2>Теги</h2>
      <TagBlock tags={problemManagementPage.tags || []} onTagAdd={t => problemManagementPage.addTag(t)} onTagRemove={problemManagementPage.removeTagByIndex}/>
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
