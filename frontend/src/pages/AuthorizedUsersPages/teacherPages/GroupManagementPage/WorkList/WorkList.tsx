import { WorkGroupAssignment } from "../../../../../types"
import GenericTable, { Column, } from "../../../../../components/GenericTable/GenericTable"
import { ReactComponent as PlusIcon } from "../../../../../images/icons/plus-icon.svg"
import * as React from "react"
import Button from "../../../../../components/Button/Button"
import { DateTime } from "luxon"
import { fromDateString } from "../../../../../utils"

const columns: Array<Column<WorkGroupAssignment>> = [
  {
    readableName: "Название",
    name: "name",
    content: a => a.work.name,
    sortable: true
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
  }
]

const AssignmentList = ({
                          assignments,
                          onClickAdd,
                          onEdit
                        }: { assignments: Array<WorkGroupAssignment>, onClickAdd: () => void, onEdit: (e: WorkGroupAssignment) => void }) => {
  const additionalColumn: Column<WorkGroupAssignment> = {
    name: "",
    readableName: "",
    sortable: false,
    content: w => <div className={"rightButton"}><Button action={() => {
      onEdit(w)
    }} text={"Править"}/></div>
  }
  return <div>
    <div className={"tableHeader"}>
      <h2>Список назначенных работ</h2>
      <button className={"addButton"}
              onClick={onClickAdd}
      >
        <PlusIcon/>
        <div>Добавить работу</div>
      </button>
    </div>
    <GenericTable
      columns={columns.concat([additionalColumn])}
      data={assignments}
      pageSize={5}
      keyExtractor={a => {
        return `${a.group.id}_${a.work.id}`
      }}
      linkExtractor={s => `/teaching/works/${s.work.id}`}
      hideHeader={false}
    />
  </div>
}

export default AssignmentList
