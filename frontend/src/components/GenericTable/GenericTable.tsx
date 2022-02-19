import { useState } from "react"
import styles from "./GenericTable.module.css"
import PageSelector from "../PageSelector/PageSelector"
import { range } from "../../utils"
import classNames from "classnames"

import { ReactComponent as SortAscIcon } from '../../images/icons/sort-asc.svg'
import { ReactComponent as SortDescIcon } from '../../images/icons/sort-desc.svg'
import { useHistory, useRouteMatch } from "react-router-dom"

type GenericTableProps<T> = {
  columns: Array<Column<T>>
  data: Array<T>
  pageSize: number
  keyExtractor: (t: T) => string
  linkExtractor: ((t: T) => string) | null
  hideHeader: boolean,
  onClick?: (t: T) => void
}

export type Column<T> = {
  readableName: string
  name: string
  content: (t: T) => any
  sortable: boolean
  sortValue?: (t: T) => any
}

const GenericTable = <T extends {}, >({
                                        columns,
                                        data,
                                        pageSize,
                                        keyExtractor,
                                        linkExtractor,
                                        hideHeader,
                                        onClick
                                      }: GenericTableProps<T>) => {
  const [state, setState] = useState({
    sortDirIsDesc: false,
    sortColumn: 0,
    currentPage: 0
  })
  const history = useHistory()
  const match = useRouteMatch()

  const setSort = (index: number) => {
    setState((s) => {
      const newState = { ...s }
      newState.sortDirIsDesc = (index == s.sortColumn) ? (!s.sortDirIsDesc) : false
      newState.sortColumn = index
      newState.currentPage = 0
      return newState
    })
  }
  const sortingColumn = columns[state.sortColumn]
  const elementsToShow = data.sort((a, b) => {
    const resultMultiplier = state.sortDirIsDesc ? -1 : 1
    const aValue = sortingColumn.sortValue ? sortingColumn.sortValue(a) : sortingColumn.content(a)
    const bValue = sortingColumn.sortValue ? sortingColumn.sortValue(b) : sortingColumn.content(b)
    if (!aValue) return 1
    if (!bValue) return -1
    if (aValue > bValue) return 1 * resultMultiplier
    if (aValue < bValue) return -1 * resultMultiplier
    return 0
  })
  .slice(pageSize * state.currentPage, pageSize * (state.currentPage + 1))

  const selectPage = (page: number) => setState((s) => {
    const newState = { ...s }
    newState.currentPage = page
    return newState
  })
  const pagesCount = Math.floor((data.length + pageSize - 1) / pageSize)
  return <div className={styles.tableBlock}>
    <table className={styles.table}>
      {!hideHeader && <thead>
      <tr className={styles.row + " " + styles.header}>
        {columns.map((c, index) => {
          return <Header column={c} index={index} setSort={setSort} key={c.readableName}
                         sortDirIsDesc={index == state.sortColumn ? state.sortDirIsDesc : null}/>
        })}
      </tr>
      </thead>
      }
      <tbody>
      {
        elementsToShow.map(row => {
            return <tr
              className={classNames(styles.row, { [styles.clickable]: !!(linkExtractor || onClick) })}
              key={keyExtractor(row)}
              onClick={e => {
                onClick && onClick(row)
                if (!linkExtractor || e.defaultPrevented) return
                const path = linkExtractor(row)
                if (path.startsWith("/")) {
                  history.push(path)
                } else {
                  history.push(match.url + "/" + path)
                }
              }}>
              {
                columns.map((c, i) => {
                  return <td className={styles.cell}
                             key={keyExtractor(row) + "_" + i}>{c.content(row)}</td>
                })
              }
            </tr>
          }
        )
      }
      {
        pagesCount > 1 && range(0, Math.max(0, pageSize * (state.currentPage + 1) - data.length))
        .map(r => <tr className={classNames(styles.row, styles.emptyRow)} key={r}>{
          range(0, columns.length)
          .map(i => <td className={styles.cell} key={r+ "_" + i}></td>)
        }</tr>)
      }
      </tbody>
    </table>
    { pagesCount > 1 && <PageSelector currentPage={state.currentPage}
                  pagesCount={pagesCount}
                  setPage={selectPage}/> }
  </div>

}

const Header = <T, >({
                       column,
                       index,
                       sortDirIsDesc,
                       setSort
                     }: {
  column: Column<T>, index: number, sortDirIsDesc: boolean | null,
  setSort: (index: number) => void
}) => {
  const onClick = () => {
    setSort(index)
  }
  return <th
    key={column.readableName}
    onClick={() => column.sortable && onClick()}
    className={classNames(styles.headerCell, { [styles.clickable]: column.sortable })}
  >
    <div>
      {column.readableName} {sortDirIsDesc != null &&
        <span>{sortDirIsDesc ? <SortDescIcon/> : <SortAscIcon/>}</span>}
    </div>
  </th>
}

export default GenericTable
