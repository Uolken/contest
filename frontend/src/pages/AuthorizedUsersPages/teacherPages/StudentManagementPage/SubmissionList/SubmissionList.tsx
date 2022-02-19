import { Column } from "../../../../../components/GenericTable/GenericTable"
import { Submission } from "../../../../../types"
import DynamicTable from "../../../../../components/DynamicTable/DynamicTable"
import React, { useEffect, useState } from "react"
import graphQLApi from "../../../../../api/graphQLApi"
import { SUBMISSION_COUNT, SUBMISSIONS } from "../../../../../api/queries"
import { DateTime } from "luxon"
import { Link } from "react-router-dom"
import { SubmissionStatusBlock } from "../../../../../modals/SubmissionModal/SubmissionModal"
import { fromDateString } from "../../../../../utils"

const PAGE_SIZE = 5

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

export default ({
                  submitterId,
                  problemIds,
                  onSelect
                }: { submitterId: number, problemIds?: Array<number>, onSelect?: (submission: Submission) => void }) => {

  console.log(problemIds)
  const [updatableProps, setUpdatableProps] = useState({
    currentPage: 0,
    sortColumn: "created",
    sortDirIsDesc: true
  })
  const [submissions, setSubmissions] = useState<Array<Submission> | null>(null)
  const [submissionCount, setSubmissionCount] = useState(0)
  useEffect(() => {
    if (problemIds?.length == 0) {
      setSubmissions([])
    } else {
      graphQLApi(SUBMISSIONS, {

        selector: {
          submissionSelector: {
            submitterIds: [submitterId],
            problemIds: problemIds
          },
          pageSelector: {
            pageSize: 5,
            currentPage: updatableProps.currentPage,
            sortDirIsDesc: updatableProps.sortDirIsDesc,
            sortField: updatableProps.sortColumn
          }
        }
      })
      .then(r => setSubmissions(r.submissions))
    }
  }, [updatableProps, submitterId, problemIds])

  useEffect(() => {
    if (problemIds?.length == 0) {
      setSubmissionCount(0)
    } else {
      graphQLApi(SUBMISSION_COUNT, {
        selector: {
          submitterIds: [submitterId],
          problemIds: problemIds
        },
      })
      .then(r => {
        setSubmissionCount(r.submissionCount)
      })
    }
    }, [submitterId, problemIds]
  )
  return <div>
    <h2>Список решений</h2>
    {submissions && <DynamicTable columns={columns} updatableProps={updatableProps}
                                  elementsToShow={submissions}
                                  hideHeader={false}
                                  hook={p => {
                                    setUpdatableProps({ ...p })
                                  }}
                                  onClick={onSelect}
      // linkExtractor={s => `submissions/${s.id}`}
                                  keyExtractor={s => s.id}
                                  pageCount={Math.ceil((submissionCount || 1) / PAGE_SIZE)}
                                  pageSize={PAGE_SIZE}/>}
  </div>
}
