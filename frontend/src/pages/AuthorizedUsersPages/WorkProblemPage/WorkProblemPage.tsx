import { observer } from "mobx-react-lite"
import { RouteComponentProps } from "react-router"
import styles from "./WorkProblemPage.module.css"
import BreadCrumbs from "../../../components/BreadCrumbs/BreadCrumbs"
import workProblemPage from "../../../store/workProblemPage"
import { useEffect } from "react"
import ProblemPage from "../ProblemPage/ProblemPage"
import sessionInfo from "../../../store/sessionInfo"
import BigLoading from "../../../components/BigLoading/BigLoading"
import ContentLoader from "react-content-loader"

type WorkProblemPageProps = { workId: string, problemId: string }

const WorkProblemPage = observer(({ match }: RouteComponentProps<WorkProblemPageProps>) => {
   const workId = match.params.workId
   const problemId = match.params.problemId
   useEffect(() => workProblemPage.fetchWorkAndProblem(sessionInfo.userId!!, +workId, +problemId), [])

   const work = workProblemPage.work
   const problem = workProblemPage.problem

   return <div className="page">
      <div className={styles.header}>
         <BreadCrumbs elements={[
            {
               name: "Работы",
               url: "/works"
            },
            work ? {
               name: work.name,
               url: `/works/${work.id}`
            }: undefined,
            (problem && work) ?{
               name: "Задачи",
               url: `/works/${work.id}#problems`
            }: undefined,
            (problem && work) ? {
               name: problem.name,
               url: `/works/${work.id}/problems/${problem.id}`
            } : undefined,
         ]}/>
         <div><h1>{problem?.name || <ContentLoader backgroundColor={'#bbb'}
                                                   foregroundColor={'#ddd'}
                                                   height={30} width={150}
         >
            <rect x="0" y="0" rx="4" ry="4" width="150" height="30"/>
         </ContentLoader>}</h1></div>
      </div>
      {problem ? <ProblemPage problem={problem}/> : <BigLoading/>}
   </div>
})
export default WorkProblemPage
