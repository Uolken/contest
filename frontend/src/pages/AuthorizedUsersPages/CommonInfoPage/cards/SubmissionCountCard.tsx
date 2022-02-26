import Card from "../../../../components/Card/Card"
import { ReactComponent as ExpiredTasksCardIcon } from "../../../../images/icons/card/expired-tasks-card-icon.svg"
import SmallLoading from "../../../../components/SmallLoading/SmallLoading"
import React from "react"

const SubmissionCountCard = ({count}:{count: number | undefined}) => {
  if (count == undefined) return <SmallLoading/>
  return <Card
    Icon={ExpiredTasksCardIcon}
    name={"Решений отправлено"}
    value={count.toString()}
    bottomLinkText={"Смотреть"}
    bottomLink={"/submissions"}/>
}

export default SubmissionCountCard
