import { User } from "../../../../../../types"
import { fullName } from "../../../../../../utils"

const StudentListItem = ({student}: {student: User}) => {
  return <tr>
    <td>{student.id}</td>
    <td>{student.email}</td>
    <td>{fullName(student)}</td>
  </tr>
}

export default StudentListItem
