import { RouteComponentProps } from "react-router"
import { useEffect } from "react"
import studentWorkManagementPage from "../../../../store/pages/studentWorkManagementPage"
import BreadCrumbs from "../../../../components/BreadCrumbs/BreadCrumbs"
import { fullName } from "../../../../utils"
import ProblemList from "../StudentWorkManagementPage/ProblemList"
import studentWorkProblemManagementPage
  from "../../../../store/pages/studentWorkProblemManagementPage"
import { observer } from "mobx-react-lite"

const StudentWorkProblemManagementPage = observer(({ match }: RouteComponentProps<{ studentId: string, workId: string, problemId: string }>) => {
  useEffect(() => {
    studentWorkProblemManagementPage.fetchData(+match.params.studentId, +match.params.workId, +match.params.problemId)
  }, [])
  const student = studentWorkProblemManagementPage.student
  const problem = studentWorkProblemManagementPage.problem
  if (!student || ! problem) return <div>LOADING</div>
  const work = student.group?.workAssignment?.work
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
      },
      {name: "Задачи", url: `/teaching/students/${student.id}/works/${work.id}#problems`},
      {name: problem.name, url: `/teaching/students/${student.id}/works/${work.id}/problems/${problem.id}`},
    ]}/>
    <h1>Задача {problem.name}</h1>

  </div>
})

export default StudentWorkProblemManagementPage
