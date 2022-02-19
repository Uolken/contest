import { Problem } from "../../../../../types"
import GenericTable, { Column } from "../../../../../components/GenericTable/GenericTable"
import Button from "../../../../../components/Button/Button"
import TagList from "../../../../../components/TagList/TagList"
import styles from "../../WorkCreationPage/WorkCreationPage.module.css"
import workCreationPage from "../../../../../store/pages/workCreationPage"
import { ReactComponent as PlusIcon } from "../../../../../images/icons/plus-icon.svg"
import * as React from "react"
import workManagementPage from "../../../../../store/pages/workManagementPage"

const columns: Array<Column<Problem>> = [
  {
    name: "name",
    readableName: "Название",
    sortable: true,
    content: p => p.name
  },
  { name: "tags", readableName: "Теги", sortable: false, content: p => <TagList tags={p.tags}/> },
  { name: "", readableName: "", sortable: false, content: p => <div className={"rightButton"}><Button action={() => { workManagementPage.removeProblem(p.id) }} text={"Убрать"}/> </div>},
]

const ProblemsList = ({ problems }: { problems: Array<Problem> }) => {
  return <div>
    <div className={"tableHeader"}>
      <h2>Задачи</h2>
      <button className={"addButton"}
              onClick={() => workManagementPage.showProblemSelector = true}>
        <PlusIcon/>
        <div>Добавить задачу</div>
      </button>
    </div>
    <GenericTable columns={columns} pageSize={5} keyExtractor={p => p.id} linkExtractor={p => `/teaching/problems/${p.id}`}
                  hideHeader={false} data={problems}/>
  </div>
}

export default ProblemsList
