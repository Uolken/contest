import { observer } from "mobx-react-lite"
import styles from "./ProblemPage.module.css"
import problemPage from "../../../store/problemPage"
import { useEffect, useState } from "react"
import ExampleBlock from "./ExampleBlock/ExampleBlock"
import CodeEditor from "../../../components/CodeEditor/CodeEditor"
import { SubscriptionClient } from "graphql-subscriptions-client"
import testProgressBar from "../../../store/components/testProgressBar"
import TestProgressBar from "../../../components/TestProgressBar/TestProgressBar"
import TagList from "../../../components/TagList/TagList"
import codeEditor from "../../../store/components/codeEditor"
import DynamicTable from "../../../components/DynamicTable/DynamicTable"
import { Column } from "../../../components/GenericTable/GenericTable"
import { Submission } from "../../../types"
import { DateTime } from "luxon"
import GraphQLApi from "../../../api/graphQLApi"
import { SUBMISSION_COUNT, SUBMISSIONS } from "../../../api/queries"
import { fromDateString, fullName, readableDateTime } from "../../../utils"
import SubmissionStatus from "../../../components/SubmissionStatus/SubmissionStatus"
import sessionInfo from "../../../store/sessionInfo"

const GRAPHQL_ENDPOINT = "ws://localhost:8341/subscriptions"

const query = `
subscription testExecutionSubscription($problemId: Long!) {
  problemTestExecutions(problemId: $problemId) {
    type
    submissionId
  }
}
`

// set up the client, which can be reused
const client = new SubscriptionClient(GRAPHQL_ENDPOINT, {
  reconnect: true,
  lazy: true, // only connect when there is a query
  connectionCallback: (error) => {
    error && console.error(error)
  },
})

const columns: Array<Column<Submission>> = [
  {
    name: "status",
    readableName: "Статус",
    sortable: true,
    content: s => <SubmissionStatus status={s.status}/>
  },
  {
    name: "submitted",
    readableName: "Отправлено",
    sortable: true,
    content: s => readableDateTime(fromDateString(s.submitted))
  },
]

const PAGE_SIZE = 5

const ProblemPage = observer(() => {
    const problem = problemPage.problem
    if (!problem) {
      return <div>LOADING2</div>
    }

    useEffect(() => {
      const subscription = client
      .request({
        query,
        variables: { problemId: problem.id }
      })
      .subscribe({
        next: (data: any) => {
          const event = data.data.problemTestExecutions
          if (event.type != "TEST_CASE_SUCCEED") updateSubmissions()
          testProgressBar.update(event)
        },
      })
    }, [])

    const [submissionProps, setSubmissionProps] = useState({
      currentPage: 0,
      sortColumn: "submitted",
      sortDirIsDesc: true
    })
    const [submissions, setSubmissions] = useState<Array<Submission>>([])
    const [submissionCount, setSubmissionCount] = useState(0)

    const updateSubmissionCount = () => {
      GraphQLApi(SUBMISSION_COUNT, {
        selector: {
          submitterIds: [sessionInfo.userId],
          problemIds: [problem.id]
        }

      })
      .then(r => setSubmissionCount(r.submissionCount))
    }
    useEffect(updateSubmissionCount, [problem])

    const updateSubmissions = () => {
      GraphQLApi(SUBMISSIONS, {
        selector: {
          submissionSelector: {
            submitterIds: [sessionInfo.userId],
            problemIds: [problem.id]
          },
          pageSelector: {
            pageSize: 5,
            currentPage: submissionProps.currentPage,
            sortField: submissionProps.sortColumn,
            sortDirIsDesc: submissionProps.sortDirIsDesc
          }
        }
      })
      .then(r => setSubmissions(r.submissions))
    }

    useEffect(updateSubmissions, [problem, submissionProps])

    testProgressBar.totalTests = problem.testCaseCount

    codeEditor.problemId = problem.id

    return <>
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
          <div>

            <DynamicTable columns={columns} pageSize={5} elementsToShow={submissions}
                          hideHeader={true}
                          hook={p => setSubmissionProps({...p})} keyExtractor={s => s.id}
                          pageCount={Math.ceil((submissionCount || 1) / PAGE_SIZE)}
                          linkExtractor={s => `${problem.id}/submissions/${s.id}`}
                          updatableProps={submissionProps}/>
          </div>
        </div>

      </div>
      <div className={styles.codeEditorBlock}>
        <CodeEditor readonly={false}/>
        <TestProgressBar/>
      </div>
    </>
  }
)

export default ProblemPage
