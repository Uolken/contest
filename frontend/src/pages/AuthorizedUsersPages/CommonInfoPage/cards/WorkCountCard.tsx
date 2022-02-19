import { ReactComponent as TaskCardIcon } from '../../../../images/icons/card/tasks-card-icon.svg'
import Card from "../../../../components/Card/Card"

const WorkCountCard = ({workCount}: {workCount: number | undefined}) => {
  if (workCount == undefined) return <div>LOADING</div>
  return <Card
    Icon={TaskCardIcon}
    name={"Работы"}
    value={workCount.toString()}
    bottomLinkText={"Перейти к выполнению"}
    bottomLink={"/works?status=todo"}/>
}

export default WorkCountCard
