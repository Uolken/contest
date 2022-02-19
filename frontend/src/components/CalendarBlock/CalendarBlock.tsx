import React, { useState } from 'react'
import styles from './CalendarBlock.module.css'
import Calendar from './Calendar/Calendar'
import SelectedDayActions from './SelectedDayActions/SelectedDayActions'
import { WorkGroupAssignment } from "../../types"
import { DateTime } from "luxon"
import { fromDateString } from "../../utils"

const CalendarBlock = ({ assignments }: { assignments: Array<WorkGroupAssignment> | undefined }) => {

  const [selectedDate, setSelectedDate] = useState(DateTime.now()
  .startOf('day'))

  const actions = assignments?.flatMap(a => [a.start, a.end])
  .filter(d => d != null)
  .map(d => +fromDateString(d)!.startOf("day")) || []

  return <div className={styles.calendarBlock}>
    <Calendar actionTimestamps={actions} selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
    <SelectedDayActions assignments={assignments} selectedDate={selectedDate}/>
  </div>

}

export default CalendarBlock
