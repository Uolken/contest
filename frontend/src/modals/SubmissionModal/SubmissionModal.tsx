import modalStyles from "../Modal.module.css"
import { ReactComponent as CrossIcon } from "../../images/icons/cross.svg"
import { useCallback, useEffect, useState } from "react"
import graphQLApi, { Query } from "../../api/graphQLApi"
import { ProblemSolutionFailReason, Submission, SubmissionStatus } from "../../types"
import { Link } from "react-router-dom"
import Editor from "@monaco-editor/react"
import styles from "./SubmissionModal.module.css"
import { ReactComponent as CompletedCircleIcon } from "../../images/icons/completed-circle-bar.svg"
import { ReactComponent as FailedCircleIcon } from "../../images/icons/failed-circle-bar.svg"
import { fullName } from "../../utils"
import SmallLoading from "../../components/SmallLoading/SmallLoading"

const query: Query<{ submissionId: string }, { submission: Submission }> = {
  query: `
query submission($submissionId: String!) {
  submission(submissionId: $submissionId) {
    id
    code
    language
    status
    executionResult {
      statistic {
        maxMemoryUsage
        maxTime
      }
      error {
        failReason
        message
        testCaseExecutionResult {
          memoryUsage
          time
          actualOutput
          testCase {
            id
            input
            outputs
          }
        }
      }
    }
    submitter {
      id
      firstName
      lastName
      email
      group {
        id
        name
      }
    }
    problem {
      id
      name
    }
  }
}
`
}

export default ({
                  submissionId,
                  onClose,
                  teacherMode
                }: { submissionId: string, onClose: () => void, teacherMode: boolean }) => {

  const [submission, setSubmission] = useState<Submission | null>(null)
  useEffect(() => {
    graphQLApi(query, { submissionId })
    .then(r => {
      setSubmission(r.submission)
    })
  }, [submissionId])

  const escFunction = useCallback((event) => {
    if (event.key == "Escape") {
      onClose()
    }
  }, [])

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false)

    return () => {
      document.removeEventListener("keydown", escFunction, false)
    }
  }, [])

  const group = submission?.submitter.group
  return <>
    <div className={modalStyles.modalBack} onClick={onClose}></div>
    <div className={modalStyles.modal}>
      {submission ?
        <div>
          <div className={modalStyles.modalHeader}>
            <h1>Решение задачи "{teacherMode ?
              <Link
                to={`/teaching/problems/${submission.problem.id}`}>{submission.problem.name}</Link>
              : <>{submission.problem.name}</>
            }"</h1>
            <div onClick={onClose} style={{ cursor: "pointer" }}>
              <CrossIcon/>
            </div>
          </div>

          <div>
            <div>
              <div>
                Решил студент{group && <span> группы {teacherMode ?
                <Link to={`/teaching/groups/${group.id}`}>{group.name}</Link>
                : <>{group.name}</>}
                </span>
              }
                {/*<span> группы <Link*/}
                {/*to={`/teaching/groups/${group.id}`}>{group.name}</Link></span>}*/}
                <span>: {teacherMode ?
                  <Link to={`/teaching/students/${submission.submitter.id}`}>{fullName(submission.submitter)} </Link>
                  : <>{fullName(submission.submitter)}</>}</span>
              </div>
              <Editor
                height="30vh"
                language={submission.language}
                defaultValue={submission.code}
                options={{ readOnly: true }}
              />
              <TestExecutionDescription submission={submission} teacherMode={teacherMode}/>
            </div>
          </div>
        </div>
        : <SmallLoading/> }

    </div>
  </>
}

export const TestExecutionDescription = ({ submission, teacherMode }: { submission: Submission, teacherMode: boolean }) => {
  if (submission.status == SubmissionStatus.Succeed) {
    return <div>
      <div className={styles.status}>
        <CompletedCircleIcon/> Все тесты пройдены
      </div>
      <div>
        Время выполнения: <span>{submission.executionResult?.statistic?.maxTime}</span> мс
      </div>
      <div>
        Используемая память: <span>{submission.executionResult?.statistic?.maxMemoryUsage}</span> КБ
      </div>
    </div>
  }
  const error = submission.executionResult?.error
  if (error?.failReason == ProblemSolutionFailReason.CompilationError) {
    return <div>
      <FailedCircleIcon/> Ошибка компиляции
    </div>
  }

  const testCase = error?.testCaseExecutionResult?.testCase
  if (error?.failReason == ProblemSolutionFailReason.IncorrectOutput) {
    return <div>
      <FailedCircleIcon/> Не верный ответ в тесте {teacherMode ?
      <Link
        to={`/teaching/problems/${submission.problem.id}`}>#{testCase?.id}</Link>
      : <>#{testCase?.id}</>
    }


      {testCase?.input && <div>
          Ввод:
          <div className={styles.ioData}>
            {testCase?.input}
          </div>
      </div>
      }

      <div>
        Вывод:
        <div className={styles.ioData}>
          {error.testCaseExecutionResult?.actualOutput}
        </div>
      </div>

      <div>
        Ожидаемый вывод:
        <div className={styles.ioData}>
          {testCase?.outputs[0]}
        </div>
      </div>
    </div>
  }

  return <div>
    <FailedCircleIcon/> Превышен лимит ресурсов
  </div>
}


export const SubmissionStatusBlock = ({ submission, teacherMode }: { submission: Submission, teacherMode: boolean }) => {
  if (submission.status == SubmissionStatus.Succeed) {
    return <div>
      <div>
        <CompletedCircleIcon/> Все тесты пройдены
      </div>
    </div>
  }
  const error = submission.executionResult?.error
  if (error?.failReason == ProblemSolutionFailReason.CompilationError) {
    return <div>
      <FailedCircleIcon/> Ошибка компиляции
    </div>
  }

  const testCase = error?.testCaseExecutionResult?.testCase
  if (error?.failReason == ProblemSolutionFailReason.IncorrectOutput) {
    return <div>
      <FailedCircleIcon/> Не верный ответ в тесте {teacherMode ?
      <Link
        to={`/teaching/problems/${submission.problem.id}`}>#{testCase?.id}</Link>
      : <>#{testCase?.id}</>
    }
    </div>
  }

  return <div>
    <FailedCircleIcon/> Превышен лимит ресурсов
  </div>
}
