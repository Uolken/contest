import styles from "./WorkListItem.module.css"
import { SolutionStatus, Work, WorkGroupAssignment, } from "../../../../../types"
import CircleCompletionBar from "../../../../../components/CircleCompletionBar/CircleCompletionBar"
import { ReactComponent as LockIcon } from "../../../../../images/icons/locked.svg"
import { DateTime } from "luxon"
import { Link } from "react-router-dom"
import TagList from "../../../../../components/TagList/TagList"
import { AssignmentStatus, assignmentStatus, fromDateString } from "../../../../../utils"
import React from "react"

//
// const WorkListItem = ({ work }: WorkListItemProps) => {
//   return <Link to={`/works/${work.id}`}>
//
//     <div className={styles.item}>
//       <div>
//         <div>{work.name}</div>
//         <div className={styles.tags}>
//           <TagList tags={work.problems.flatMap(p => p.tags)}/>
//         </div>
//       </div>
//       <div>
//         <div>
//           {/*<TaskGroupStatusBlock work={work}/>*/}
//         </div>
//       </div>
//       <div>
//         Преподователь: {work.author.firstName}
//       </div>
//     </div>
//   </Link>
// }

export enum Size {
  big,
  small
}

export const WorkStatusBlock = ({ assignment, size }: { assignment: WorkGroupAssignment, size?: Size }) => {
  const iconSize = size == Size.big ? 30 : 16
  const status = assignmentStatus(assignment)

  const start = fromDateString(assignment.start)

  if (status == AssignmentStatus.not_started) {
    return <div className={styles.taskCompletionBarLine}><LockIcon height={iconSize} width={iconSize}/> Доступ откроется {start!.toLocaleString(DateTime.DATETIME_SHORT)}</div>
  }


  if (status == AssignmentStatus.no_problems) {
    return <div>
      <div>
        Задач нет
      </div>
    </div>
  }
  if (status == AssignmentStatus.all_problems_solved) {
    return <div className={styles.taskCompletionBarLine}>
      <CircleCompletionBar
        total={assignment.work.problems.length}
        failed={assignment.work.problems.length}
        succeed={assignment.work.problems.length}
        size={size}
      />
      <div className={styles.tasksCompleted}>
        Все задачи решены
      </div>
    </div>
  }

  const end = assignment.end ? fromDateString(assignment.end) : null

  if (status == AssignmentStatus.closed) {
    return <div className={styles.taskCompletionBarLine}><LockIcon  height={iconSize} width={iconSize}/> Доступ закрыт c {end!.toLocaleString(DateTime.DATETIME_SHORT)}</div>
  }

  const finishedTaskCount = assignment.work.problems.filter(p => p.userSolutionInfo?.status == SolutionStatus.Accepted).length
  const failedTaskCount = assignment.work.problems.filter(p => p.userSolutionInfo?.status == SolutionStatus.FailedTest).length

  return <div>
    <div className={styles.taskCompletionBarLine}>
      <CircleCompletionBar
        total={assignment.work.problems.length}
        failed={failedTaskCount}
        succeed={finishedTaskCount}
        size={size}/>
      Выполнено {finishedTaskCount}/{assignment.work.problems.length} задач
    </div>
  </div>

}
