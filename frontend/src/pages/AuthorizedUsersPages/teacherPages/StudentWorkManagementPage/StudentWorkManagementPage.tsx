import BreadCrumbs from "../../../../components/BreadCrumbs/BreadCrumbs"
import { RouteComponentProps } from "react-router"
import { useEffect } from "react"
import studentWorkManagementPage from "../../../../store/pages/studentWorkManagementPage"
import { observer } from "mobx-react-lite"
import { fullName } from "../../../../utils"
import ProblemList from "./ProblemList"
import SubmissionList from "../StudentManagementPage/SubmissionList/SubmissionList"
import * as React from "react"

const StudentWorkManagementPage = observer(({ match }: RouteComponentProps<{ studentId: string, workId: string }>) => {
  useEffect(() => {
    studentWorkManagementPage.fetchAssignment(+match.params.studentId, +match.params.workId)
  }, [])
  const student = studentWorkManagementPage.student
  if (!student) return <div>LOADING</div>
  const work = student?.group?.workAssignment?.work
  if (!work) return <div>NOT FOUND</div>

  return <div className="page">
    <BreadCrumbs elements={[
      {name: "Студенты", url: "/teaching/students"},
      {name: fullName(student), url: `/teaching/students/${student.id}`},
      {
        name: "Работы",
        url: `/teaching/students/${student.id}/#works`
      }, {
        name: work?.name,
        url: `/teaching/students/${student.id}/works/${work.id}`
      }
    ]}/>
    <h1>Работа {work.name}</h1>
    <ProblemList problems={[...work.problems]}/>
    <SubmissionList submitterId={student.id} problemIds={work.problems.map(p => p.id)}/>
  </div>
})

export default StudentWorkManagementPage
