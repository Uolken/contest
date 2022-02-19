import { Query } from "./graphQLApi"


export const TEST_EXECUTION_SUBSCRIPTION: Query<{ problemId: number }, { isSucceed: boolean }> = {
  query: `
subscription testExecutionSubscription($problemId: Long!) {
  problemTestExecutions(problemId: $problemId) {
    isSucceed
  }
}
`
}
