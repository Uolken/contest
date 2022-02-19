import BreadCrumbs from "../../../components/BreadCrumbs/BreadCrumbs"
import { RouteComponentProps } from "react-router"
import graphQLApi from "../../../api/graphQLApi"
import { SUBMISSION, USER_WORK_PROBLEM } from "../../../api/queries"
import sessionInfo from "../../../store/sessionInfo"
import { useEffect, useState } from "react"
import { Problem, Submission, Work } from "../../../types"
import styles from "../ProblemPage/ProblemPage.module.css"
import ExampleBlock from "../ProblemPage/ExampleBlock/ExampleBlock"
import { fullName } from "../../../utils"
import TagList from "../../../components/TagList/TagList"
import DynamicTable from "../../../components/DynamicTable/DynamicTable"
import CodeEditor from "../../../components/CodeEditor/CodeEditor"
import TestProgressBar from "../../../components/TestProgressBar/TestProgressBar"
import codeEditor from "../../../store/components/codeEditor"

export default ({ match }: RouteComponentProps<{ workId: string, problemId: string, submissionId: string }>) => {
  const workId = +match.params.workId
  const problemId = +match.params.problemId
  const submissionId = match.params.submissionId

  const [problem, setProblem] = useState<Problem | undefined>(undefined)
  const [work, setWork] = useState<Work | undefined>(undefined)
  const [submission, setSubmission] = useState<Submission | undefined>(undefined)
  // const {
  //   problem,
  //   work
  useEffect(() => {
    graphQLApi(USER_WORK_PROBLEM, {
      problemId,
      userId: sessionInfo.userId!,
      workId: workId
    })
    .then(r => {
      setProblem(r.problem)
      setWork(r.work)
    })
  }, [workId, problemId])
  useEffect(() => {
    graphQLApi(SUBMISSION, { submissionId })
    .then(r => setSubmission(r.submission))
  }, [submissionId])

  if (!work || !problem || !submission) return <div>LOADING</div>
  codeEditor.text = submission.code
  codeEditor.currentLanguage = codeEditor.languages.find(l => l.value == submission.language)!
  return <div className={"page"}>
    <BreadCrumbs elements={[
      {
        name: "Работы",
        url: "/works"
      },
      {
        name: work.name || "",
        url: `/works/${work?.id}`
      },
      {
        name: problem.name || "",
        url: `/works/${work.id}/problems/${problem.id}`
      },
      {
        name: "Решения",
        url: `/works/${work.id}/problems/${problem.id}`
      },
      {
        name: submissionId,
        url: `/works/${work.id}/problems/${problem.id}/submissions/${submissionId}`
      },
    ]}/>
    <div><h1>Решение #{submissionId}</h1></div>
    <div className={styles.problemContent}>
      <div className={styles.problemText}>
        <div dangerouslySetInnerHTML={{ __html: problem.text }}/>
        <div className={styles.samples}>
          {problem.examples.map((e, i) => <ExampleBlock key={i} example={e}/>)}
        </div>
      </div>
      <div className={styles.problemAdditionalInfo}>
        <div>Автор: {fullName(problem.author)}</div>
        <TagList tags={problem.tags}/>
      </div>

    </div>
    <div className={styles.codeEditorBlock}>
      <CodeEditor readonly={true}/>
      <TestProgressBar/>
    </div>
  </div>
}
