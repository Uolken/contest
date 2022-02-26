import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from "react-router"
import styles from "./WorkPage.module.css"
import TagList from "../../../components/TagList/TagList"
import { Problem, SolutionStatus, WorkGroupAssignment } from "../../../types"
import { DateTime } from "luxon"
import sessionInfo from "../../../store/sessionInfo"
import graphQLApi from "../../../api/graphQLApi"
import { USER_WITH_ASSIGNMENT } from "../../../api/queries"
import BreadCrumbs from "../../../components/BreadCrumbs/BreadCrumbs"
import { Size, WorkStatusBlock } from "../MyWorksPage/WorkList/WorkListItem/WorkListItem"
import { AssignmentStatus, assignmentStatus, fromDateString } from "../../../utils"
import GenericTable, { Column } from "../../../components/GenericTable/GenericTable"
import {
  ReactComponent as CompletedCircleIcon
} from "../../../images/icons/completed-circle-bar.svg"
import {
  ReactComponent as FailedCircleIcon
} from "../../../images/icons/failed-circle-bar.svg"
import { ReactComponent as MinusIcon } from "../../../images/icons/minus.svg"
import { ReactComponent as FireIcon } from "../../../images/icons/fire.svg"
import ContentLoader from "react-content-loader"
import BigLoading from "../../../components/BigLoading/BigLoading"

type WorkPageProps = { workId: string }

const SolutionStatusBlock = ({ status }: { status: SolutionStatus }) => {
  return <div style={{display: "flex", gap: 8, alignItems: "center" } }>
    {status == SolutionStatus.NotSubmitted && <><MinusIcon/><div>Нет решений</div></>}
    {status == SolutionStatus.Accepted && <><CompletedCircleIcon/><div>Решено</div></>}
    {status == SolutionStatus.FailedTest && <><FailedCircleIcon/><div>Решение не верно</div></>}
    {status == SolutionStatus.ToTest && <><div>Проверяется</div></>}
    {status == SolutionStatus.Testing && <><div>Проверяется</div></>}
  </div>
}

const columns: Array<Column<Problem>> = [
  {
    name: "name",
    readableName: "Название",
    content: p => p.name,
    sortable: true
  },
  {
    name: "tags",
    readableName: "Тэги",
    content: p => <TagList tags={p.tags}/>,
    sortable: true
  },
  {
    name: "status",
    readableName: "Статус",
    content: p => <SolutionStatusBlock
    status={p.userSolutionInfo?.status || SolutionStatus.NotSubmitted}/>,
    sortable: true
  }
]

const WorkPage = ({ match }: RouteComponentProps<WorkPageProps>) => {
  const [workAssignment, setWorkAssignment] = useState<WorkGroupAssignment>()

  useEffect(() => {
    graphQLApi(USER_WITH_ASSIGNMENT, {
      userId: sessionInfo.userId,
      workId: +match.params.workId
    })
    .then(r => {
      setWorkAssignment(r.user.group?.workAssignment!)
    })
  }, [])

  const work = workAssignment?.work
  const problems = work?.problems

  const start = workAssignment?.start ? fromDateString(workAssignment.start) : null
  const end = workAssignment?.end ? fromDateString(workAssignment.end) : null

  const status = workAssignment ? assignmentStatus(workAssignment) : undefined
  return (
    <div className="page">
      <BreadCrumbs elements={[
        {
          name: "Работы",
          url: "/works"
        },
        work ? {
          name: work.name,
          url: `/works/${work.id}`
        }: undefined,
      ]}/>
      <div className={"pageHeader"}>
        <h1 className={styles.workTitle}>{work?.name || <ContentLoader backgroundColor={'#bbb'}
                                                                       foregroundColor={'#ddd'}
                                                                       height={30} width={150}
        >
            <rect x="0" y="0" rx="4" ry="4" width="150" height="30"/>
        </ContentLoader>}</h1>
      </div>
      {
        (workAssignment && problems) ? <>
          <div>

            <div className={styles.workCompletionBlock}>
              <WorkStatusBlock assignment={workAssignment} size={Size.big}/>
            </div>
            {end && status == AssignmentStatus.in_progress && <div><FireIcon/> Сдать до {end.toLocaleString(DateTime.DATETIME_SHORT)}</div>}
            <TagList tags={problems.flatMap(w => w.tags)}/>
          </div>

          <div>
            {(status == AssignmentStatus.in_progress || status == AssignmentStatus.all_problems_solved) &&
                <div>
                    <GenericTable columns={columns} pageSize={15} linkExtractor={p => `/works/${work.id}/problems/${p.id}`}
                                  keyExtractor={p => p.id} hideHeader={false}
                                  data={problems}/>
                </div>}
          </div>
        </> : <BigLoading/>
      }

    </div>
  )
}
export default WorkPage
