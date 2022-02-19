import { makeAutoObservable } from "mobx"
import { TestExecutionEvent, TestExecutionEventType } from "../../types"

export enum TestProgressBarStatus {
  WAITING,
  SENT,
  TESTING,
  SUCCEED,
  FAILED_TEST,
  FAILED_COMPILATION
}

class TestProgressBar {
  totalTests: number = 0
  failed: number = 0
  succeed: number = 0
  status: TestProgressBarStatus = TestProgressBarStatus.WAITING

  get passedTest() {
    return this.failed + this.succeed
  }

  constructor() {
    makeAutoObservable(this)
  }

  update(event: TestExecutionEvent) {
    if (event.type == TestExecutionEventType.StartExecution) {
      this.failed = 0
      this.succeed = 0
      this.updateStatus()
    } else if (event.type == TestExecutionEventType.TestCaseSucceed) {
      this.succeed += 1
      this.updateStatus()
    } else if (event.type == TestExecutionEventType.TestCaseFailed) {
      this.failed += 1
      this.updateStatus()
    } else if (event.type == TestExecutionEventType.CompilationFailed) {
      this.failed = this.totalTests
      this.status = TestProgressBarStatus.FAILED_COMPILATION
    } else if (event.type == TestExecutionEventType.SubmissionFailed) {
      this.status = TestProgressBarStatus.FAILED_TEST
    } else if (event.type == TestExecutionEventType.SubmissionPassed) {
      this.status = TestProgressBarStatus.SUCCEED
    }
  }

  updateStatus() {
    if (this.succeed == this.totalTests) {
      this.status = TestProgressBarStatus.SUCCEED
    } else if (this.passedTest == this.totalTests) {
      this.status = TestProgressBarStatus.FAILED_TEST
    } else if (this.passedTest == this.totalTests) {

    } else {
      this.status = TestProgressBarStatus.TESTING
    }
  }

}

export default new TestProgressBar()
