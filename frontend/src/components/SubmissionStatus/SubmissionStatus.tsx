import { SubmissionStatus } from "../../types"
import { ReactComponent as FailedCircleIcon } from "../../images/icons/failed-circle-bar.svg"
import { ReactComponent as CompletedCircleIcon } from "../../images/icons/completed-circle-bar.svg"
import { ReactComponent as ClockIcon } from "../../images/icons/clock-icon.svg"
import styles from "./SubmissionStatus.module.css"

export default ({status}:{status: SubmissionStatus}) => {
  let icon
  let text
  if (status == SubmissionStatus.Failed) {
    icon = <FailedCircleIcon/>
    text = "Ошибка"
  }
  if (status == SubmissionStatus.Succeed) {
    icon = <CompletedCircleIcon/>
    text = "Выполнено"
  }
  if (status == SubmissionStatus.ToTest) {
    icon = <ClockIcon/>
    text = "В очереди"
  }
  if (status == SubmissionStatus.ToTest) {
    icon = <ClockIcon/>
    text = "Выполняется"
  }
  return <div className={styles.statusBlock}>
      {icon}
    <div>
      {text}
    </div>
  </div>
}
