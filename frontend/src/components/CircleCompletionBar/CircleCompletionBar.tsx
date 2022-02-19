import { ReactComponent as CompletedCircleIcon } from "../../images/icons/completed-circle-bar.svg"
import styles from './CircleCompletionBar.module.css'
import {
  Size
} from "../../pages/AuthorizedUsersPages/MyWorksPage/WorkList/WorkListItem/WorkListItem"

type CircleCompletionBarPros = {
  total: number
  succeed: number
  failed: number
  size?: Size
}

export enum CircleCompletionBarSize {
  default,
  big
}

const SIZE = 20
const STROKE_WIDTH = 5

const CircleCompletionBar = ({
                               total,
                               succeed,
                               failed,
                               size
                             }: CircleCompletionBarPros) => {
  let iconStyle: any
  switch (size) {
    case Size.big:
      iconStyle = styles.bigIcon
      break;
    default:
      iconStyle = styles.defaultIcon
      break
  }

  if (total == succeed) return <div className={iconStyle}><CompletedCircleIcon/></div>
  const center = SIZE / 2
  const radius = SIZE / 2 - STROKE_WIDTH / 2
  const circumference = 2 * Math.PI * radius
  return <div className={iconStyle}>
    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke="#CECECE"
        strokeWidth={STROKE_WIDTH}/>
      <circle
        className="svg-circle-bg"

        stroke="#EF4444"
        cx={center}
        cy={center}
        r={radius}
        strokeWidth={STROKE_WIDTH}
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - ((failed) / total))}
        transform={`rotate(${(360 * (succeed / total)) - 90} ${center} ${center})`}
      />
      <circle
        className="svg-circle-bg"
        stroke="#22C55E"
        cx={center}
        cy={center}
        r={radius}
        strokeWidth={STROKE_WIDTH}
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - ((succeed) / total))}
        transform={`rotate(${-90} ${center} ${center})`}
      />

    </svg>

  </div>
}

export default CircleCompletionBar
