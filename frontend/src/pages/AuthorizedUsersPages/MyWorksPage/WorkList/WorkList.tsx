import { WorkStatusBlock } from "./WorkListItem/WorkListItem"
import GenericTable, { Column } from "../../../../components/GenericTable/GenericTable"
import { SolutionStatus, WorkGroupAssignment } from "../../../../types"
import TagList from "../../../../components/TagList/TagList"
import { Link } from "react-router-dom"
import { fullName } from "../../../../utils"
import React from "react"

const PAGE_SIZE = 10

const columns: Array<Column<WorkGroupAssignment>> = [
  {
    readableName: "Название",
    name: "name",
    sortable: true,
    content: a => <div>
      <Link to={`/works/${a.work.id}`}>{a.work.name}</Link>
      <TagList tags={a.work.problems.flatMap(p => p.tags)}/>
    </div>,
    sortValue: a => a.work.name
  },
  {
    readableName: "Прогресс",
    name: "progress",
    content: a => <WorkStatusBlock assignment={a}/>,
    sortable: true,
    sortValue: a => a.work.problems.filter(p => p.userSolutionInfo?.status == SolutionStatus.Accepted).length
  },
  {
    readableName: "Преподователь",
    name: "author",
    sortable: false,
    content: a => <div>Преподователь: <Link to={""}>{fullName(a.work.author)}</Link></div>
  },
]

const WorkList = ({ workAssignments }: { workAssignments: Array<WorkGroupAssignment> }) => {

  return <div>
    <GenericTable columns={columns} pageSize={PAGE_SIZE} keyExtractor={a => a.work.id}
                  linkExtractor={a => `/works/${a.work.id}`}
                  data={workAssignments} hideHeader={false}/>

  </div>
}

export default WorkList
