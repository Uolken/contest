import React from 'react'
import styles from './SelectedDayActions.module.css'
import { WorkGroupAssignment } from "../../../types"
import { DateTime  } from "luxon"

import { ReactComponent as TasksIcon } from '../../../images/icons/tasks-icon.svg'
import { ReactComponent as NoWorksIcon } from '../../../images/icons/no-works-icon.svg'
import { Link } from 'react-router-dom'
import { fromDateString } from "../../../utils"

const SelectedDayActions = ({ assignments, selectedDate }: { assignments: Array<WorkGroupAssignment> | undefined, selectedDate: DateTime }) => {

  const assignmentsToShow = assignments?.filter(a => {
    const start = a.start ? +fromDateString(a.start)!.startOf("day") : 0
    const end = a.end ? +fromDateString(a.end)!.startOf("day") : 0
    return +selectedDate == start || +selectedDate == end
  })
  return <div className={styles.selectedDayActions}>
    <div className={styles.actionsHeader}>{selectedDate.toLocaleString({month: "long", day: "numeric", weekday: "long"})}</div>
    <div className={styles.actionsList}>
      {assignmentsToShow ? <div>
        {assignmentsToShow.map(a => <ActionRow assignment={a}/>)}
      </div>: <div>LOADING</div>}
      {assignmentsToShow && assignmentsToShow.length == 0 && <div className={styles.noActions}><NoWorksIcon/><div>Нет событий</div></div>}
      <div/>
    </div>

  </div>
}

const ActionRow = ({assignment}: {assignment: WorkGroupAssignment}) => {
  const start = assignment.start ? fromDateString(assignment.start) : null
  const end = assignment.end ? fromDateString(assignment.end) : null

  let timeStr
  if (start?.day == end?.day){
    timeStr = `${start?.toLocaleString({timeStyle: "short"})} - ${end?.toLocaleString({timeStyle: "short"})}`
  } else if (start){
    timeStr = `Начало работы в ${start.toLocaleString({timeStyle: "short"})}`
  } else {
    timeStr = `Сдача работы в ${end!.toLocaleString({timeStyle: "short"})}`
  }

  return <div className={styles.action}>
    <div className={styles.actionIcon}>
      <TasksIcon/>
    </div>
    <div className={styles.actionDescription}>
      <div>
        <Link to={`/works/${assignment.work.id}`}>{assignment.work.name}</Link>
      </div>
      <div className={styles.actionTime}>
        {timeStr}
      </div>
    </div>
  </div>
}

export default SelectedDayActions
