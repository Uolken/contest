import { Work } from "../../types"
import { DateTime } from "luxon"
import { ReactComponent as LockIcon } from "../../images/icons/locked.svg"
import { fromDateString } from "../../utils"

const WorkTimeFrame = (work: Work) => {
  const start = work.start ? fromDateString(work.start) : null
  if (start != null && +start > +DateTime.now()) {
    return <div><LockIcon/> Доступ откроется {start.toLocaleString(DateTime.DATETIME_SHORT)}</div>
  }

  const end = work.end ? fromDateString(work.end) : null
  if (end != null && +end < +DateTime.now()) {
    return <div><LockIcon/> Доступ закрыт {end.toLocaleString(DateTime.DATETIME_SHORT)}</div>
  }

}

export default WorkTimeFrame
