import styles from "./ProblemManagementPage.module.css"
import {
  DraftBlockType,
  Editor,
  EditorCommand,
  EditorState,
  getDefaultKeyBinding,
  Modifier,
  RichUtils
} from "draft-js"
import * as React from "react"
import problemManagementPage from "../../../../store/pages/problemManagementPage"
import classNames from "classnames"
import { ReactComponent as BoldIcon } from "../../../../images/icons/editor/bold-icon.svg"
import { ReactComponent as ItalicIcon } from "../../../../images/icons/editor/italic-icon.svg"
import { ReactComponent as UnderlineIcon } from "../../../../images/icons/editor/underline-icon.svg"
import { observer } from "mobx-react-lite"

const TextEditor = observer(() => {
  const editorState = problemManagementPage.editorState
  const setEditorState = problemManagementPage.setEditorState.bind(problemManagementPage)

  const handleKeyCommand = (command: EditorCommand,
                            editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      setEditorState(newState)
      return 'handled'
    }
    return 'not-handled'
  }

  const toggleBlockType = (blockType: DraftBlockType) => {
    setEditorState(
      RichUtils.toggleBlockType(
        editorState,
        blockType
      )
    )
  }

  const mapKeyToEditorCommand = (e: React.KeyboardEvent<{}>) => {
    if (e.key === "Tab") {
      const modifier = Modifier.replaceText(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        "\t"
      )
      setEditorState(EditorState.push(editorState, modifier, 'insert-characters'))
      e.preventDefault()
    }

    return getDefaultKeyBinding(e)
  }

  const toggleInlineStyle = (inlineStyle: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle))
  }

  return <>
    <div className={styles.modifiers}>
      <div>
        {/*<BlockStyleControls*/}
        {/*  editorState={editorState}*/}
        {/*  onToggle={toggleBlockType}*/}
        {/*/>*/}
        <InlineStyleControls
          editorState={editorState}
          onToggle={toggleInlineStyle}
        />
      </div>
    </div>
    <div className={styles.textEditor}>
      <Editor
        editorState={editorState}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={mapKeyToEditorCommand}
        onChange={setEditorState}
        placeholder="Текст задачи"
        spellCheck={true}
      />
    </div>
  </>
})


const BLOCK_TYPES = [
  {
    label: 'H1',
    style: 'header-one',
  },
  {
    label: 'H2',
    style: 'header-two'
  },
  {
    label: 'H3',
    style: 'header-three'
  },
  {
    label: 'H4',
    style: 'header-four'
  },
  {
    label: 'H5',
    style: 'header-five'
  },
  {
    label: 'H6',
    style: 'header-six'
  },
  {
    label: 'Blockquote',
    style: 'blockquote'
  },
  {
    label: 'UL',
    style: 'unordered-list-item'
  },
  {
    label: 'OL',
    style: 'ordered-list-item'
  },
  {
    label: 'Code Block',
    style: 'code-block'
  },
]

const BlockStyleControls = ({
                              editorState,
                              onToggle
                            }: { editorState: EditorState, onToggle: (t: DraftBlockType) => void }) => {
  const selection = editorState.getSelection()
  const blockType = editorState
  .getCurrentContent()
  .getBlockForKey(selection.getStartKey())
  .getType()
  return <div className={styles.textModificationsList}>
    {BLOCK_TYPES.map((type) =>
      <StyleButton
        key={type.label}
        active={type.style === blockType}
        // icon={type.style}
        style={type.style}
        onToggle={onToggle}
      />
    )}
  </div>
}

const StyleButton = ({
                       icon,
                       onToggle,
                       active,
                       style
                     }: { icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>, active: boolean, onToggle: (t: DraftBlockType) => void, style: string }) => {
  const Icon = icon
  return <div onMouseDown={e => {
    e.preventDefault()
    onToggle(style)
  }
  } className={classNames(styles.textModification, {[styles.active]: active})}>
    {Icon && <Icon/>}
  </div>
}

const InlineStyleControls = ({
                               editorState,
                               onToggle
                             }: { editorState: EditorState, onToggle: (t: DraftBlockType) => void }) => {
  const currentStyle = editorState.getCurrentInlineStyle()
  return <div className={styles.textModificationsList}>
    {INLINE_STYLES.map((type) =>
      <StyleButton
        key={type.label}
        active={currentStyle.has(type.style)}
        icon={type.icon}
        onToggle={onToggle}
        style={type.style}
      />
    )}
  </div>
}

var INLINE_STYLES = [
  {
    label: 'Bold',
    style: 'BOLD',
    icon: BoldIcon
  },
  {
    label: 'Italic',
    style: 'ITALIC',
    icon: ItalicIcon
  },
  {
    label: 'Underline',
    style: 'UNDERLINE',
    icon: UnderlineIcon
  },
  // {
  //   label: 'Monospace',
  //   style: 'CODE',
  //   icon: UnderlineIcon
  // },
]



export default TextEditor
