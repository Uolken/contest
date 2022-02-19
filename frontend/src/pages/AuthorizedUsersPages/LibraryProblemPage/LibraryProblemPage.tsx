import { useEffect } from "react"
import problemPage from "../../../store/problemPage"
import styles from "./WorkProblemPage.module.css"
import BreadCrumbs from "../../../components/BreadCrumbs/BreadCrumbs"
import ProblemPage from "../ProblemPage/ProblemPage"
import { observer } from "mobx-react-lite"
import { RouteComponentProps } from "react-router"
import libraryProblemPage from "../../../store/libraryProblemPage"
import sessionInfo from "../../../store/sessionInfo"

const LibraryProblemPage = observer(({ match }: RouteComponentProps<{ problemId: string }>) => {
  const problemId = match.params.problemId

  useEffect(() => libraryProblemPage.fetchProblem(sessionInfo.userId!!, +problemId), [])

  const problem = libraryProblemPage.problem
  if (!problem) {
    return <div>LOADING1</div>
  }
  problemPage.setProblem(problem)

  return <div className="page">
    <div className={styles.problemPageWrapper}>
      <div className={styles.header}>
        <BreadCrumbs elements={[
          {
            name: "Библиотека",
            url: "/library"
          },
          {
            name: problem.name,
            url: `/library/problems/${problem.id}`
          },
        ]}/>
        <div><h1>{problem.name}</h1></div>
      </div>
      <ProblemPage/>
    </div>
  </div>
})

export default LibraryProblemPage
