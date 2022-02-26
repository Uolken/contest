import { Problem, Work } from "../../types"
import { useEffect, useState } from "react"
import graphQLApi from "../../api/graphQLApi"
import { PROBLEM_COUNT, PROBLEMS, WORKS, WORK_COUNT } from "../../api/queries"
import modalStyles from "../Modal.module.css"
import { ReactComponent as CrossIcon } from "../../images/icons/cross.svg"
import DynamicTable from "../../components/DynamicTable/DynamicTable"
import { Column } from "../../components/GenericTable/GenericTable"
import { DateTime } from "luxon"
import { fromDateString } from "../../utils"
import SmallLoading from "../../components/SmallLoading/SmallLoading"
import * as React from "react"

const PAGE_SIZE = 5

const columns: Array<Column<Work>> = [
  {name: "name", readableName: "Название", sortable: true, content: w => w.name },

  {
    readableName: "Начало",
    name: "start",
    content: a => fromDateString(a.start)?.toLocaleString(DateTime.DATE_MED) || "",
    sortable: true,
  },
  {
    readableName: "Конец",
    name: "end",
    content: a => fromDateString(a.end)?.toLocaleString(DateTime.DATE_MED) || "",
    sortable: true,
  },

]

export default ({
                  excludedIds,
                  onSelect,
                  onClose
                }: { excludedIds: Array<number>, onSelect: (p: Work) => void, onClose: () => void }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [sortField, setSortField] = useState("name")
  const [sortDirIsDesc, setSortDirIsDesc] = useState(true)

  const [works, setWorks] = useState<Array<Work> | undefined>(undefined)
  const [workCount, serWorkCount] = useState(0)

  const workSelector = {
    excludeIds: excludedIds,
    ended: false
  }

  useEffect(() => {
    graphQLApi(WORKS, {
      selector: {
        pageSelector: {
          pageSize: 5,
          currentPage,
          sortField,
          sortDirIsDesc
        },
        workSelector
      }
    })
    .then(r => {
      setWorks(r.works)
    })
    graphQLApi(WORK_COUNT, { selector: workSelector })
    .then(r => serWorkCount(r.workCount))
  }, [currentPage, sortField, sortDirIsDesc, excludedIds])

  return <>
    <div className={modalStyles.modalBack} onClick={onClose}></div>
    <div className={modalStyles.modal}>
      <div className={modalStyles.modalHeader}>
        <h1>Выбор работы</h1>
        <div onClick={onClose} style={{ cursor: "pointer" }}>
          <CrossIcon/>
        </div>
      </div>
      <div>

        {works ?
          <DynamicTable columns={columns} pageSize={PAGE_SIZE} keyExtractor={w => w.id}
                        onClick={w => onSelect(w)}
                        hideHeader={false} elementsToShow={works}
                        pageCount={Math.ceil((workCount || 1) / PAGE_SIZE)} updatableProps={{
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
