import BreadCrumbs from "../../../../components/BreadCrumbs/BreadCrumbs"
import { RouteComponentProps } from "react-router"
import { useEffect } from "react"
import studentWorkManagementPage from "../../../../store/pages/studentWorkManagementPage"
import { observer } from "mobx-react-lite"
import { fullName } from "../../../../utils"
import ProblemList from "./ProblemList"
import SubmissionList from "../StudentManagementPage/SubmissionList/SubmissionList"
import * as React from "react"
import ContentLoader from "react-content-loader"
import BigLoading from "../../../../components/BigLoading/BigLoading"

const StudentWorkManagementPage = observer(({ match }: RouteComponentProps<{ studentId: string, workId: string }>) => {
  useEffect(() => {
    studentWorkManagementPage.fetchAssignment(+match.params.studentId, +match.params.workId)
  }, [])
  const student = studentWorkManagementPage.student
  const work = student?.group?.workAssignment?.work

  return <div className="page">
    <BreadCrumbs elements={[
      {name: "Студенты", url: "/teaching/students"},
      student ? {name: fullName(student), url: `/teaching/students/${student.id}`} : undefined,
      student ? {
        name: "Работы",
        url: `/teaching/students/${student.id}/#works`
      }: undefined,
      (work&& student) ? {
        name: work.name,
        url: `/teaching/students/${student.id}/works/${work.id}`
      }: undefined
    ]}/>
    <h1>{work ? <span>Работа {work?.name}</span> : <ContentLoader backgroundColor={'#bbb'}
                                                                  foregroundColor={'#ddd'}
                                                                  height={30} width={150}
    >
      <rect x="0" y="0" rx="4" ry="4" width="150" height="30"/>
    </ContentLoader>}</h1>
    {
      work ? <>
        <ProblemList problems={[...work.problems]}/>
        <SubmissionList submitterId={student.id} problemIds={work.problems.map(p => p.id)}/>
      </> : <BigLoading/>
    }
  </div>
})

export default StudentWorkManagementPage
