import { Group } from "../../../../../../types"
import { useHistory } from "react-router-dom"
import styles from "./GroupListItem.module.css"

const GroupListItem = ({ group }: { group: Group }) => {
  const history = useHistory()

  return <tr onClick={e => history.push(`/teaching/groups/${group.id}`)}
             className={styles.groupRow}>
    <td>{group.id}</td>
    <td>{group.name}</td>
    <td>{group.students.length}</td>
  </tr>
}

export default GroupListItem
