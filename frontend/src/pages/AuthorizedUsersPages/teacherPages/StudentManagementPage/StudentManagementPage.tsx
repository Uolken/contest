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
import ContentLoader from "react-content-loader"
import BigLoading from "../../../../components/BigLoading/BigLoading"

const StudentManagementPage = observer(({ match }: RouteComponentProps<{ studentId: string }>) => {
  useEffect(() => studentManagementPage.fetchStudent(+match.params.studentId), [])
  const student = studentManagementPage.student
  const workAssignments = student?.group?.workAssignments
  const submissions = studentManagementPage.submissions
  return <div className="page">
    <BreadCrumbs elements={[
      {
        name: "Студенты",
        url: "/teaching/students"
      },
      student ? {
        name: fullName(student),
        url: `/teaching/students/${student.id}`
      }: undefined,
    ]}/>
    {student && <h1>{fullName(student)} {student.group &&
        <Link to={`/teaching/groups/${student.group.id}`}>{student.group.name}</Link>}</h1> }
    {!student && <h1><ContentLoader backgroundColor={'#bbb'}
                                foregroundColor={'#ddd'}
                                height={30} width={150}
    >
        <rect x="0" y="0" rx="4" ry="4" width="150" height="30"/>
    </ContentLoader></h1> }
    { student ? <>
      <AssignmentList workAssignments={workAssignments || []} studentId={student.id}/>
      <SubmissionList submitterId={student.id}
                      onSelect={s => studentManagementPage.showSubmissionId = s.id}/>
    </> : <BigLoading/>

    }


    {studentManagementPage.showSubmissionId &&
        <SubmissionModal submissionId={studentManagementPage.showSubmissionId}
                         onClose={() => studentManagementPage.showSubmissionId = undefined}
                         teacherMode={true}/>}


  </div>
})

export default StudentManagementPage
