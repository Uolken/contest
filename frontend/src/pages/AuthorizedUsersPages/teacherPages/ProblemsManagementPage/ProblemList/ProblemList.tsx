import { BooleanParam, NumberParam, StringParam, useQueryParam } from "use-query-params"
import { Problem } from "../../../../../types"
import problemsManagementPage from "../../../../../store/pages/problemsManagementPage"
import { useEffect } from "react"
import DynamicTable from "../../../../../components/DynamicTable/DynamicTable"
import { Column } from "../../../../../components/GenericTable/GenericTable"
import { observer } from "mobx-react-lite"
import TagList from "../../../../../components/TagList/TagList"
import BigLoading from "../../../../../components/BigLoading/BigLoading"

const PAGE_SIZE = 10

const columns: Array<Column<Problem>> = [
  { name: "name", readableName: "Название", sortable: true, content: p => p.name },
  { name: "tags", readableName: "Теги", sortable: false, content: p => <TagList tags={p.tags}/> },
]

const ProblemList = observer(() => {
  const [name, setName] = useQueryParam('name', StringParam)
  const [currentPage, setCurrentPage] = useQueryParam('currentPage', NumberParam)
  const [sortColumn, setSortColumn] = useQueryParam('sortColumn', StringParam)
  const [sortDirIsDesc, setSortDirIsDesc] = useQueryParam('sortDirIsDesc', BooleanParam)

  const updatableProps = {
    currentPage: currentPage ? currentPage : 0,
    sortColumn: sortColumn || "lastName",
    sortDirIsDesc: sortDirIsDesc || false
  }

  const updateProblems = () => {
    problemsManagementPage.fetchProblems({
      pageSelector: {
        pageSize: PAGE_SIZE,
        currentPage: updatableProps.currentPage,
        sortField: updatableProps.sortColumn,
        sortDirIsDesc: updatableProps.sortDirIsDesc
      },
      problemSelector: {}
    })
  }

  useEffect(updateProblems, [currentPage, sortColumn, sortDirIsDesc])

  const problems = problemsManagementPage.problems
  if (!problems) return <BigLoading/>
  const problemCount = problemsManagementPage.problemCount
  const pageCount = problemCount ? Math.ceil(problemCount / PAGE_SIZE) : undefined
  return <div>
    <DynamicTable columns={columns} linkExtractor={p => `/teaching/problems/${p.id}`}
                  keyExtractor={p => p.id} pageCount={pageCount} pageSize={PAGE_SIZE} hideHeader={false}
                  elementsToShow={problems} updatableProps={updatableProps} hook={p => {
      setCurrentPage(p.currentPage)
      setSortColumn(p.sortColumn)
      setSortDirIsDesc(p.sortDirIsDesc)
    }}/>
  </div>
})

export default ProblemList
