import { User } from "../../../../../types"
import GenericTable, { Column } from "../../../../../components/GenericTable/GenericTable"
import workManagementPage from "../../../../../store/pages/workManagementPage"
import { ReactComponent as PlusIcon } from "../../../../../images/icons/plus-icon.svg"
import * as React from "react"
import Button from "../../../../../components/Button/Button"

const columns: Array<Column<User>> = [
  {
    readableName: "Id",
    name: "id",
    content: u => u.id,
    sortable: true
  },
  {
    readableName: "Имя",
    name: "firstName",
    content: u => u.firstName,
    sortable: true
  },
  {
    readableName: "Фамилия",
    name: "lastName",
    content: u => u.lastName,
    sortable: true
  },
  {
    readableName: "Email",
    name: "email",
    content: u => u.email,
    sortable: true
  },
]


const StudentList = ({ students, onClickAdd, onRemove }: { students: Array<User>, onClickAdd: () => void, onRemove: (u: User) => void }) => {
  const additionalColumn: Column<User> = { name: "", readableName: "", sortable: false,
        content: u => <div className={"rightButton"}><Button action={() => {
          onRemove(u)
        }} text={"Убрать"}/></div> }
  return <div>
    <div className={"tableHeader"}>
      <h2>Студенты</h2>
      <button className={"addButton"}
              onClick={onClickAdd}>
        <PlusIcon/>
        <div>Добавить студента</div>
      </button>
    </div>
    <GenericTable
      columns={columns.concat([additionalColumn])}
      data={[...students]}
      pageSize={5}
      keyExtractor={s => s.id}
      linkExtractor={s => `/teaching/students/${s.id}`}
      hideHeader={false}
    />
  </div>
}

export default StudentList
