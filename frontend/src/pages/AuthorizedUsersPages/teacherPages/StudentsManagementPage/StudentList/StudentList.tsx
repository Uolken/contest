import { Column } from "../../../../../components/GenericTable/GenericTable"
import { BooleanParam, NumberParam, StringParam, useQueryParam } from "use-query-params"
import DynamicTable from "../../../../../components/DynamicTable/DynamicTable"
import { User, UserRole } from "../../../../../types"
import { observer } from "mobx-react-lite"
import studentsManagementPage from "../../../../../store/studentsManagementPage"
import { useEffect } from "react"

const PAGE_SIZE = 5

const columns: Array<Column<User>> = [
  {
    readableName: "Id",
    name: "id",
    content: s => s.id,
    sortable: true
  },
  {
    readableName: "Имя",
    name: "firstName",
    content: s => s.firstName,
    sortable: true
  },
  {
    readableName: "Фамилия",
    name: "lastName",
    content: s => s.lastName,
    sortable: true
  },
  {
    readableName: "Email",
    name: "email",
    content: s => s.email,
    sortable: true
  },
  {
    readableName: "Название группы",
    name: "groupName",
    content: s => s.group?.name,
    sortable: true
  },
]

const StudentList = observer(() => {
  const [nameOrEmail, setNameOrEmail] = useQueryParam('nameOrEmail', StringParam)
  const [currentPage, setCurrentPage] = useQueryParam('currentPage', NumberParam)
  const [sortColumn, setSortColumn] = useQueryParam('sortColumn', StringParam)
  const [sortDirIsDesc, setSortDirIsDesc] = useQueryParam('sortDirIsDesc', BooleanParam)

  const updatableProps = {
    currentPage: currentPage ? currentPage : 0,
    sortColumn: sortColumn ? sortColumn : "lastName",
    sortDirIsDesc: sortDirIsDesc ? sortDirIsDesc : false
  }

  const updateStudents = () => {
    studentsManagementPage.fetchStudents({
      pageSize: PAGE_SIZE,
      sortDirIsDesc: updatableProps.sortDirIsDesc,
      sortField: updatableProps.sortColumn,
      currentPage: updatableProps.currentPage,
      course: null,
      groupName: null,
      nameOrEmail: nameOrEmail,
      roles: [UserRole.Student, UserRole.Teacher]
    })
  }

  useEffect(updateStudents, [nameOrEmail, updatableProps.sortColumn, updatableProps.sortDirIsDesc, updatableProps.currentPage,])

  const elementsToShow = studentsManagementPage.students
  if (!elementsToShow) return <div>LOADING</div>
  const studentCount = studentsManagementPage.studentCount
  const pageCount = studentCount ? Math.ceil(studentCount / PAGE_SIZE) : undefined
  return <div>
    Поиск:
    <input type="text" value={nameOrEmail ? nameOrEmail : ""}
           onChange={n => {
             setNameOrEmail(n.target.value)
           }}/>
    <DynamicTable columns={columns} linkExtractor={s => `/teaching/students/${s.id}`}
                  keyExtractor={s => s.id}
                  pageCount={pageCount}
                  elementsToShow={elementsToShow} hook={p => {
      setCurrentPage(p.currentPage)
      setSortColumn(p.sortColumn)
      setSortDirIsDesc(p.sortDirIsDesc)

    }}
                  updatableProps={updatableProps} pageSize={PAGE_SIZE} hideHeader={false}/>
  </div>
})

export default StudentList
