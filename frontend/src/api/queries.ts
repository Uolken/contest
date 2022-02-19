import { Query } from "./graphQLApi"
import {
  Group,
  Problem,
  ProblemSelectorInput,
  ProblemSelectorWithPageInput,
  ProblemUpdateDtoInput, Submission, SubmissionSelectorInput, SubmissionSelectorWithPageInput,
  TestCase,
  TestCaseDtoInput, UpdateGroupRequestInput,
  User,
  UserSelectorInput,
  Work, WorkAssignmentDtoInput,
  WorkGroupAssignment,
  WorkSelectorInput,
  WorkSelectorWithPageInput, WorkUpdateDtoInput,
} from "../types"

export const ASSIGNED_WORKS_WITH_SOLUTION_INFO: Query<{ groupId: number, userId: number }, { workAssignments: Array<WorkGroupAssignment> }> = {
  query: `
query groupAssignedWorksWithSolutionInfo($groupId: Long!, $userId: Long!) {
  workAssignments(groupId: $groupId) {
    start
    end
    work {
      id
      name
      problems {
        id
        name
        tags {
          id
          name
        }
        userSolutionInfo(userId: $userId) {
          tryCount
          status
        }
      }
      author {
        id
        role
        email
        firstName
        lastName
      }
    }
  }
}
`
}

export const USER_WITH_ASSIGNMENT: Query<{ workId: number, userId: number }, { user: User }> = {
  query: `
query userWithAssignment($workId: Long!, $userId: Long!) {
  user(userId: $userId) {
    id
    firstName
    lastName
    email
    group {
      id
      name
      workAssignment(workId: $workId) {
        start
        end
        work {
          id
          name
          problems {
            id
            name
            tags {
              id
              name
            }
            userSolutionInfo(userId: $userId) {
              tryCount
              status
            }
          }
        }
      }
    }
  }
}

`
}


export const USER_WORK: Query<{ userId: number, workId: number }, { work: Work }> = {
  query: `
query userWork($userId: Long!, $workId: Long!) {
  work(id: $workId) {
    id  
    name
    start
    end
    problems {
      id
      name
      text
      tags {
        id
        name
      }
      userSolutionInfo(userId: $userId) {
        tryCount
        status
      }
    }
    author {
      id
      role
      email
      firstName
      lastName
    }
  }
}
`
}


export const WORK: Query<{ workId: number }, { work: Work }> = {
  query: `
query userWork($workId: Long!) {
  work(id: $workId) {
    id  
    name
    start
    end
    problems {
      id
      name
      text
      tags {
        id
        name
      }
    }
    author {
      id
      role
      email
      firstName
      lastName
    }
    assignments {
      start
      end
      group {
        id
        name
      }
    }
  }
}
`
}

export const WORKS: Query<{ selector: WorkSelectorWithPageInput }, { works: Array<Work> }> = {
  query: `
query works($selector: WorkSelectorWithPageInput!) {
  works(workSelectorWithPage: $selector) {
    id  
    name
    start
    end
    problems {
      id
      name
      tags {
        id
        name
      }
    }
    author {
      id
      role
      email
      firstName
      lastName
    }
  }
}
`
}

export const WORK_COUNT: Query<{ selector: WorkSelectorInput }, { workCount: number }> = {
  query: `
query workCount($selector: WorkSelectorInput!) {
  workCount(workSelector: $selector)
}
`
}

export const USER_WORK_PROBLEM: Query<{ userId: number, problemId: number, workId: number }, { work: Work, problem: Problem }> = {
  query: `
query workProblem($problemId: Long!, $workId: Long!, $userId: Long!) {
  problem: workProblem(workId: $workId, problemId: $problemId) {
    id
    name
    text
    testCaseCount
    examples {
      input
      output
      comment
    }
    author {
      id
      email
      firstName
      lastName
    }
    tags {
      id
      name
    }
    userSolutionInfo(userId: $userId) {
      tryCount
      status
    }
  }
  work(id: $workId) {
    id
    name
    start
    end
    author {
      id
      email
    }
  }
}
`
}

export const PROBLEM: Query<{ problemId: number }, { problem: Problem }> = {
  query: `
query problem($problemId: Long!) {
  problem(problemId: $problemId) {
    id
    name
    text
    examples {
      input
      output 
      comment
    }
    author {
      id
      firstName
      lastName
      email
    }
    testCases {
      id
      input
      outputs
    }
  }
}
`
}

export const LIBRARY_PROBLEMS: Query<{ page: number, size: number }, { problems: Problem[] }> = {
  query: `
query libraryProblems($page: Int!, $size: Int!) {
  problems: libraryProblems(page: $page, size: $size) {
    id
    name
    author {
      id
      email
    }
    name
    tags {
      id 
      name
    }
  }
}
`
}

export const PROBLEMS: Query<{ selector: ProblemSelectorWithPageInput }, { problems: Array<Problem> }> = {
  query: `
query problems($selector: ProblemSelectorWithPageInput!) {
  problems(problemSelectorWithPage: $selector) {
    id
    name
    tags {
      id
      name
    }
    author {
      id
      firstName
      lastName
    }
  }
}
`
}

export const PROBLEM_COUNT: Query<{ selector: ProblemSelectorInput }, { problemCount: number }> = {
  query: `
query problemCount($selector: ProblemSelectorInput!) {
  problemCount(problemSelector: $selector)
}
`
}
export const LIBRARY_PROBLEM: Query<{ userId: number, problemId: number }, { problem: Problem }> = {
  query: `
query libraryProblem($userId: Long!, $problemId: Long!) {
  problem: libraryProblem(id: $problemId) {
    id
    name
    text
    examples {
      comment
      input
      output
    }
    author {
      id
      email
      firstName
      lastName
    }
    name
    tags {
      id 
      name
    }
    userSolutionInfo(userId: $userId) {
      status
      tryCount
    }
    testCaseCount
  }
}
`
}

export const GROUPS: Query<{}, { groups: Array<Group> }> = {
  query: `
query {
  groups {
    id
    name 
    students {
      id
    }
  }
}
`
}
export const GROUP: Query<{ groupId: number }, { group: Group }> = {
  query: `
query group($groupId: Long!){
  group(groupId: $groupId) {
    id
    name
    students {
      id
      email
      firstName
      lastName
    }
    workAssignments {
      start
      end
      work {
        id
        name
        start
        end
        problems {
          id
        }
      }
    }
  }
}
`
}

export const UPDATE_GROUP: Query<{ updateGroupRequest: UpdateGroupRequestInput }, { group: Group }> = {
  query: `
mutation createGroup($updateGroupRequest: UpdateGroupRequestInput!) {
  group: createGroup(updateGroupRequest: $updateGroupRequest) {
    id,
    name
  }
}
`
}
export const SUBMISSIONS: Query<{ selector: SubmissionSelectorWithPageInput }, { submissions: Array<Submission> }> = {
  query: `
query submissions($selector: SubmissionSelectorWithPageInput!) {
  submissions(selector: $selector) {
    id
    status
    language
    submitted
    executionResult {
      error {
        failReason
        testCaseExecutionResult {
          testCase {
            id
          }
        }
      }
    }
    problem {
      id
      name
    }
  }
}
`}

export const SUBMISSION: Query<{ submissionId: string }, { submission: Submission }> = {
  query: `
query submissions($submissionId: String!) {
  submission(submissionId: $submissionId) {
    id
    status
    language
    submitted
    code
    problem {
      id
      name
    }
  }
}
`
}
export const SUBMISSION_COUNT: Query<{ selector: SubmissionSelectorInput }, { submissionCount: number }> = {
  query: `
query submissionCount($selector: SubmissionSelectorInput!) {
  submissionCount(selector: $selector)
}
`
}

export const USER_WITH_PROBLEMS: Query<{ userId: number }, { user: User }> = {
  query: `
query user($userId: Long!) {
  user(userId: $userId) {
    id
    firstName
    lastName
    email
    group {
      id
      name
      workAssignments {
        start
        end
        work {
          id 
          name
          problems {
            id
            name
            tags {
              id
              name
            }
            userSolutionInfo(userId: $userId) {
              tryCount
              status
            }
          }
        }
      }
    }
  }
}
`
}
export const USER: Query<{ userId: number }, { user: User }> = {
  query: `
query user($userId: Long!) {
  user(userId: $userId) {
    id
    firstName
    lastName
    email
    group {
      id
      name
    }
  }
}
`
}

export const USER_WITH_WORK_PROBLEM: Query<{ userId: number, workId: number, problemId: number }, { user: User, problem: Problem }> = {
  query: `
query userWithAssignment($userId: Long!, $workId: Long!, $problemId: Long!) {
  user(userId: $userId) {
    id
    firstName
    lastName
    email
    group {
      id
      name
      workAssignment(workId: $workId) {
        start
        end
        work {
          id
          name
        }
      }
    }
  }
  problem: workProblem(problemId: $problemId, workId: $workId) {
    id
    name
    text
    tags {
      id
      name
    }
    userSolutionInfo(userId: $userId) {
      tryCount
      status
    }
    author {
      id
      role
      email
    }
  }
}

`
}

export const USERS: Query<{ selector: UserSelectorInput }, { users: Array<User> }> = {
  query: `
query users($selector: UserSelectorInput!) {
  users(selector: $selector) {
    id
    firstName
    lastName
    email
    group {
      id
      name
    }
  }
}
`
}

export const USER_COUNT: Query<{ selector: UserSelectorInput }, { userCount: number }> = {
  query: `
query count($selector: UserSelectorInput!) {
  userCount(selector: $selector) 
}
`
}


export const SAVE_WORK: Query<{ work: WorkUpdateDtoInput }, { work: Work }> = {
  query: `
mutation saveWork($work: WorkUpdateDtoInput!) {
  work: saveWork(workUpdateInput: $work) {
    id
  }
}
`
}
export const SAVE_GROUP_ASSIGNMENTS: Query<{ groupId: number, workAssignments: Array<WorkAssignmentDtoInput> }, {}> = {
  query: `
mutation saveAssignments($groupId: Long!, $workAssignments: [WorkAssignmentDtoInput!]!) {
  assignments: saveGroupAssignments(groupId: $groupId, workAssignments: $workAssignments)
}
`
}
export const SAVE_WORK_ASSIGNMENTS: Query<{ workId: number, workAssignments: Array<WorkAssignmentDtoInput> }, {}> = {
  query: `
mutation saveAssignments($workId: Long!, $workAssignments: [WorkAssignmentDtoInput!]!) {
  assignments: saveWorkAssignments(workId: $workId, workAssignments: $workAssignments)
}
`
}

export const SAVE_PROBLEM: Query<{ problem: ProblemUpdateDtoInput }, { problem: Problem }> = {
  query: `
mutation saveProblem($problem: ProblemUpdateDtoInput!) {
  problem: saveProblem(newProblem: $problem) {
    id
  }
}
`
}
export const SAVE_TEST_CASES: Query<{ problemId: number, testCases: Array<TestCaseDtoInput> }, { count: number }> = {
  query: `
mutation saveTestCases($problemId: Long!, $testCases: [TestCaseDtoInput!]!) {
  count: saveTestCases(problemId: $problemId, testCases: $testCases) 
}
`
}

