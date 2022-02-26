import { ReactComponent as TaskCardIcon } from '../../../../images/icons/card/tasks-card-icon.svg'
import Card from "../../../../components/Card/Card"
import { Audio, Circles, TailSpin } from 'react-loader-spinner'
import SmallLoading from "../../../../components/SmallLoading/SmallLoading"

const WorkCountCard = ({workCount}: {workCount: number | undefined}) => {
  if (workCount == undefined) return <SmallLoading/>
  return <Card
    Icon={TaskCardIcon}
    name={"Работы"}
    value={workCount.toString()}
    bottomLinkText={"Перейти к выполнению"}
    bottomLink={"/works?status=todo"}/>
}

export default WorkCountCard
