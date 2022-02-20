import { SolutionStatus, User, WorkGroupAssignment } from "./types"
import { DateTime } from "luxon"

export const fullName = (user: User) => user.lastName + " " + user.firstName

export const range = (start: number, end: number) => {
  return (end - start) == 0 ? [] : [...Array(end - start)].map((_, i) => i + start)
}

export const readableDateTime = (dateTime: DateTime | undefined) => {
  if (!dateTime) return ""
  if (+dateTime.startOf("day") == +DateTime.now().startOf("day")) {
    return dateTime.toLocaleString({ timeStyle: "short" })
  }
  return dateTime.toLocaleString({ dateStyle: "medium" })
}
export const validateEmail = (email: string) => {
  return String(email)
  .toLowerCase()
  .match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )
}

export const capitalize = (word: string) => {
  if (!word) return word
  return word[0].toUpperCase() + word.substring(1)
  .toLowerCase()
}

export enum AssignmentStatus {
  not_started,
  in_progress,
  closed,
  no_problems,
  all_problems_solved
}

export const assignmentStatus = (assignment: WorkGroupAssignment) => {
  const start = fromDateString(assignment.start)

  if (start != null && +start > +DateTime.now()) {
    return AssignmentStatus.not_started
  }

  const end = fromDateString(assignment.end)
  if (end != null && +end < +DateTime.now()) {
    return AssignmentStatus.closed
  }

  if (assignment.work.problems.length == 0) return AssignmentStatus.no_problems

  if (assignment.work.problems.length == assignment.work.problems.filter(p => p.userSolutionInfo?.status == SolutionStatus.Accepted).length) {
    return AssignmentStatus.all_problems_solved
  }

  return AssignmentStatus.in_progress
}

export const fromDateString = (dateStr: string | undefined) => {
  return dateStr ? DateTime.fromISO(dateStr) : undefined
}

export const toInputDate = (dateStr: string) => DateTime.fromISO(dateStr).toFormat("yyyy-MM-dd\'T\'hh:mm")

export const fromInputDate = (dateStr: string) => DateTime.fromISO(dateStr).toFormat("yyyy-MM-dd\'T\'hh:mm\'Z\'")
