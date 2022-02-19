import Card from "../../../../components/Card/Card"
import {
  ReactComponent as AvgScoreCardIcon
} from "../../../../images/icons/card/avg-score-card-icon.svg"

const CompletedWorks = ({ count }: { count: number | undefined }) => {
  if (count == undefined) return <div>LOADING</div>
  return <Card
    Icon={AvgScoreCardIcon}
    name={"Работ завершено"}
    value={count.toString()}
    bottomLinkText={"Контрольные работы"}
    // bottomLink={"/works?status=completed"}
  />
}

export default CompletedWorks
