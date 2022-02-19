import Card from "../../../../components/Card/Card"
import { ReactComponent as ExpiredTasksCardIcon } from "../../../../images/icons/card/expired-tasks-card-icon.svg"

const SubmissionCountCard = ({count}:{count: number}) => {
  return <Card
    Icon={ExpiredTasksCardIcon}
    name={"Решений отправлено"}
    value={count.toString()}
    bottomLinkText={"Смотреть"}
    bottomLink={"/subimssions"}/>
}

export default SubmissionCountCard
