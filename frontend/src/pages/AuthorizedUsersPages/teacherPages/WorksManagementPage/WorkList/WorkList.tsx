import { Column } from "../../../../../components/GenericTable/GenericTable"
import { BooleanParam, NumberParam, StringParam, useQueryParam } from "use-query-params"
import DynamicTable from "../../../../../components/DynamicTable/DynamicTable"
import { Work } from "../../../../../types"
import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import worksManagementPage from "../../../../../store/pages/worksManagementPage"
import { DateTime } from "luxon"
import { fromDateString } from "../../../../../utils"
import BigLoading from "../../../../../components/BigLoading/BigLoading"

const PAGE_SIZE = 10

const columns: Array<Column<Work>> = [
  {
    readableName: "Id",
    name: "id",
    content: s => s.id,
    sortable: true
  },
  {
    readableName: "Название",
    name: "name",
    content: w => w.name,
    sortable: true
  },
  {
    name: "start",
    readableName: "Начало",
    sortable: true,
    content: a => fromDateString(a.start)
    ?.toLocaleString(DateTime.DATETIME_SHORT) || "",
    sortValue: a => +(fromDateString(a.start) || 0)
  },
  {
    name: "end",
    readableName: "Конец",
    sortable: true,
    content: a => fromDateString(a.end)
    ?.toLocaleString(DateTime.DATETIME_SHORT) || "",
    sortValue: a => +(fromDateString(a.end) || 0)
  },
  {
    readableName: "Задачи",
    name: "problemCount",
    content: w => w.problems.length,
    sortable: true
  },
]

const WorkList = observer(() => {
  const [currentPage, setCurrentPage] = useQueryParam('currentPage', NumberParam)
  const [sortColumn, setSortColumn] = useQueryParam('sortColumn', StringParam)
  const [sortDirIsDesc, setSortDirIsDesc] = useQueryParam('sortDirIsDesc', BooleanParam)

  const updatableProps = {
    currentPage: currentPage ? currentPage : 0,
    sortColumn: sortColumn ? sortColumn : "lastName",
    sortDirIsDesc: sortDirIsDesc ? sortDirIsDesc : false
  }

  const updateWorks = () => {
    worksManagementPage.fetchWorks({
      pageSelector: {
        pageSize: PAGE_SIZE,
        sortDirIsDesc: updatableProps.sortDirIsDesc,
        currentPage: updatableProps.currentPage,
        sortField: updatableProps.sortColumn
      },
      workSelector: {

      }
    })
  }

  useEffect(updateWorks, [updatableProps.sortColumn, updatableProps.sortDirIsDesc, updatableProps.currentPage,])

  const elementsToShow = worksManagementPage.works
  if (!elementsToShow) return <BigLoading/>
  const workCount = worksManagementPage.workCount
  const pageCount = workCount ? Math.ceil(workCount / PAGE_SIZE) : undefined
  return <div>
    <DynamicTable columns={columns} linkExtractor={w => `/teaching/works/${w.id}`}
                  keyExtractor={w => w.id}
                  pageCount={pageCount}
                  elementsToShow={elementsToShow} hook={p => {
      setCurrentPage(p.currentPage)
      setSortColumn(p.sortColumn)
      setSortDirIsDesc(p.sortDirIsDesc)

    }}
                  updatableProps={updatableProps} pageSize={PAGE_SIZE} hideHeader={false}/>
  </div>
})

export default WorkList
