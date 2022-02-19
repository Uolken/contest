import BreadCrumbs from "../../../../components/BreadCrumbs/BreadCrumbs"
import * as React from "react"
import createStudentPage from "../../../../store/pages/createStudentPage"
import GroupSelectorModal from "../../../../modals/GroupSelectorModal/GroupSelectorModal"
import Button from "../../../../components/Button/Button"
import { observer } from "mobx-react-lite"
import ErrorPopup from "../../../../components/ErrorPopup/ErrorPopup"
import { useHistory } from "react-router-dom"

export default observer(() => {
  const history = useHistory()
  return <div className="page">
    <BreadCrumbs elements={[
      {
        name: "Студенты",
        url: "/teaching/students"
      },
      {
        name: "Новый студент",
        url: "/teaching/students/new"
      },
    ]}/>
    <div className={"pageHeader"}>
      <h1>Новый студент</h1>
      <div>
        <Button text={"Сохранить"} action={() => createStudentPage.createUser()
        ?.then(u => history.push(`/teaching/students/${u.id}`))
          .catch(r => {
            createStudentPage.errorMessage = "Пользователь с таким email уже существует"
            createStudentPage.showErrorMessage = true
          })}/>
      </div>
    </div>
    <div className={"multirow-form"}>
      <label>
        <div>
          Имя:
        </div>
        <input type="text" onChange={e => createStudentPage.firstName = e.target.value}/>
      </label>
      <label>
        <div>
          Фамилия:
        </div>
        <input type="text" onChange={e => createStudentPage.lastName = e.target.value}/>
      </label>
      <label>
        <div>
          Email:
        </div>
        <input type="text" onChange={e => createStudentPage.email = e.target.value}/>
      </label>
    </div>
    <div>
      <h2>Группа: {createStudentPage.group ? createStudentPage.group.name : "Не выбрана"}</h2>
      <div>
        <Button text={"Выбрать группу"} action={() => createStudentPage.showGroupSelector = true}/>
      </div>

    </div>
    {createStudentPage.showGroupSelector && <GroupSelectorModal excludedIds={[]}
                                                                onSelect={g => {
                                                                  createStudentPage.group = g
                                                                  createStudentPage.showGroupSelector = false
                                                                }}
                                                                onClose={() => createStudentPage.showGroupSelector = false}/>}
    {createStudentPage.showErrorMessage && <ErrorPopup errorMessage={createStudentPage.errorMessage}
                                                       onClose={() => createStudentPage.showErrorMessage = false}></ErrorPopup>}
  </div>
})
