import { SolutionInfo, SolutionStatus } from "../../types"
import { ReactComponent as CompletedCircleIcon } from "../../images/icons/completed-circle-bar.svg"
import { ReactComponent as FailedCircleIcon } from "../../images/icons/failed-circle-bar.svg"

const statusMapper = (solutionInfo: SolutionInfo | undefined | null) => {
  if (!solutionInfo) {
    return "Нет попыток"
  }
  if (solutionInfo.status == SolutionStatus.Accepted) {
    return "Принято"
  }
  if (solutionInfo.status == SolutionStatus.FailedTest) {
    return "Ошибка на тестах"
  }
  if (solutionInfo.status == SolutionStatus.ToTest) {
    return "В очереди на проверку"
  }
  if (solutionInfo.status == SolutionStatus.Testing) {
    return "Выполняется проверка"
  }
  else "Неопознанный статус"
}

const defaultContent: { status: SolutionStatus, text: string, icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>} =
  {status: SolutionStatus.NotSubmitted, text: "Нет попыток"}

const statusesContent: Array<{ status: SolutionStatus, text: string, icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>> }> = [
  {status: SolutionStatus.Accepted, text: "Принято", icon: CompletedCircleIcon},
  {status: SolutionStatus.FailedTest, text: "Ошибка", icon: FailedCircleIcon},
  {status: SolutionStatus.NotSubmitted, text: "Нет попыток"}
]

const ProblemStatus = ({solutionInfo}: {solutionInfo: SolutionInfo | undefined | null}) => {
  const content = statusesContent.find(c => c.status == solutionInfo?.status) || defaultContent
  const Icon = content.icon
  return <div style={{display: "flex", gap: 7}}>
    {Icon && <Icon height={20} width={20} />}{content.text}
  </div>
}

export default ProblemStatus
