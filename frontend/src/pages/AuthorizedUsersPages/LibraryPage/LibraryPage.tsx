import { observer } from "mobx-react-lite"
import BreadCrumbs from "../../../components/BreadCrumbs/BreadCrumbs"
import styles from "./LibraryPage.module.css"
import libraryPage from "../../../store/libraryPage"
import { useEffect } from "react"
import LibraryProblemRow from "./LibraryProblemRow/LibraryProblemRow"

const LibraryPage = observer(() => {

  useEffect(() => libraryPage.fetchProblems(), [])
  return <div className="page">
    <BreadCrumbs elements={[{
      name: "Библитека",
      url: "/library"
    }]}/>
    <div><h1>Библиотека задач</h1></div>
    <table className={styles.problemTable}>
      <tr>
        <th className={styles.problemStatus}>Статус</th>
        <th className={styles.problemName}>Название</th>
        <th className={styles.problemTags}>Теги</th>
        <th className={styles.problemDifficulty}>Сложность</th>
      </tr>
      {
        libraryPage.problems?.map(p => LibraryProblemRow(p))
      }

    </table>

  </div>
})

export default LibraryPage
