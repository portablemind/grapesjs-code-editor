import CodeEditor from './code-editor'
import panels from './panels'

let codeEditor = null

const codeCommand = {
  id: 'open-code',
  run: (editor, senderBtn) => {
    if (!codeEditor) codeEditor = new CodeEditor(editor)
    codeEditor.showCodePanel()
  },
  stop: (editor, senderBtn) => {
    if (codeEditor) codeEditor.hideCodePanel()
  }
}

export { codeCommand, panels }
