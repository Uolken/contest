import { WorkGroupAssignment, WorkType } from "../../types"
import modalStyles from "../Modal.module.css"
import { ReactComponent as CrossIcon } from "../../images/icons/cross.svg"
import * as React from "react"
import { useState } from "react"
import styles from './EditAssignmentModal.module.css'
import Button, { ButtonType } from "../../components/Button/Button"
import { DateTime } from "luxon"
import { fromDateString } from "../../utils"

export default ({
                  assignment,
                  onChange,
                  onDelete,
                  onClose
                }: { assignment: WorkGroupAssignment, onChange: (a: WorkGroupAssignment) => void, onDelete: (a: WorkGroupAssignment) => void, onClose: () => void }) => {
  const [start, setStart] = useState(assignment.start ? fromDateString(assignment.start) : null)
  const [end, setEnd] = useState(assignment.end ? fromDateString(assignment.end) : null)
  return <>
    <div className={modalStyles.modalBack} onClick={onClose}></div>
    <div className={modalStyles.modal}>
      <div className={modalStyles.modalHeader}>
        <h1>Работа "{assignment.work.name}" для группы {assignment.group.name}</h1>
        <div onClick={onClose} style={{ cursor: "pointer" }}>
          <CrossIcon/>
        </div>
      </div>
      <div>
        <div className={"multirow-form"}>
          <label>
            <div>
              Начало:
            </div>
            <input type="datetime-local" value={start?.toFormat("yyyy-MM-dd\'T\'hh:mm") || ""}
                   onChange={e => e.target.value ? setStart(fromDateString(e.target.value)) : setStart(null)}/>
          </label>
          <label>
            <div>
              Окончание:
            </div>
            <input type="datetime-local" value={end?.toFormat("yyyy-MM-dd\'T\'hh:mm") || ""}
                   onChange={e => e.target.value ? setEnd(fromDateString(e.target.value)) : setEnd(null)}/>
          </label>
        </div>
      </div>
      <div className={styles.bottomRow}>
        <Button text={"Сохранить изменения"} action={() => {
          onChange({
            work: assignment.work,
            group: assignment.group,
            start: start,
            end: end,
            type: WorkType.Homework
          })
        }}/>
        <Button text={"Отменить работу"} action={() => {
          onDelete(assignment)
        }} type={ButtonType.Red}/>
      </div>
    </div>
  </>
}
