import GenericTable, { Column } from "../../../../../components/GenericTable/GenericTable"
import { SolutionStatus, WorkGroupAssignment } from "../../../../../types"
import { DateTime } from "luxon"
import { WorkStatusBlock } from "../../../MyWorksPage/WorkList/WorkListItem/WorkListItem"
import { fromDateString } from "../../../../../utils"

const columns: Array<Column<WorkGroupAssignment>> = [
  {
    readableName: "Название",
    name: "name",
    content: a => a.work.name,
    sortable: true
    // content: a => <div>
    //   <Link to={`/teaching/works/${a.work.id}`}>{a.work.name}</Link>
    //   <TagList tags={a.work.problems.flatMap(p => p.tags)}/>
    // </div>
  },
  {
    readableName: "Начало",
    name: "start",
    content: a => fromDateString(a.start)?.toLocaleString(DateTime.DATE_MED) || "",
    sortable: true,
    sortValue: a => +(fromDateString(a.start) || 0)
  },
  {
    readableName: "Конец",
    name: "end",
    content: a => fromDateString(a.end)?.toLocaleString(DateTime.DATE_MED) || "",
    sortable: true,
    sortValue: a => +(fromDateString(a.end) || 0)
  },
  // {
  //   readableName: "Количество отправок",
  //   name: "tryCount",
  //   content: a => {
  //     return a.work.problems.map(p => p.userSolutionInfo?.tryCount ? p.userSolutionInfo.tryCount : 0)
  //     .reduce((a, b) => a + b, 0)
  //   },
  //   sortable: true
  // },
  {
    readableName: "Прогресс",
    name: "progress",
    content: a => <WorkStatusBlock assignment={a}/>,
    sortable: false,
    sortValue: a => a.work.problems.filter(p => p.userSolutionInfo?.status == SolutionStatus.Accepted).length
  },
  // { readableName: "Название", name: "name", content: a =>  },
]

const AssignmentList = ({ workAssignments, studentId }: { workAssignments: Array<WorkGroupAssignment>, studentId: number }) => {
  return <div>

    <h2>Список назначенных работ</h2>
    {workAssignments && <GenericTable columns={columns} pageSize={5} keyExtractor={a => a.work.id}
                                      linkExtractor={a => `/teaching/students/${studentId}/works/${a.work.id}`}
                                      data={workAssignments} hideHeader={false}/>
    }
  </div>
}

export default AssignmentList
