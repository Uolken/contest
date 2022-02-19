import { Group } from "../../types"
import { useEffect, useState } from "react"
import graphQLApi from "../../api/graphQLApi"
import { GROUPS } from "../../api/queries"
import modalStyles from "../Modal.module.css"
import { ReactComponent as CrossIcon } from "../../images/icons/cross.svg"
import GenericTable, { Column } from "../../components/GenericTable/GenericTable"

const columns: Array<Column<Group>> = [
  {
    name: "id",
    readableName: "Id",
    sortable: true,
    content: g => g.id
  },
  {
    name: "name",
    readableName: "Название",
    sortable: true,
    content: g => g.name
  },
  // {name: "name", readableName: "Название", sortable: true, content: g => g.},
]

const PAGE_SIZE = 5

export default ({
                  excludedIds,
                  onSelect,
                  onClose
                }: { excludedIds: Array<number>, onSelect: (g: Group) => void, onClose: () => void }) => {
  // const [currentPage, setCurrentPage] = useState(0)
  // const [sortField, setSortField] = useState("name")
  // const [sortDirIsDesc, setSortDirIsDesc] = useState(true)

  const [groups, setGroups] = useState<Array<Group> | undefined>(undefined)

  useEffect(() => {
    graphQLApi(GROUPS, {})
    .then(r => {
      setGroups(r.groups)
    })
  }, [])

  if (!groups) return <div>LOADING</div>

  const data = groups.filter(g => !excludedIds.includes(g.id))

  return <>
    <div className={modalStyles.modalBack} onClick={onClose}></div>
    <div className={modalStyles.modal}>
      <div className={modalStyles.modalHeader}>
        <h1>Выбор группы</h1>
        <div onClick={onClose} style={{ cursor: "pointer" }}>
          <CrossIcon/>
        </div>
      </div>
      <div>
        <GenericTable columns={columns} pageSize={PAGE_SIZE} hideHeader={false} linkExtractor={null}
                      onClick={onSelect}
                      keyExtractor={g => g.id} data={data}/>
      </div>

    </div>
  </>

}
