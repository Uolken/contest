import styles from "./WorkProblemPage.module.css"
import BreadCrumbs from "../../../components/BreadCrumbs/BreadCrumbs"
import ProblemPage from "../ProblemPage/ProblemPage"
import { observer } from "mobx-react-lite"
import { RouteComponentProps } from "react-router"
import libraryProblemPage from "../../../store/libraryProblemPage"
import BigLoading from "../../../components/BigLoading/BigLoading"
import ContentLoader from "react-content-loader"
import sessionInfo from "../../../store/sessionInfo"
import { useEffect } from "react"
// TODO Refactor
const LibraryProblemPage = observer(({ match }: RouteComponentProps<{ problemId: string }>) => {
  const problemId = match.params.problemId
  useEffect(() => libraryProblemPage.fetchProblem(sessionInfo.userId!!, +problemId), [])
  const problem = libraryProblemPage.problem
  // const problem: Problem | undefined = undefined

  return <div className="page">
    <div className={styles.header}>
      <BreadCrumbs elements={[
        {
          name: "Библиотека",
          url: "/library"
        },
        problem ? {
          name: problem.name,
          url: `/library/problems/${problem.id}`
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

export default LibraryProblemPage
