import { observer } from "mobx-react-lite"
import testProgressBar, { TestProgressBarStatus } from "../../store/components/testProgressBar"
import styles from "./TestProgressBar.module.css"

const TestProgressBar = observer (() => {
  const succeedPercent = testProgressBar.succeed / testProgressBar.totalTests * 100
  const failedPercent = testProgressBar.failed / testProgressBar.totalTests * 100
  let message = ""
  if (testProgressBar.status == TestProgressBarStatus.TESTING) {
    message = `Выполняется: ${testProgressBar.passedTest}/${testProgressBar.totalTests}`
  } else if (testProgressBar.status == TestProgressBarStatus.SUCCEED) {
    message = `Выполнено: ${testProgressBar.passedTest}/${testProgressBar.totalTests}`
  } else if (testProgressBar.status == TestProgressBarStatus.FAILED_COMPILATION) {
    message = `Ошибка компиляции`
  }
  return <div>
    <div className={styles.progressBar}>
      <span className={styles.message}> {message} </span>
      <div className={styles.succeedPart} style={{ width: succeedPercent + "%" }}/>
      <span className={styles.failedPart} style={{ width: failedPercent + "%" }}/>
    </div>
  </div>
})

export default TestProgressBar
