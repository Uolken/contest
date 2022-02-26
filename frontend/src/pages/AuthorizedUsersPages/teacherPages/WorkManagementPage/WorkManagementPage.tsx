import { useHistory } from "react-router-dom"
import BreadCrumbs from "../../../../components/BreadCrumbs/BreadCrumbs"
import workManagementPage from "../../../../store/pages/workManagementPage"
import * as React from "react"
import { useEffect } from "react"
import { RouteComponentProps } from "react-router"
import { observer } from "mobx-react-lite"
import WorkAssignmentsList from "./WorkAssignmentsList/WorkAssignmentsList"
import ProblemsList from "./ProblemsList/ProblemsList"
import styles from "../WorkCreationPage/WorkCreationPage.module.css"
import ProblemSelectorModal from "../../../../modals/ProblemSelectorModal/ProblemSelectorModal"
import EditableField from "../../../../components/EditableField/EditableField"
import GroupSelectorModal from "../../../../modals/GroupSelectorModal/GroupSelectorModal"
import EditAssignmentModal from "../../../../modals/EditAssignmentModal/EditAssignmentModal"
import { fromInputDate, toInputDate } from "../../../../utils"
import ContentLoader from "react-content-loader"

const WorkManagementPage = observer(({ match }: RouteComponentProps<{ workId: string }>) => {
  const history = useHistory()
  useEffect(() => workManagementPage.fetchWork(match.params.workId), [])
  const work = workManagementPage.work

  return <div className="page">
    <BreadCrumbs elements={[
      {
        name: "Работы",
        url: "/teaching/works"
      }, work !== undefined ? {
        name: work?.name || "Создание работы",
        url: `/teaching/works/${work?.id || "new"}`
      }: undefined
    ]}/>
    <div className={"pageHeader"}>
      {workManagementPage.workName !== undefined ?
        <EditableField value={workManagementPage.workName} placeholder={"Название"}
                       onChange={v => workManagementPage.workName = v}/> :
        <ContentLoader backgroundColor={'#bbb'}
                       foregroundColor={'#ddd'}
                       height={30} width={150}
        ><rect x="0" y="0" rx="4" ry="4" width="150" height="30"/>
        </ContentLoader>
      }

      <button onClick={() => {workManagementPage.sendUpdates().then((workId) => {
        if (match.params.workId == "new") history.push(`/teaching/works/${workId}`)
        window.location.reload()
      })}}>Сохранить
      </button>
    </div>

    <div>
      <div className={"multirow-form"}>
        <label>
          <div>
            Начало:
          </div>
          <input type="datetime-local" value={toInputDate(workManagementPage.start || "")}
                 onChange={e => workManagementPage.start = fromInputDate(e.target.value)}/>
        </label>
        <label>
          <div>
            Окончание:
          </div>
          <input type="datetime-local" value={toInputDate(workManagementPage.end || "")}
                 onChange={e => workManagementPage.end = fromInputDate(e.target.value)}/>
        </label>
      </div>
    </div>
    <div className={styles.problemsGroup}>
      <ProblemsList problems={[...workManagementPage.problems]}/>
    </div>
    <div>
      <WorkAssignmentsList assignments={[...workManagementPage.assignments]}/>
    </div>
    {workManagementPage.showProblemSelector &&
        <ProblemSelectorModal excludedIds={workManagementPage.problemIds()}
                              onSelect={p => workManagementPage.addProblem(p)} onClose={() => {
          workManagementPage.showProblemSelector = false
        }}/>}
    {workManagementPage.showGroupSelector && <GroupSelectorModal
        excludedIds={workManagementPage.assignedGroupIds()}
        onSelect={g => workManagementPage.addAssignment(g)} onClose={() => {
      workManagementPage.showGroupSelector = false
    }}/>}
    {workManagementPage.editAssignmentGroupId != undefined &&
        <EditAssignmentModal
            assignment={workManagementPage.assignments.filter(a => a.group.id == workManagementPage.editAssignmentGroupId)[0]}
            onClose={() => workManagementPage.editAssignmentGroupId = undefined}
            onChange={a => workManagementPage.updateAssignment(a)}
            onDelete={_ => workManagementPage.removeAssignment()}
        />
    }

    {/*<ProblemsList problems={work.problems}/>*/}

  </div>
})

export default WorkManagementPage
