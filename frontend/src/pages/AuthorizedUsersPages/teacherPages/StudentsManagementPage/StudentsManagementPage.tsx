import { useHistory } from "react-router-dom"
import BreadCrumbs from "../../../../components/BreadCrumbs/BreadCrumbs"
import GroupList from "../GroupsManagementPage/GroupList/GroupList"
import Button from "../../../../components/Button/Button"
import StudentList from "./StudentList/StudentList"

const StudentsManagementPage = () => {
  const history = useHistory()
  return <div className="page">
    <BreadCrumbs elements={[
      {name: "Студенты", url: "/teaching/students"}
    ]}/>
    <div className={"pageHeader"}>
      <h1>Студенты</h1>
      <button onClick={() => history.push("/teaching/students/new")}>Добавить студента</button>
    </div>

    <StudentList/>

  </div>
}

export default StudentsManagementPage
