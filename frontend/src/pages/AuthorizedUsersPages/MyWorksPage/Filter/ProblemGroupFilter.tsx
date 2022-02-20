import styles from "./TaskGroupFilter.module.css"
import { AssignmentStatus } from "../../../../utils"
import classNames from "classnames"
import { useState } from "react"

const options = [
  {name: "todo", title:"К выполнению", statuses: [AssignmentStatus.in_progress]},
  {name: "all", title:"Все", statuses: [AssignmentStatus.not_started, AssignmentStatus.in_progress, AssignmentStatus.closed, AssignmentStatus.all_problems_solved]},
  {name: "planed", title:"Запланировано", statuses: [AssignmentStatus.not_started, AssignmentStatus.in_progress]},
]

const ProblemGroupFilter = ({onChange}: {onChange: (s: Array<AssignmentStatus>) => void}) => {
  const [selected, setSelected] = useState("todo")
  return (
    <div className={styles.filter}>
      {options.map(o =>
        <div className={classNames(styles.option, {[styles.selectedOption]: o.name == selected})} key={o.name} onClick={e => {
          setSelected(o.name)
          onChange(o.statuses)
        }}>
          <div className={styles.name}>
            {o.title}
          </div>
        </div>)
      }
    </div>
  )
}

export default ProblemGroupFilter
