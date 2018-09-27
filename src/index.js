import CodeEditor from './code-editor'

const openCodeStr = 'open-code'

const codeCommandFactory = opts => {
  let codeEditor = null
  return {
    id: openCodeStr,
    run: (editor, senderBtn) => {
      if (!codeEditor) codeEditor = new CodeEditor(editor, senderBtn, opts)
      codeEditor.showCodePanel()
    },
    stop: (editor, senderBtn) => {
      if (codeEditor) codeEditor.hideCodePanel()
    }
  }
};

export { codeCommandFactory }
