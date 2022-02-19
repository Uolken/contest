import { observer } from "mobx-react-lite"
import { RouteComponentProps } from "react-router"
import groupManagementPage from "../../../../store/groupManagementPage"
import { useEffect } from "react"
import StudentList from "./StudentList/StudentList"
import BreadCrumbs from "../../../../components/BreadCrumbs/BreadCrumbs"
import AssignmentList from "./WorkList/WorkList"
import Button from "../../../../components/Button/Button"
import newGroupForm from "../../../../store/forms/newGroupForm"
import StudentSelectorModal from "../../../../modals/StudentSelectorModal/StudentSelectorModal"
import EditableField from "../../../../components/EditableField/EditableField"
import WorkSelectorModal from "../../../../modals/WorkSelectorModal/WorkSelectorModal"
import workManagementPage from "../../../../store/pages/workManagementPage"
import EditAssignmentModal from "../../../../modals/EditAssignmentModal/EditAssignmentModal"
import * as React from "react"

const GroupManagementPage = observer(({ match }: RouteComponentProps<{ groupId: string }>) => {
  useEffect(() => groupManagementPage.fetchGroup(+match.params.groupId), [])
  const group = groupManagementPage.group

  if (!group) {
    return <div>LOADING</div>
  }

  return <div className="page">
    <BreadCrumbs elements={[
      {
        name: "Группы",
        url: "/teaching/groups"
      },
      {
        name: group.name,
        url: `/teaching/groups/${group.id}`
      },
    ]}/>

    <div className={"pageHeader"}>
      <EditableField value={groupManagementPage.groupName}
                     onChange={v => groupManagementPage.groupName = v}
                     placeholder={"Название группы"}
      />
      <Button text={"Сохранить"} action={() => {
        groupManagementPage.sendUpdate()
        .then(g => window.location.reload())
        .catch(e => {
          console.log(e)
          newGroupForm.showError = true
        })

      }}/>
    </div>
    <StudentList students={groupManagementPage.students}
                 onClickAdd={() => groupManagementPage.showStudentSelector = true}
                 onRemove={(s) => {
                   groupManagementPage.removeStudent(s)
                 }}/>
    <AssignmentList assignments={[...groupManagementPage.assignments]}
                    onClickAdd={() => groupManagementPage.showWorkSelector = true}
    onEdit={w => groupManagementPage.editAssignmentWorkId = w.work.id }
    />

    {groupManagementPage.showStudentSelector &&
        <StudentSelectorModal excludedIds={groupManagementPage.students.map(s => s.id)}
                              onClose={() => groupManagementPage.showStudentSelector = false}
                              onSelect={s => groupManagementPage.addStudent(s)}/>}
    {groupManagementPage.showWorkSelector &&
        <WorkSelectorModal excludedIds={groupManagementPage.assignments.map(s => s.work.id)}
                           onClose={() => groupManagementPage.showWorkSelector = false}
                           onSelect={w => groupManagementPage.addWorkAssignment(w)}/>}
    {groupManagementPage.editAssignmentWorkId != undefined &&
        <EditAssignmentModal
            assignment={groupManagementPage.assignments.filter(a => a.work.id == groupManagementPage.editAssignmentWorkId)[0]}
            onClose={() => groupManagementPage.editAssignmentWorkId = undefined}
            onChange={a => groupManagementPage.updateAssignment(a)}
            onDelete={a => groupManagementPage.removeAssignment()}
        />
    }
  </div>
})

export default GroupManagementPage
