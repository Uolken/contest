import { Example } from "../../../../types"
import styles from "./ExampleBlock.module.css"

const ExampleBlock = ({ example }: { example: Example }) => {
  return <div>
    <div className={styles.inputAndOutput}>
      <div className={styles.input}>
        <div className={styles.exampleTitle}>Ввод</div>
        <div>
          {example.input}
        </div>
      </div>
      <div className={styles.output}>
        <div className={styles.exampleTitle}>Вывод</div>
        <div>
          {example.output}
        </div>
      </div>
    </div>
    <div className={styles.comment}>
      {example.comment}
    </div>
  </div>
}

export default ExampleBlock
