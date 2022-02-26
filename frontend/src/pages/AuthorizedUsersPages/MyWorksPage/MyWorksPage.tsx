import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import styles from "./HomeWorksPage.module.css"
import ProblemGroupFilter from "./Filter/ProblemGroupFilter"
import WorkList from "./WorkList/WorkList"
import BreadCrumbs from "../../../components/BreadCrumbs/BreadCrumbs"
import sessionInfo from "../../../store/sessionInfo"
import graphQLApi from "../../../api/graphQLApi"
import { ASSIGNED_WORKS_WITH_SOLUTION_INFO } from "../../../api/queries"
import { WorkGroupAssignment } from "../../../types"
import { assignmentStatus, AssignmentStatus } from "../../../utils"
import BigLoading from "../../../components/BigLoading/BigLoading"

const MyWorksPage = observer(() => {
  const [workStatusFiler, setWorkStatusFilter] = useState([AssignmentStatus.in_progress])
  const [workAssignments, setWorkAssignments] = useState<Array<WorkGroupAssignment>>()
  useEffect(() => {
    const groupId = sessionInfo.userGroupId
    const userId = sessionInfo.userId
    if (!userId || !groupId) {
      setWorkAssignments([])
      return
    }
    graphQLApi(ASSIGNED_WORKS_WITH_SOLUTION_INFO, {
      groupId,
      userId
    })
    .then(r => {
      setWorkAssignments(r.workAssignments)
    })
    .catch(e => {
      console.error(e)
      console.log(e.data.errors)
    })
  }, [])
  const workAssignmentsToShow = workAssignments?.filter(a => workStatusFiler.includes(assignmentStatus(a)))
  return <div className="page">
    <BreadCrumbs elements={[{
      name: "Работы",
      url: "/works"
    }]}/>
    <div className={styles.header}>Работы</div>
    <div>Фильтр: <ProblemGroupFilter onChange={setWorkStatusFilter}/></div>
    <div>
      {workAssignmentsToShow !== undefined ? <WorkList workAssignments={workAssignmentsToShow}/> : <BigLoading/>}
    </div>
  </div>

})
export default MyWorksPage
