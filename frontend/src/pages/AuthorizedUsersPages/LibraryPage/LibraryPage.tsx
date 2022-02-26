import { observer } from "mobx-react-lite"
import BreadCrumbs from "../../../components/BreadCrumbs/BreadCrumbs"
import libraryPage from "../../../store/libraryPage"
import { useEffect, useState } from "react"
import { ArrayParam, BooleanParam, NumberParam, StringParam, useQueryParam } from "use-query-params"
import DynamicTable from "../../../components/DynamicTable/DynamicTable"
import { Column } from "../../../components/GenericTable/GenericTable"
import { Problem } from "../../../types"
import TagList from "../../../components/TagList/TagList"
import graphQLApi from "../../../api/graphQLApi"
import { PROBLEM_COUNT, PROBLEMS } from "../../../api/queries"
import BigLoading from "../../../components/BigLoading/BigLoading"

const columns: Array<Column<Problem>> = [
  {
    name: "name",
    readableName: "Название",
    sortable: true,
    content: p => p.name
  },
  {
    name: "tags",
    readableName: "Теги",
    sortable: false,
    content: p => <TagList tags={p.tags}/>
  },
]
const PAGE_SIZE = 10

const LibraryPage = observer(() => {

  useEffect(() => libraryPage.fetchProblems(), [])
  const [currentPage, setCurrentPage] = useQueryParam('currentPage', NumberParam)
  const [sortColumn, setSortColumn] = useQueryParam('sortColumn', StringParam)
  const [sortDirIsDesc, setSortDirIsDesc] = useQueryParam('sortDirIsDesc', BooleanParam)
  const [tagIds, setTagIds] = useQueryParam('tag', ArrayParam)
  const [problems, setProblems] = useState<Array<Problem>>()
  const [problemCount, setProblemCount] = useState<number>()

  const updatableProps = {
    currentPage: currentPage ? currentPage : 0,
    sortColumn: sortColumn || "name",
    sortDirIsDesc: sortDirIsDesc || false
  }

  const selector = {
    pageSelector: {
      pageSize: PAGE_SIZE,
      currentPage: updatableProps.currentPage,
      sortField: updatableProps.sortColumn,
      sortDirIsDesc: updatableProps.sortDirIsDesc
    },
    problemSelector: {
      tagIds
    }
  }

  useEffect(() => {
    graphQLApi(PROBLEMS, { selector })
    .then(r => setProblems(r.problems))
    graphQLApi(PROBLEM_COUNT, { selector: selector.problemSelector })
    .then(r => setProblemCount(r.problemCount))
  }, [currentPage, sortColumn, sortDirIsDesc, tagIds])

  const pageCount = problemCount ? Math.ceil(problemCount || 0 / PAGE_SIZE) : undefined
  return <div className="page">
    <BreadCrumbs elements={[{
      name: "Библитека",
      url: "/library"
    }]}/>
    <div><h1>Библиотека задач</h1></div>
    {problems !== undefined ? <DynamicTable columns={columns} linkExtractor={p => `/library/${p.id}`}
                  keyExtractor={p => p.id} pageCount={pageCount} pageSize={PAGE_SIZE}
                  hideHeader={false}
                  elementsToShow={problems} updatableProps={updatableProps} hook={p => {
      setCurrentPage(p.currentPage)
      setSortColumn(p.sortColumn)
      setSortDirIsDesc(p.sortDirIsDesc)
    }}/> : <BigLoading/> }
  </div>
})

export default LibraryPage
