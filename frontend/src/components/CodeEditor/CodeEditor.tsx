import { observer } from "mobx-react-lite"
import Editor from "@monaco-editor/react"
import codeEditor from "../../store/components/codeEditor"
import Button from "../Button/Button"
import styles from "./CodeEditor.module.css"


const CodeEditor = observer(({readonly}: {readonly: boolean}) => {
  return <div className={styles.codeEditorBlock}>
    <div className={styles.header}>
      <select name="languageName" onChange={e => codeEditor.selectLanguage(e.target.value)}>
        {codeEditor.languages.map(l => <option value={l.value} key={l.value}> {l.title}</option>)}
      </select>

      <Button text="Отправить" action={() => codeEditor.send()}/>
    </div>
      <Editor
        height="30vh"
        language={codeEditor.currentLanguage.value}
        defaultValue={"\n\n\n\n\n\n"}
        onChange={t => codeEditor.setText(t)}
        options={{readOnly: readonly}}
        />
  </div>
})

export default CodeEditor
