import { Column } from "../GenericTable/GenericTable"
import styles from "../GenericTable/GenericTable.module.css"
import { ReactComponent as SortDescIcon } from "../../images/icons/sort-desc.svg"
import { ReactComponent as SortAscIcon } from "../../images/icons/sort-asc.svg"
import { useHistory } from "react-router-dom"
import PageSelector from "../PageSelector/PageSelector"
import { range } from "../../utils"
import classNames from "classnames"

export type DynamicTableProps<T, K> = {
  columns: Array<Column<T>>
  elementsToShow: Array<T>
  keyExtractor: (t: T) => string
  linkExtractor?: ((t: T) => string) | null
  updatableProps: UpdatableProps
  hook: (k: UpdatableProps) => void
  pageCount: number | undefined
  pageSize: number
  hideHeader: boolean
  onClick?: (t: T) => void
}

export type UpdatableProps = {
  currentPage: number
  sortColumn: string
  sortDirIsDesc: boolean
}

const DynamicTable = <T, K>({
                              columns,
                              updatableProps,
                              elementsToShow,
                              keyExtractor,
                              linkExtractor,
                              hook,
                              pageCount,
                              pageSize,
                              hideHeader = false,
                              onClick
                            }: DynamicTableProps<T, K>) => {
  const history = useHistory()
  const selectPage = (p: number) => {
    updatableProps.currentPage = p
    hook(updatableProps)
  }
  return <div className={styles.tableBlock}>
    <table className={styles.table}>
      {!hideHeader && <thead>
      <tr className={styles.row + " " + styles.header}>
        {columns.map((c, index) => {
          return <Header
            column={c} setSort={(s) => {
            updatableProps.sortDirIsDesc = updatableProps.sortColumn == c.name && !updatableProps.sortDirIsDesc
            updatableProps.sortColumn = s
            updatableProps.currentPage = 0
            hook(updatableProps)
          }} key={c.readableName}
            sortDirIsDesc={c.name == updatableProps.sortColumn ? updatableProps.sortDirIsDesc : null}/>
        })
        }
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
                linkExtractor && history.push(linkExtractor(row))
              }}>
              {
                columns.map((c, i) => {
                  return <td className={styles.cell}
                             key={keyExtractor(row) + "_" + columns[i].readableName}>{c.content(row)}</td>
                })
              }
            </tr>
          }
        )
      }
      {
        pageCount && pageCount > 1 && range(0, Math.max(0, pageSize - elementsToShow.length))
        .map(r => <tr className={classNames(styles.emptyRow)} key={r}>{
          range(0, columns.length)
          .map(i => <td className={styles.cell} key={r + "_" + i}></td>)
        }</tr>)
      }
      </tbody>
    </table>
    {pageCount && pageCount > 1 && <PageSelector currentPage={updatableProps.currentPage}
                                                 pagesCount={pageCount}
                                                 setPage={selectPage}/>
    }
  </div>
}

const Header = <T, >({
                       column,
                       sortDirIsDesc,
                       setSort
                     }: {
  column: Column<T>, sortDirIsDesc: boolean | null,
  setSort: (index: string) => void
}) => {
  const onClick = () => {
    setSort(column.name)
  }
  return <th
    key={column.name}
    onClick={() => onClick()}
    className={classNames(styles.headerCell, { [styles.clickable]: column.sortable })}
  >
    <div>
      {column.readableName} {sortDirIsDesc != null &&
        <span>{sortDirIsDesc ? <SortDescIcon/> : <SortAscIcon/>}</span>}
    </div>
  </th>
}

export default DynamicTable
