import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import styles from './CommonInfoPage.module.css'
import CalendarBlock from '../../../components/CalendarBlock/CalendarBlock'
import WorkCountCard from "./cards/WorkCountCard"
import SubmissionCountCard from "./cards/SubmissionCountCard"
import CompletedWorksCard from "./cards/CompletedWorks"
import graphQLApi, { Query } from "../../../api/graphQLApi"
import {
  SolutionStatus,
  Submission,
  SubmissionCount,
  SubmissionStatus,
  User,
  WorkGroupAssignment
} from "../../../types"
import sessionInfo from "../../../store/sessionInfo"
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { DateTime } from "luxon"
import { SUBMISSIONS } from "../../../api/queries"
import { ReactComponent as FailedCircleIcon } from "../../../images/icons/failed-circle-bar.svg"
import {
  ReactComponent as CompletedCircleIcon
} from "../../../images/icons/completed-circle-bar.svg"
import { ReactComponent as ClockIcon } from "../../../images/icons/clock-icon.svg"
import { fromDateString } from "../../../utils"
import SmallLoading from "../../../components/SmallLoading/SmallLoading"

const assignmentsQuery: Query<{ userId: number }, { user: User }> = {
  query: `
query userWithAssignments($userId: Long!) {
  user(userId: $userId) {
    id
    group {
      id
      name
      workAssignments {
        start
        end
        work {
          id 
          name
          problems {
            userSolutionInfo(userId: $userId) {
              tryCount
              status
            }
          }
        }
      }
    }
  }
} 
`
}

const submissionCountQuery: Query<{ userId: number, start: string, end: string, timezone: string }, { counts: Array<SubmissionCount> }> = {
  query: `
query submissionCountsByDates($start: Date!, $end: Date!, $userId: Long!, $timezone: String!) {
  counts: submissionCountsByDates(start: $start, end: $end, userId: $userId, timezone: $timezone) {
    date
    count
  }
} 
`
}

const CommonInfoPage = observer(() => {
  const [assignments, setAssignments] = useState<Array<WorkGroupAssignment> | undefined>(undefined)
  const [submissionCounts, setSubmissionCount] = useState<Array<{ date: string, count: number }>>()
  const [selectedSubmissionsDate, setSelectedSubmissionsDate] = useState(DateTime.now())
  const [submissions, setSubmissions] = useState<Array<Submission> | undefined>()

  const getColorScale = (() => {
    const max = Math.max(...(submissionCounts?.map(s => s.count) || [0]))
    return (value: { date: string, count: number }) => {
      if (value.count > max * 0.9) return styles.colorScale4
      if (value.count >= max * 0.5) return styles.colorScale3
      if (value.count >= max * 0.2) return styles.colorScale2
      return styles.colorScale1
    }
  })()

  useEffect(() => {
    graphQLApi(assignmentsQuery, { userId: sessionInfo.userId })
    .then(r => setAssignments(r.user.group?.workAssignments || []))
  }, [])

  const end = DateTime.now()
  .endOf("day")


  const start = end
  .minus({ year: 1 })

  useEffect(() => {
    graphQLApi(submissionCountQuery, {
      userId: sessionInfo.userId!,
      start: start.toFormat("yyyy-MM-dd"),
      end: end.toFormat("yyyy-MM-dd"),
      timezone: DateTime.now().zoneName
    })
    .then(r => {
      setSubmissionCount(r.counts)
    })
  }, [])

  useEffect(() => {
    setSubmissions(undefined)
    graphQLApi(SUBMISSIONS, {
      selector: {
        submissionSelector: {
          submitterIds: [sessionInfo.userId],
          from: selectedSubmissionsDate.startOf("day")
          .toUTC()
          .toISO(),
          to: selectedSubmissionsDate.endOf("day")
          .toUTC()
          .toISO()
        },
        pageSelector: {
          pageSize: 0,
          sortDirIsDesc: false,
          sortField: "submitted",
          currentPage: 0
        }
      }
    })
    .then(r => {
      setSubmissions(r.submissions)
    })
  }, [selectedSubmissionsDate])

  const worksTodo = assignments?.filter(a => !a.start || (+fromDateString(a.start)! < +DateTime.now()))
  ?.filter(a => !a.end || (+fromDateString(a.end)! > +DateTime.now()))
  ?.filter(a => a.work.problems.filter(p => p.userSolutionInfo?.status == SolutionStatus.Accepted).length != a.work.problems.length)?.length

  const worksDone = assignments?.filter(a => a.work.problems.filter(p => p.userSolutionInfo?.status == SolutionStatus.Accepted).length == a.work.problems.length)?.length

  return (
    <div className="page">
      <h1 className={styles.welcomeHeader}>Добро пожаловать</h1>
      <div className={styles.commonInfo}>
        <div className={styles.smallCard}>
          <WorkCountCard workCount={worksTodo}/>
        </div>
        <div className={styles.smallCard}>
          <CompletedWorksCard count={worksDone}/>
        </div>
        <div className={styles.smallCard}>
          <SubmissionCountCard count={submissionCounts?.map(s => s.count).reduce((c1, c2) => c1 + c2, 0)}/>
        </div>
        <div className={styles.heatMapBlock}>
          <CalendarHeatmap
            startDate={start.toJSDate()}
            endDate={end.toJSDate()}
            values={submissionCounts || []}

            classForValue={(value) => {
              if (!value) {
                return styles.colorEmpty
              }
              return getColorScale(value)
            }}
            titleForValue={value => value && `Решений ${value.count}, ${value.date}`}
            monthLabels={["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"]}
            onClick={v => v && setSelectedSubmissionsDate(fromDateString(v.date)!)}
          />
          <div className={styles.submissions}>
            <div>Решения за {selectedSubmissionsDate.toLocaleString({ dateStyle: "medium" })}</div>
            <div>
              {submissions ? <SubmissionList submissions={submissions}/> : <SmallLoading/>}
            </div>
          </div>
        </div>
        <div className={styles.calendarWrapper}><CalendarBlock assignments={assignments}/></div>
      </div>
    </div>
  )
})

const SubmissionList = ({ submissions }: { submissions: Array<Submission> }) => {
  return <div>
    {submissions.length == 0 && <div className={styles.submission}><ClockIcon/>Решений нет</div>}
    {submissions.map(s => {
      let icon
      if (s.status == SubmissionStatus.Failed) {
        icon = <FailedCircleIcon/>
      }
      if (s.status == SubmissionStatus.Succeed) {
        icon = <CompletedCircleIcon/>
      }
      if (s.status == SubmissionStatus.ToTest) {
        icon = <ClockIcon/>
      }
      if (s.status == SubmissionStatus.ToTest) {
        icon = <ClockIcon/>
      }
      return <div className={styles.submission} key={s.id}>
        <div>
          {icon}
        </div>
        <div>
          <div>
            Решение {s.problem.name}
          </div>
          <div className={styles.submissionTime}>
            {DateTime.fromISO(s.submitted)
            .toLocaleString({ timeStyle: "short" })}
          </div>
        </div>
      </div>
    })}
  </div>
}

export default CommonInfoPage
