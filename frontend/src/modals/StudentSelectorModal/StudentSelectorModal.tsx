import { Group, User, UserRole } from "../../types"
import { useEffect, useState } from "react"
import graphQLApi from "../../api/graphQLApi"
import { GROUPS, USER_COUNT, USERS } from "../../api/queries"
import modalStyles from "../Modal.module.css"
import { ReactComponent as CrossIcon } from "../../images/icons/cross.svg"
import GenericTable, { Column } from "../../components/GenericTable/GenericTable"
import DynamicTable from "../../components/DynamicTable/DynamicTable"
import newGroupForm from "../../store/forms/newGroupForm"
import Button from "../../components/Button/Button"
import workManagementPage from "../../store/pages/workManagementPage"
import * as React from "react"


const columns: Array<Column<User>> = [
  {
    name: "id",
    readableName: "Id",
    sortable: true,
    content: s => s.id
  },
  { name: "firstName", readableName: "Имя", sortable: true, content: s => s.firstName },
  { name: "lastName", readableName: "Фамилия", sortable: true, content: s => s.lastName },
  { name: "email", readableName: "Email", sortable: true, content: s => s.email },
]
const PAGE_SIZE = 5

export default ({
                  excludedIds,
                  onSelect,
                  onClose,
                }: { excludedIds: Array<number>,
  onSelect: (u: User) => void, onClose: () => void }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [sortField, setSortField] = useState("name")
  const [sortDirIsDesc, setSortDirIsDesc] = useState(true)
  const [hasNoGroup, setHasNoGroup] = useState(true)

  const [users, setUsers] = useState<Array<User> | undefined>(undefined)
  const [userCount, setUserCount] = useState(0)

  useEffect(() => {
    graphQLApi(USERS, {
      selector: {
        course: undefined,
        groupName: undefined,
        nameOrEmail: undefined,
        pageSize: PAGE_SIZE,
        roles: [UserRole.Student],
        excludeIds: excludedIds.length > 0 ? excludedIds : null,
        currentPage,
        sortField,
        sortDirIsDesc,
        hasNoGroup
      }
    })
    .then(r => {
      setUsers(r.users)
    })
  }, [excludedIds, currentPage, sortField, sortDirIsDesc, hasNoGroup])
  useEffect(() => {
    graphQLApi(USER_COUNT, {
      selector: {
        course: undefined,
        groupName: undefined,
        nameOrEmail: undefined,
        pageSize: PAGE_SIZE,
        roles: [UserRole.Student],
        excludeIds: excludedIds.length > 0 ? excludedIds : null,
        currentPage,
        sortField,
        sortDirIsDesc,
        hasNoGroup
      }
    })
    .then(r => {
      setUserCount(r.userCount)
    })
  }, [excludedIds, hasNoGroup])


  if (!users) return <div>LOADING</div>

  return <>
    <div className={modalStyles.modalBack} onClick={onClose}></div>
    <div className={modalStyles.modal}>
      <div className={modalStyles.modalHeader}>
        <h1>Выбор студентов</h1>
        <div onClick={onClose} style={{ cursor: "pointer" }}>
          <CrossIcon/>
        </div>
      </div>
      <div className={"multirow-form"}>
        <label>
          <div>
            Скрыть студетов с группами:
          </div>
          <input type="checkbox"
                 checked={hasNoGroup}
                 onChange={e => {
                   setHasNoGroup(e.target.checked)
                 }}/>
        </label>
      </div>

      <div>

        {users ?
          <DynamicTable columns={columns} pageSize={PAGE_SIZE} keyExtractor={p => p.id} linkExtractor={null}
                        onClick={u => onSelect(u)}
                        hideHeader={false} elementsToShow={users}
                        pageCount={Math.ceil((userCount || 1) / PAGE_SIZE)} updatableProps={{
            currentPage,
            sortColumn: sortField,
            sortDirIsDesc
          }} hook={p => {
            setCurrentPage(p.currentPage)
            setSortField(p.sortColumn)
            setSortDirIsDesc(p.sortDirIsDesc)
          }}/> : <div>LOADING</div>}
      </div>

    </div>
  </>

}
