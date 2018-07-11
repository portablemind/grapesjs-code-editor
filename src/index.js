import CodeEditor from './code-editor'

const openCodeStr = 'open-code'

const codeCommandFactory = () => {
  let codeEditor = null
  return {
    id: openCodeStr,
    run: (editor, senderBtn) => {
      if (!codeEditor) codeEditor = new CodeEditor(editor)
      codeEditor.showCodePanel()
    },
    stop: (editor, senderBtn) => {
      if (codeEditor) codeEditor.hideCodePanel()
    }
  }
}

export { codeCommandFactory }
