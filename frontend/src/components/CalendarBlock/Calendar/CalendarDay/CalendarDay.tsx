import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React from 'react'
import styles from './CalendarDay.module.css'
import calendar from '../../../../store/components/calendar'
import taskGroups from '../../../../store/taskGroups'
import classNames from "classnames"

interface CalendarDayInput {
  day: DateTime,
  showedMonth: DateTime,
  selectedDate: DateTime,
  currentDate: DateTime,
  hasActions: boolean,
  onDaySelect: (d: DateTime) => void
}

const CalendarDay = observer(({ day, showedMonth, selectedDate, currentDate, onDaySelect, hasActions }: CalendarDayInput) => {
  const mountStart = showedMonth.startOf('month')
  const mountEnd = showedMonth.endOf('month')

  const isCurrentMonth = mountStart <= day && day < mountEnd

  const styleClasses: string[] = [styles.day]

  if (isCurrentMonth) {
    styleClasses.push(styles.currentMonth)
    if (+day === +selectedDate) {
      styleClasses.push(styles.selected)
    } else if (+day === +currentDate) {
      styleClasses.push(styles.currentDay)
    }
  } else {
    styleClasses.push(styles.otherMonth)
  }

  // if (taskGroups.taskGroups.find(((tg) => +tg.startDate.startOf('day') === +day || +tg.endDate.startOf('day') === +day))) {
  //   styleClasses.push(styles.hasAction)
  // }

  const classes = {
    [styles.currentMonth]: isCurrentMonth,
    [styles.otherMonth]: !isCurrentMonth,
    [styles.selected] : +day === +selectedDate,
    [styles.currentDay]: +day === +currentDate,
    [styles.hasAction]: hasActions
  }
  return (
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      className={classNames(styles.day, classes)}
      onClick={() => {
        if (isCurrentMonth) {
          onDaySelect(day)
        }
      }}
    >
      <div className={styles.dayDate}>
        {day.day}
      </div>
    </div>
  )
})

export default CalendarDay
