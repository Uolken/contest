import CalendarBlock from "../CalendarBlock/CalendarBlock"
import { useEffect, useState } from "react"
import { User, WorkGroupAssignment } from "../../types"
import graphQLApi, { Query } from "../../api/graphQLApi"
import { ASSIGNED_WORKS_WITH_SOLUTION_INFO } from "../../api/queries"
import sessionInfo from "../../store/sessionInfo"

const StudentDetailsPage = () => {

  return <div>
    <div>
      Todo 6
    </div>
    <div>
      Outdated 1
    </div>
    <div>
      avg 4.4
    </div>
    <div>
      <CalendarBlock assignments={undefined}/>
    </div>
    <div>
      Activity
    </div>
    <div>
      works
    </div>
  </div>

}

export default StudentDetailsPage

