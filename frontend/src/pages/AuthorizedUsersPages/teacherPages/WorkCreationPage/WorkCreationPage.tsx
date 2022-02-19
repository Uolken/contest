import { observer } from "mobx-react-lite"
import BreadCrumbs from "../../../../components/BreadCrumbs/BreadCrumbs"
import ProblemSelectorModal from "../../../../modals/ProblemSelectorModal/ProblemSelectorModal"
import workCreationPage from "../../../../store/pages/workCreationPage"
import ProblemsList from "../WorkManagementPage/ProblemsList/ProblemsList"
import * as React from "react"
import { useEffect } from "react"
import styles from "./WorkCreationPage.module.css"
import { ReactComponent as PlusIcon } from "../../../../images/icons/plus-icon.svg"

export default observer(() => {
  useEffect(() => workCreationPage.clear(), [])
  return <div className={"page"}>
    <BreadCrumbs elements={[
      {
        name: "Работы",
        url: "/teaching/works"
      },
      {
        name: "Создать",
        url: "/teaching/works/new"
      }
    ]}/>

    <div className={"pageHeader"}>
      <h1>Создание работы</h1>
      <button onClick={() => {
      }}>Сохранить
      </button>
    </div>

    <div>
      <div className={"multirow-form"}>
        <label>
          <div>
            Название:
          </div>
          <input type="text" value={workCreationPage.name}
                 onChange={e => workCreationPage.name = e.target.value}/>
        </label>
        <label>
          <div>
            Начало:
          </div>
          <input type="datetime-local"/>
        </label>
        <label>
          <div>
            Окончание:
          </div>
          <input type="datetime-local"/>
        </label>
      </div>
    </div>
    <div className={styles.problemsGroup}>
      <ProblemsList problems={[...workCreationPage.problems]}/>
      <button className={styles.addButton}
              onClick={() => workCreationPage.showProblemSelector = true}>
        <PlusIcon/>
        <div>Добавить задачу</div>
      </button>
    </div>
    {workCreationPage.showProblemSelector &&
        <ProblemSelectorModal excludedIds={workCreationPage.problemIds()}
                              onSelect={p => workCreationPage.addProblem(p)} onClose={() => {
          workCreationPage.showProblemSelector = false
        }}/>}

  </div>
})
