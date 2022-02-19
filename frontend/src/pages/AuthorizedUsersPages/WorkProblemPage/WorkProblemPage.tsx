import { observer } from "mobx-react-lite"
import { RouteComponentProps } from "react-router"
import styles from "./WorkProblemPage.module.css"
import BreadCrumbs from "../../../components/BreadCrumbs/BreadCrumbs"
import workProblemPage from "../../../store/workProblemPage"
import { useEffect } from "react"
import problemPage from "../../../store/problemPage"
import ProblemPage from "../ProblemPage/ProblemPage"
import sessionInfo from "../../../store/sessionInfo"

type WorkProblemPageProps = { workId: string, problemId: string }

const WorkProblemPage = observer(({ match }: RouteComponentProps<WorkProblemPageProps>) => {
   const workId = match.params.workId
   const problemId = match.params.problemId
   useEffect(() => workProblemPage.fetchWorkAndProblem(sessionInfo.userId!!, +workId, +problemId), [])

   const work = workProblemPage.work
   const problem = workProblemPage.problem
   if (!work || !problem) {
      return <div>LOADING1</div>
   }

   problemPage.setProblem(problem)

   return <div className="page">
      <div className={styles.header}>
         <BreadCrumbs elements={[
            {
               name: "Работы",
               url: "/works"
            },
            {
               name: work.name,
               url: `/works/${work.id}`
            },
            {
               name: "Задачи",
               url: `/works/${work.id}#problems`
            },
            {
               name: problem.name,
               url: `/works/${work.id}/problems/${problem.id}`
            },
         ]}/>
         <div><h1>{problem.name}</h1></div>
      </div>
      <ProblemPage/>
   </div>
})
export default WorkProblemPage
