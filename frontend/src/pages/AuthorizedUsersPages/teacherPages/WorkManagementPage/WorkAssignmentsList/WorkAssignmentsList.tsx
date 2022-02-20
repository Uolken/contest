import { WorkGroupAssignment } from "../../../../../types"
import GenericTable, { Column } from "../../../../../components/GenericTable/GenericTable"
import { DateTime } from "luxon"
import Button from "../../../../../components/Button/Button"
import { ReactComponent as PlusIcon } from "../../../../../images/icons/plus-icon.svg"
import * as React from "react"
import workManagementPage from "../../../../../store/pages/workManagementPage"
import { fromDateString } from "../../../../../utils"

const columns: Array<Column<WorkGroupAssignment>> = [
  {
    name: "groupName",
    readableName: "Название группы",
    sortable: true,
    content: a => a.group.name
  },
  {
    name: "start",
    readableName: "Начало",
    sortable: true,
    content: a => fromDateString(a.start)?.toLocaleString(DateTime.DATETIME_SHORT) || "",
    sortValue: a => +(fromDateString(a.start) || 0)
  },
  {
    name: "end",
    readableName: "Конец",
    sortable: true,
    content: a =>fromDateString(a.end)?.toLocaleString(DateTime.DATETIME_SHORT) || "",
    sortValue: a =>  +(fromDateString(a.end) || 0)
  },
  {
    name: "",
    readableName: "",
    sortable: false,
    content: a => <div className={"rightButton"}><Button action={() => {
      workManagementPage.editAssignmentGroupId = a.group.id
    }} text={"Править"}/></div>
  },

]

const WorkAssignmentsList = ({ assignments }: { assignments: Array<WorkGroupAssignment> }) => {
  return <div>
    <div className={"tableHeader"}>
      <h2>Назначения на группы</h2>
      <button className={"addButton"}
              onClick={() => workManagementPage.showGroupSelector = true}>
        <PlusIcon/>
        <div>Добавить группу</div>
      </button>
    </div>
    <GenericTable hideHeader={false} columns={columns} linkExtractor={null}
                  keyExtractor={a => `${a.group.id}_${a.work.id}`} pageSize={5} data={assignments}/>
  </div>
}

export default WorkAssignmentsList
