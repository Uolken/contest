import BreadCrumbs from "../../../../components/BreadCrumbs/BreadCrumbs"
import ProblemList from "./ProblemList/ProblemList"
import { useHistory } from "react-router-dom"

const ProblemsManagementPage = () => {
  const history = useHistory()
  return <div className={"page"}>
    <BreadCrumbs elements={[
      {name: "Задачи", url: "/teaching/problems"}
    ]}/>
    <div className={"pageHeader"}>
      <h1>Задачи</h1>
      <button onClick={() => history.push("/teaching/problems/new")}>Добавить задачу</button>
    </div>
    <ProblemList/>
  </div>
}

export default ProblemsManagementPage
