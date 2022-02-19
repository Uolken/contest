import GroupList from "./GroupList/GroupList"
import Button from "../../../../components/Button/Button"
import { useHistory } from "react-router-dom"
import { observer } from "mobx-react-lite"
import BreadCrumbs from "../../../../components/BreadCrumbs/BreadCrumbs"

const GroupsManagementPage = observer(() => {
  const history = useHistory()
  return <div className="page">
    <BreadCrumbs elements={[
      {
        name: "Группы",
        url: "/teaching/groups"
      }
    ]}/>
    <div className={"pageHeader"}>
      <h1>Группы</h1>
      <Button text="Создать группу"
              action={() => history.push(`/teaching/groups/new`)}
      />
    </div>
    <GroupList/>


  </div>
})

export default GroupsManagementPage
