import { useEffect, useState } from "react"
import { Problem } from "../../types"
import modalStyles from "../Modal.module.css"
import { ReactComponent as CrossIcon } from "../../images/icons/cross.svg"
import graphQLApi from "../../api/graphQLApi"
import { PROBLEM_COUNT, PROBLEMS } from "../../api/queries"
import { Column } from "../../components/GenericTable/GenericTable"
import TagList from "../../components/TagList/TagList"
import DynamicTable from "../../components/DynamicTable/DynamicTable"
import SmallLoading from "../../components/SmallLoading/SmallLoading"

const PAGE_SIZE = 5

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

export default ({
                  excludedIds,
                  onSelect,
                  onClose
                }: { excludedIds: Array<number>, onSelect: (p: Problem) => void, onClose: () => void }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [sortField, setSortField] = useState("name")
  const [sortDirIsDesc, setSortDirIsDesc] = useState(true)

  const [problems, setProblems] = useState<Array<Problem> | undefined>(undefined)
  const [problemCount, setProblemCount] = useState<number | undefined>(undefined)

  const problemSelector = {
    excludeIds: excludedIds
  }

  useEffect(() => {
    graphQLApi(PROBLEMS, {
      selector: {
        pageSelector: {
          pageSize: 5,
          currentPage,
          sortField,
          sortDirIsDesc
        },
        problemSelector
      }
    })
    .then(r => {
      setProblems(r.problems)
    })
    graphQLApi(PROBLEM_COUNT, { selector: problemSelector })
    .then(r => setProblemCount(r.problemCount))
  }, [currentPage, sortField, sortDirIsDesc, excludedIds])

  return <>
    <div className={modalStyles.modalBack} onClick={onClose}></div>
    <div className={modalStyles.modal}>
      <div className={modalStyles.modalHeader}>
        <h1>Выбор задачи</h1>
        <div onClick={onClose} style={{cursor: "pointer"}}>
          <CrossIcon/>
        </div>
      </div>
      <div>

        {problems ?
          <DynamicTable columns={columns} pageSize={5} keyExtractor={p => p.id} linkExtractor={null}
                        onClick={p => onSelect(p)}
                        hideHeader={false} elementsToShow={problems}
                        pageCount={Math.ceil((problemCount || 1) / PAGE_SIZE)} updatableProps={{
            currentPage,
            sortColumn: sortField,
            sortDirIsDesc
          }} hook={p => {
            setCurrentPage(p.currentPage)
            setSortField(p.sortColumn)
            setSortDirIsDesc(p.sortDirIsDesc)
          }}/> : <SmallLoading/>}
      </div>

    </div>
  </>

}
