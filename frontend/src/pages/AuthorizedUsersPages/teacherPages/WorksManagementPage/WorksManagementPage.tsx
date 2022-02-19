import { useHistory } from "react-router-dom"
import BreadCrumbs from "../../../../components/BreadCrumbs/BreadCrumbs"
import WorkList from "./WorkList/WorkList"

const WorksManagementPage = () => {
  const history = useHistory()
  return <div className="page">
    <BreadCrumbs elements={[
      {
        name: "Работы",
        url: "/teaching/works"
      }
    ]}/>
    <div className={"pageHeader"}>
      <h1>Работы</h1>
      <button onClick={() => history.push("/teaching/works/new")}>Добавить работу</button>
    </div>

    <WorkList/>

  </div>
}
export default WorksManagementPage
