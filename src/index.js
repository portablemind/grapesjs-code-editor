import CodeEditor from './code-editor'
import panels from './panels'

const codeCommandFactory = () => {
  let codeEditor = null
  return {
    id: 'open-code',
    run: (editor, senderBtn) => {
      if (!codeEditor) codeEditor = new CodeEditor(editor)
      codeEditor.showCodePanel()
    },
    stop: (editor, senderBtn) => {
      if (codeEditor) codeEditor.hideCodePanel()
    }
  }
}

export { codeCommandFactory, panels }
