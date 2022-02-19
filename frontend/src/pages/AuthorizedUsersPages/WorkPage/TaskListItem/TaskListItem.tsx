import { Problem, SolutionStatus } from "../../../../types"
import styles from "./TaskListItem.module.css"
import TagList from "../../../../components/TagList/TagList"
import Button from "../../../../components/Button/Button"
import { useHistory } from "react-router-dom"
import workPage from "../../../../store/workPage"

type WorkListItemProps = { problem: Problem }

const WorkListItem = ({ problem }: WorkListItemProps) => {
  const history = useHistory()

  return <div className={styles.problemCard}>
    <div className={styles.cardHeader}>
      <div>
        {problem.name}
      </div>
      <div>{getStatusText(problem.userSolutionInfo?.status)}</div>
    </div>
    <div className={styles.cardContent}>
      <TagList tags={problem.tags}/>
    </div>
    <div className={styles.cardBottom}>
      <Button
        text={"Решить"}
        action={() => history.push(`/works/${workPage.work!.id}/problems/${problem.id}`)}/>
    </div>
  </div>
}

function getStatusText(status: SolutionStatus | undefined) {
  if (status == SolutionStatus.Accepted) {
    return "Решено"
  }
  return "Не решено"
}

export default WorkListItem
