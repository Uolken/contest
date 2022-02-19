import styles from './TestCaseEditorBlock.module.css'
import problemManagementPage from "../../../../../store/pages/problemManagementPage"
import { ReactComponent as ArrowDownIcon } from '../../../../../images/icons/arrow-down-icon.svg'
import { ReactComponent as ArrowUpIcon } from '../../../../../images/icons/arrow-up-icon.svg'
import { ReactComponent as PlusIcon } from "../../../../../images/icons/plus-icon.svg"
import * as React from "react"
import { observer } from "mobx-react-lite"
import { ReactComponent as TrashIcon } from "../../../../../images/icons/trash-icon.svg"
import classNames from "classnames"
import { range } from "../../../../../utils"
import Button from "../../../../../components/Button/Button"

const TestCasesEditorBlock = observer(() => {
  const testCaseCount = problemManagementPage.testCaseCount()
  return <div className={styles.testCasesEditorBlock}>
    <div className={styles.header}>
      <button className={"addButton"} onClick={() => problemManagementPage.addTestCase()}>
        <PlusIcon/>
        <div>Добавить тест</div>
      </button>
    </div>
    {range(0, testCaseCount || 0)
    .map((c, i) => <TestCaseRow index={i} key={i}/>)}
  </div>
})

const cutText = (text: string, length: number) => {
  const breakLineIndex = text.indexOf("\n")
  const cutedText = text.substring(0, Math.min(length, breakLineIndex != -1 ? breakLineIndex : text.length))
  return cutedText + (cutedText != text ? "..." : "")
}

const TestCaseRow = observer(({ index }: { index: number }) => {
  const testCase = problemManagementPage.problemTestCases![index]
  const rowIsClosed = problemManagementPage.openedTestCaseEditor != index
  if (rowIsClosed) {
    return <div className={classNames(styles.caseRow)}>
      <div className={styles.closedRow}>
        <div>#{testCase.id || "NEW"}</div>
        <div className={styles.testCaseTitle}>Ввод: "{cutText(testCase.input, 10)}"</div>
        <div className={styles.testCaseTitle}>Вывод: "{cutText(testCase.outputs[0], 10)}"</div>
        <div className={styles.icon}
             onClick={() => problemManagementPage.setOpenedTestCaseEditor(index)}><ArrowDownIcon
          width={16} height={16}/></div>
      </div>
    </div>
  }
  return <div className={classNames(styles.caseRow)}>
    <div className={styles.rowHeader}>
      <div>#{testCase.id || "NEW"}</div>
      <div className={styles.icon}
           onClick={() => problemManagementPage.setOpenedTestCaseEditor(undefined)}><ArrowUpIcon
        width={16} height={16}/></div>
    </div>
    <TestCaseBlock index={index}/>
  </div>
})

const TestCaseBlock = observer(({ index }: { index: number }) => {
  const testCase = problemManagementPage.problemTestCases![index]

  return <div className={styles.testCaseEditorBlock}>
    <div>
      <button className={styles.deleteTestCaseButton}
              onClick={() => problemManagementPage.removeTestCase(index)}><TrashIcon/></button>
    </div>
    <div className={styles.testCase}>
      <div className={styles.inputAndOutput}>
        <div className={styles.input}>
          <div className={styles.testCaseTitle}>Ввод</div>
          <div>
            <textarea className={styles.inputTextarea}
                      style={{ height: (testCase.input.split('\n').length) * 28 }}
                      value={testCase.input}
                      onChange={e => problemManagementPage.setTestCaseInput(index, e.target.value)}
                      autoFocus={problemManagementPage.openedTestCaseEditor == index}
            />
            {/*<Editor editorState={inputState!} onChange={s => {*/}
            {/*  setInputState(s)*/}
            {/*}}/>*/}
          </div>
        </div>
        <div className={styles.outputs} onBlur={() => {
        }}>
          <div className={classNames(styles.testCaseTitle, styles.outputsTitle)}>
            <div>Вывод</div>
            <PlusIcon onClick={() => problemManagementPage.addTestCaseOutput(index)}/></div>
          {/*{testCase.outputs.map((o, i) => <input type="text" value={o} key={o+"_"+i} onChange={v => problemManagementPage.problemTestCases![index].outputs[i] = v.target.value}/>)}*/}
          {testCase.outputs.map((o, i) => <OutputEditor testCaseIndex={index} key={i}
                                                        outputIndex={i}/>)}
        </div>
      </div>
    </div>
  </div>
})

const OutputEditor = ({
                        testCaseIndex,
                        outputIndex
                      }: { testCaseIndex: number, outputIndex: number }) => {
  const output = problemManagementPage.problemTestCases![testCaseIndex].outputs[outputIndex]

  return <textarea value={output} key={outputIndex} className={styles.output}
                   autoFocus={outputIndex == problemManagementPage.focusOutput}
                   style={{ height: (output.split('\n').length) * 28 }}
                   onKeyDown={(e) => {
                     if (e.key == "Backspace") {
                       problemManagementPage.removeOutputIfEmpty(testCaseIndex, outputIndex)
                     }
                   }}
                   onChange={v => {
                     problemManagementPage.setTestCaseOutput(testCaseIndex, outputIndex, v.target.value)
                   }}/>

}

export default TestCasesEditorBlock
