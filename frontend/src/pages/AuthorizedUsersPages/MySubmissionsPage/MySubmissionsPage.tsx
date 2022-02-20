import React, { useEffect, useState } from "react"
import { Submission } from "../../../types"
import graphQLApi from "../../../api/graphQLApi"
import { SUBMISSION_COUNT, SUBMISSIONS } from "../../../api/queries"
import DynamicTable from "../../../components/DynamicTable/DynamicTable"
import sessionInfo from "../../../store/sessionInfo"
import { Column } from "../../../components/GenericTable/GenericTable"
import { Link } from "react-router-dom"
import SubmissionModal, { SubmissionStatusBlock } from "../../../modals/SubmissionModal/SubmissionModal"
import { fromDateString } from "../../../utils"
import studentManagementPage from "../../../store/pages/studentManagementPage"
import BreadCrumbs from "../../../components/BreadCrumbs/BreadCrumbs"

const PAGE_SIZE = 10

const columns: Array<Column<Submission>> = [
  {
    name: "task",
    readableName: "Задача",
    sortable: false,
    content: s => <Link to={`/teaching/problems/${s.problem.id}`}>{s.problem.name}</Link>
  },
  {
    name: "status",
    readableName: "Статус",
    sortable: true,
    content: s => <SubmissionStatusBlock submission={s} teacherMode={false}/>
  },
  {
    name: "submitted",
    readableName: "Отправлено",
    sortable: true,
    content: s => fromDateString(s.submitted)!
    .toLocaleString({
      timeStyle: "short",
      dateStyle: "medium"
    })
  },
  {
    name: "language",
    readableName: "Язык программирования",
    sortable: true,
    content: s => s.language
  }
]

export default () => {
  const [updatableProps, setUpdatableProps] = useState({
    currentPage: 0,
    sortColumn: "created",
    sortDirIsDesc: true
  })
  const [submissions, setSubmissions] = useState<Array<Submission> | null>(null)
  const [submissionCount, setSubmissionCount] = useState(0)
  const [submissionIdToShow, setSubmissionIdToShow] = useState<string | undefined>()

  useEffect(() => {
    graphQLApi(SUBMISSIONS, {

      selector: {
        submissionSelector: {
          submitterIds: [sessionInfo.userId],
        },
        pageSelector: {
          pageSize: PAGE_SIZE,
          currentPage: updatableProps.currentPage,
          sortDirIsDesc: updatableProps.sortDirIsDesc,
          sortField: updatableProps.sortColumn
        }
      }
    })
    .then(r => setSubmissions(r.submissions))
  }, [updatableProps])

  useEffect(() => {
      graphQLApi(SUBMISSION_COUNT, {
        selector: {
          submitterIds: [sessionInfo.userId],
        },
      })
      .then(r => {
        setSubmissionCount(r.submissionCount)
      })
    }, []
  )
  return <div className={"page"}>
    <BreadCrumbs elements={[
      {
        name: "Решения",
        url: "/submissions"
      },
    ]}/>
    <h1>Решения</h1>
    {submissions && <DynamicTable columns={columns} updatableProps={updatableProps}
                                  elementsToShow={submissions}
                                  hideHeader={false}
                                  hook={p => {
                                    setUpdatableProps({ ...p })
                                  }}
                                  onClick={s => setSubmissionIdToShow(s.id)}
                                  keyExtractor={s => s.id}
                                  pageCount={Math.ceil((submissionCount || 1) / PAGE_SIZE)}
                                  pageSize={PAGE_SIZE}/>}
    {submissionIdToShow && <SubmissionModal submissionId={submissionIdToShow}
                      onClose={() => setSubmissionIdToShow(undefined)}
                      teacherMode={true}/>}
  </div>
}
