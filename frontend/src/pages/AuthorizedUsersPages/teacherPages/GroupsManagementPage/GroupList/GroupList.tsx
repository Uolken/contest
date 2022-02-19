import { observer } from "mobx-react-lite"
import groupList from "../../../../../store/components/groupList"
import { useEffect } from "react"
import GenericTable, { Column } from "../../../../../components/GenericTable/GenericTable"
import { Group } from "../../../../../types"

const columns: Array<Column<Group>> = [
  {
    readableName: "Id",
    name: "id",
    content: (g) => g.id,
    sortable: true
  },
  {
    readableName: "Название",
    name: "count",
    content: (g) => g.name,
    sortable: true
  },
  {
    readableName: "Количество студентов",
    name: "studentCount",
    content: (g) => g.students.length,
    sortable: true
  }

]

const GroupList = observer(() => {
  useEffect(() => groupList.fetchGroups(), [])
  const groups = groupList.groups

  if (!groups) return <div>LOADING</div>

  return <div>
    <h3>Список групп</h3>
    <GenericTable columns={columns} data={groups} pageSize={7} keyExtractor={(g) => g.id}
                  linkExtractor={g => `/teaching/groups/${g.id}`}
    hideHeader={false}/>
  </div>
})

export default GroupList
