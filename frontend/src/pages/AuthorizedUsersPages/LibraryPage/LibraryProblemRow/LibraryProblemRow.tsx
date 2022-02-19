import { Maybe, Problem, SolutionInfo, SolutionStatus } from "../../../../types"
import TagList from "../../../../components/TagList/TagList"

import { ReactComponent as MinusIcon } from "../../../../images/icons/minus.svg"
import { ReactComponent as CompletedCircleIcon } from "../../../../images/icons/completed-circle-bar.svg"
import styles from "../LibraryPage.module.css"
import { Link } from "react-router-dom"

const LibraryProblemRow = (problem: Problem) => {
  const icon = getIcon(problem.userSolutionInfo)
  return <tr>
    <td className={styles.problemStatus}>
      {icon}
    </td>
    <td className={styles.problemName}>
      <Link to={`/library/${problem.id}`}>
        {problem.name}
      </Link>
    </td>
    <td className={styles.problemTags}>
      <TagList tags={problem.tags}/>
    </td>
    <td className={styles.problemDifficulty}>hard</td>
  </tr>
}

function getIcon(solutionInfo: Maybe<SolutionInfo> | undefined) {
  if (!solutionInfo || solutionInfo.status == SolutionStatus.NotSubmitted) {
    return <MinusIcon/>
  }
  return <CompletedCircleIcon/>
}

export default LibraryProblemRow
