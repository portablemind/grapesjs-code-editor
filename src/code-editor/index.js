import Split from 'split.js'

class CodeEditor {
  constructor (editor) {
    this.editor = editor
    this.isShowing = true
    this.buildCodePanel(editor)
  }

  findPanel () {
    const pn = this.editor.Panels
    const id = 'views-container'
    const panel = pn.getPanel(id) || pn.addPanel({ id })
    return panel
  }

  findWithinEditor (arg) {
    return this.editor.$(arg, this.editor.getEl())
  }

  buildCodeEditor (type) {
    let codeEditor = this.editor.CodeManager.getViewer('CodeMirror').clone()
    codeEditor.set({
      codeName: type === 'html' ? 'htmlmixed' : 'css',
      readOnly: false,
      theme: 'hopscotch',
      autoBeautify: true,
      autoCloseTags: true,
      autoCloseBrackets: true,
      styleActiveLine: true,
      smartIndent: true
    })
    return codeEditor
  }

  buildSection (type, editor, textArea) {
    const section = document.createElement('section')
    section.innerHTML = `
      <div class="codepanel-separator">
        <div class="codepanel-label">${type}</div>
        <button class="cp-save-${type}">Save</button>
      </div>`
    section.appendChild(textArea)
    this.codePanel.appendChild(section)
    return section
  }

  buildCodePanel (editor) {
    const panel = this.findPanel()
    this.codePanel = document.createElement('div')
    this.codePanel.classList.add('code-panel')

    this.htmlCodeEditor = this.buildCodeEditor('html')
    this.cssCodeEditor = this.buildCodeEditor('css')
    const htmlTextArea = document.createElement('textarea')
    const cssTextArea = document.createElement('textarea')
    const sections = [
      this.buildSection('html', this.htmlCodeEditor, htmlTextArea),
      this.buildSection('css', this.cssCodeEditor, cssTextArea)
    ]
    panel.set('appendContent', this.codePanel).trigger('change:appendContent')
    this.htmlCodeEditor.init(htmlTextArea)
    this.cssCodeEditor.init(cssTextArea)
    this.updateEditorContents()

    this.findWithinEditor('.cp-save-html')
      .get(0)
      .addEventListener('click', this.updateHtml.bind(this))
    this.findWithinEditor('.cp-save-css')
      .get(0)
      .addEventListener('click', this.updateCss.bind(this))

    Split(sections, {
      direction: 'vertical',
      sizes: [50, 50],
      minSize: 100,
      gutterSize: 2,
      onDragEnd: this.refreshEditors.bind(this)
    })

    this.editor.on('component:add', model => {
      this.updateEditorContents()
    })
    this.editor.on('component:remove', model => {
      this.updateEditorContents()
    })
    this.editor.on('component:update', model => {
      this.updateEditorContents()
    })

    return this.codePanel
  }

  showCodePanel () {
    this.isShowing = true
    this.updateEditorContents()
    this.codePanel.style.display = 'block'
    // make sure editor is aware of width change after the 300ms effect ends
    setTimeout(this.refreshEditors.bind(this), 320)
    this.findWithinEditor('.gjs-pn-views-container').get(0).style.width = '35%'
    this.findWithinEditor('.gjs-cv-canvas').get(0).style.width = '65%'
  }

  hideCodePanel () {
    if (this.codePanel) this.codePanel.style.display = 'none'
    this.findWithinEditor('.gjs-pn-views-container').get(0).style.width = '15%'
    this.findWithinEditor('.gjs-cv-canvas').get(0).style.width = '85%'
    this.isShowing = false
  }

  refreshEditors () {
    this.htmlCodeEditor.editor.refresh()
    this.cssCodeEditor.editor.refresh()
  }

  updateHtml () {
    const htmlCode = this.htmlCodeEditor.editor.getValue()
    if (!htmlCode || htmlCode === this.previousHtmlCode) return
    this.previousHtmlCode = htmlCode
    this.editor.setComponents(htmlCode)
  }

  updateCss () {
    const cssCode = this.cssCodeEditor.editor.getValue()
    if (!cssCode || cssCode === this.previousCssCode) return
    this.previousCssCode = cssCode
    this.editor.setStyle(cssCode)
  }

  updateEditorContents () {
    if (!this.isShowing) return
    this.htmlCodeEditor.setContent(this.editor.getHtml())
    this.cssCodeEditor.setContent(this.editor.getCss({ avoidProtected: true }))
  }
}

export default CodeEditor
