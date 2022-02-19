import BreadCrumbs from "../../../../components/BreadCrumbs/BreadCrumbs"
import { fullName } from "../../../../utils"
import { RouteComponentProps } from "react-router"
import { observer } from "mobx-react-lite"
import studentManagementPage from "../../../../store/pages/studentManagementPage"
import * as React from "react"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import AssignmentList from "./AssignmentList/AssignmentList"
import SubmissionList from "./SubmissionList/SubmissionList"
import SubmissionModal from "../../../../modals/SubmissionModal/SubmissionModal"

const StudentManagementPage = observer(({ match }: RouteComponentProps<{ studentId: string }>) => {
  useEffect(() => studentManagementPage.fetchStudent(+match.params.studentId), [])
  const student = studentManagementPage.student
  if (!student) return <div>LOADING</div>
  const workAssignments = student.group?.workAssignments
  const submissions = studentManagementPage.submissions
  return <div className="page">
    <BreadCrumbs elements={[
      {
        name: "Студенты",
        url: "/teaching/students"
      },
      {
        name: fullName(student),
        url: `/teaching/students/${student.id}`
      },
    ]}/>
    <h1>{fullName(student)} {student.group &&
        <Link to={`/teaching/groups/${student.group.id}`}>{student.group.name}</Link>}</h1>

    {workAssignments && <AssignmentList workAssignments={workAssignments} studentId={student.id}/>}
    <SubmissionList submitterId={student.id}
                    onSelect={s => studentManagementPage.showSubmissionId = s.id}/>
    {studentManagementPage.showSubmissionId &&
        <SubmissionModal submissionId={studentManagementPage.showSubmissionId}
                         onClose={() => studentManagementPage.showSubmissionId = undefined}
                         teacherMode={true}/>}


  </div>
})

export default StudentManagementPage
