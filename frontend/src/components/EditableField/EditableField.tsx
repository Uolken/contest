import { useEffect, useRef, useState } from "react"
import styles from "./EditableField.module.css"
import { ReactComponent as EditIcon } from "../../images/icons/edit-icon.svg"
import * as React from "react"

const EditableField = ({
                         value,
                         onChange,
                         placeholder
                       }: { value: string | undefined, placeholder: string, onChange: (s: string) => void }) => {
  const problemName = value
  const [editName, setEditName] = useState(false)

  const startEditing = () => {
    if (editName) return
    setEditName(true)
  }
  const stopEditing = () => {
    setEditName(false)
  }

  const span = useRef<HTMLHeadingElement>(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    setWidth(span.current!.offsetWidth + 11)
  }, [problemName])
  return <div className={styles.editableField}>
    <div onBlur={stopEditing} className={styles.value}>
      {/*https://stackoverflow.com/questions/65011555/auto-scaling-input-to-width-of-value-in-react#answer-65024003*/}
      <span ref={span}
            style={{
              position: "absolute",
              opacity: 0,
              whiteSpace: "pre",
              zIndex: -1,
              // left:0, top: 0
            }}>{problemName}</span>
      {editName ? <input type="text" value={problemName}
        // onChange={e => problemManagementPage.problemName = e.target.value}
                         onChange={e => onChange(e.target.value)}
                         style={{ width }}
                         onKeyDown={e => e.key == "Enter" && stopEditing()}
                         autoFocus={true}
      /> : value ? <div>{value}</div> : <div className={styles.placeholder} onClick={startEditing}>{placeholder}</div>}
    </div>
    <div className={styles.editButton} onClick={startEditing}><EditIcon/></div>
  </div>
}

export default EditableField
