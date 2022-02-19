import { observer } from "mobx-react-lite"
import Button from "../../../../../components/Button/Button"
import newGroupForm from "../../../../../store/forms/newGroupForm"
import ErrorPopup from "../../../../../components/ErrorPopup/ErrorPopup"
import { useHistory } from "react-router-dom"
import BreadCrumbs from "../../../../../components/BreadCrumbs/BreadCrumbs"
import { useEffect } from "react"
import StudentList from "../../GroupManagementPage/StudentList/StudentList"
import StudentSelectorModal from "../../../../../modals/StudentSelectorModal/StudentSelectorModal"

const NewGroupPage = observer(() => {
  const history = useHistory()
  useEffect(() => newGroupForm.clearData(), [])
  return <div className="page">
    <BreadCrumbs elements={[
      {
        name: "Управление группами",
        url: "/teaching/groups"
      },
      {
        name: "Создание группы",
        url: `/teaching/groups/new`
      },
    ]}/>
    <div className={"pageHeader"}>
      <h1>Создание группы</h1>
      <Button text={"Создать"} action={() => {
        newGroupForm.createGroup()
        .then(g => history.push(`/teaching/groups/${g.id}`))
        .catch(e => {
          console.log(e)
          newGroupForm.showError = true
        })

      }}/>

    </div>

    <div className={"multirow-form"}>
      <label>
        <div>
          Название группы:
        </div>
        <input type="text" name="groupName"
               value={newGroupForm.groupName}
               onChange={n => newGroupForm.groupName = (n.target.value)}/>
      </label>

    </div>


    <StudentList students={newGroupForm.students}
                 onClickAdd={() => newGroupForm.showStudentSelector = true}
                 onRemove={u => newGroupForm.removeStudent(u)}/>
    {newGroupForm.showStudentSelector &&
        <StudentSelectorModal excludedIds={newGroupForm.students.map(s => s.id)}
                              onSelect={s => newGroupForm.addStudent(s)}
                              onClose={() => newGroupForm.showStudentSelector = false}
        />
    }
    {newGroupForm.showError && <ErrorPopup errorMessage={newGroupForm.errorMessage}
                                           onClose={() => newGroupForm.showError = false}/>
    }
  </div>
})

export default NewGroupPage
