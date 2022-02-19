import { DateTime, Info } from 'luxon'
import React, { useState } from 'react'
import CalendarDay from './CalendarDay/CalendarDay'
import styles from './Calendar.module.css'
import leftSwitch from '../../../images/icons/left-switch.svg'
import rightSwitch from '../../../images/icons/right-switch.svg'
import { capitalize } from "../../../utils"

const WEEKS_COUNT = 6
const DAYS_IN_WEEK = 7



const Calendar = ({actionTimestamps, selectedDate, setSelectedDate}: {actionTimestamps: Array<number>, selectedDate: DateTime, setSelectedDate: (d: DateTime) => void}) => {
  const [currentDate, setCurrentDate] = useState(DateTime.now()
  .startOf('day'))
  const [showedMonth, setShowedMonth] = useState(DateTime.now()
  .startOf('month'))

  const calendarRows = createLines(showedMonth, selectedDate, currentDate, actionTimestamps, setSelectedDate)

  return (
    <div className={styles.calendar}>
      <div className={styles.monthSelector}>
        {/* eslint-disable-next-line max-len */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <span onClick={() => setShowedMonth(showedMonth.minus({ month: 1 }))}
              className={styles.monthSwitch}>
          <img src={leftSwitch} alt="previous month"/>
        </span>
        {capitalize(showedMonth.monthLong)}
        {' '}
        {showedMonth.year}
        {/* eslint-disable-next-line max-len */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <span onClick={() => setShowedMonth(showedMonth.plus({ month: 1 }))}
              className={styles.monthSwitch}>
          <img src={rightSwitch} alt="next month"/>
        </span>
      </div>
      <table>
        <thead>
        <tr className={styles.monthsRow}>
          {Info.weekdays('short')
          .map((d) => <th key={d} className={styles.dayOfWeek}>{d}</th>)}
        </tr>
        </thead>
        <tbody>
        {calendarRows}
        </tbody>
      </table>
    </div>
  )
}

function createWeek(week: DateTime[], showedMonth: DateTime,
                    selectedDate: DateTime,
                    currentDate: DateTime,
                    actionTimestamps: Array<number>,
                    onDaySelect: (d: DateTime) => void) {
  return week.map((day) => (
    <td className={styles.dayBlock} key={day.toISO()}>
      <CalendarDay
        day={day} onDaySelect={onDaySelect} showedMonth={showedMonth}
        currentDate={currentDate} selectedDate={selectedDate} hasActions={actionTimestamps.includes(+day)}
      />
    </td>
  ))
}

function createLines(showedMonth: DateTime,
                     selectedDate: DateTime,
                     currentDate: DateTime,
                     actionTimestamps: Array<number>,
                     onDaySelect: (d: DateTime) => void) {
  const start = showedMonth.startOf('month')
  .startOf('week')
  const weeks = [...Array(WEEKS_COUNT)].map((_, i) => i * DAYS_IN_WEEK)
  .map((w) => [...Array(DAYS_IN_WEEK)]
  .map((_, i) => w + i)
  .map((offset) => start.plus({ day: offset })))

  return weeks.map((week) => createWeek(week, showedMonth, selectedDate, currentDate, actionTimestamps, onDaySelect))
  .map((week) => (
    <tr key={week[0].key} className={styles.weekRow}>
      {week}
    </tr>
  ))
}

export default Calendar
