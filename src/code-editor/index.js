import Split from 'split.js';
import juice from 'juice';

class CodeEditor {
  constructor(editor, senderBtn, opts) {
    this.editor = editor;
    this.opts = opts || { inlineCss: false };
    this.senderBtn = senderBtn;
    this.isShowing = true;
    this.buildCodePanel(editor);
  }

  findPanel() {
    const pn = this.editor.Panels;
    const id = 'views-container';
    const panel = pn.getPanel(id) || pn.addPanel({ id });
    return panel;
  }

  findWithinEditor(arg) {
    return this.editor.$(arg, this.editor.getEl());
  }

  buildCodeEditor(type) {
    let codeEditor = this.editor.CodeManager.getViewer('CodeMirror').clone();
    codeEditor.set({
      codeName: type === 'html' ? 'htmlmixed' : 'css',
      readOnly: false,
      theme: 'hopscotch',
      autoBeautify: true,
      autoCloseTags: true,
      autoCloseBrackets: true,
      styleActiveLine: true,
      smartIndent: true,
    });
    return codeEditor;
  }

  buildSection(type, editor, textArea) {
    const section = document.createElement('section');
    section.innerHTML = `
      <div class="codepanel-separator">
        <div class="codepanel-label">${type}</div>
        <button class="cp-apply-${type}">Apply</button>
      </div>`;
    section.appendChild(textArea);
    this.codePanel.appendChild(section);
    return section;
  }

  buildCodePanel(editor) {
    const panel = this.findPanel();
    this.codePanel = document.createElement('div');
    this.codePanel.classList.add('code-panel');

    let sections = [];
    let cssTextArea = null;

    this.htmlCodeEditor = this.buildCodeEditor('html');
    const htmlTextArea = document.createElement('textarea');
    sections.push(this.buildSection('html', this.htmlCodeEditor, htmlTextArea));

    if (!this.opts.inlineCss) {
      this.cssCodeEditor = this.buildCodeEditor('css');
      cssTextArea = document.createElement('textarea');
      sections.push(this.buildSection('css', this.cssCodeEditor, cssTextArea));
    }

    panel.set('appendContent', this.codePanel).trigger('change:appendContent');
    this.htmlCodeEditor.init(htmlTextArea);
    if (!this.opts.inlineCss) this.cssCodeEditor.init(cssTextArea);
    this.updateEditorContents();

    this.findWithinEditor('.cp-apply-html')
      .get(0)
      .addEventListener('click', this.updateHtml.bind(this));

    if (!this.opts.inlineCss) {
      this.findWithinEditor('.cp-apply-css')
        .get(0)
        .addEventListener('click', this.updateCss.bind(this));

      Split(sections, {
        direction: 'vertical',
        sizes: [50, 50],
        minSize: 100,
        gutterSize: 2,
        onDragEnd: this.refreshEditors.bind(this),
      });
    }

    return this.codePanel;
  }

  showCodePanel() {
    this.isShowing = true;
    this.updateEditorContents();
    this.codePanel.style.display = 'flex';
    // make sure editor is aware of width change after the 300ms effect ends
    setTimeout(this.refreshEditors.bind(this), 320);
    this.findWithinEditor('.gjs-pn-views-container').get(0).style.width =
      '100%';
    this.findWithinEditor('.gjs-cv-canvas').get(0).style.display = 'none';
  }

  hideCodePanel() {
    if (this.codePanel) this.codePanel.style.display = 'none';
    this.findWithinEditor('.gjs-pn-views-container').get(0).style = '';
    this.findWithinEditor('.gjs-cv-canvas').get(0).style.display = 'flex';
    this.isShowing = false;
  }

  refreshEditors() {
    this.htmlCodeEditor.editor.refresh();
    if (!this.opts.inlineCss) {
      this.cssCodeEditor.editor.refresh();
    }
  }

  updateHtml() {
    const htmlCode = this.htmlCodeEditor.editor.getValue();
    if (!htmlCode || htmlCode === this.previousHtmlCode) return;
    this.previousHtmlCode = htmlCode;
    const rootNode = this.editor.LayerManager.getRoot();
    rootNode.components(htmlCode);

    console.log(this.senderBtn);
    this.senderBtn.set('active', false);
    console.log(this.senderBtn);

    this.hideCodePanel();
  }

  updateCss() {
    const cssCode = this.cssCodeEditor.editor.getValue();
    if (!cssCode || cssCode === this.previousCssCode) return;
    this.previousCssCode = cssCode;
    this.editor.setStyle(cssCode);
  }

  updateEditorContents() {
    if (!this.isShowing) return;
    this.htmlCodeEditor.setContent(this.getGrapesHtml());

    if (!this.opts.inlineCss) {
      this.cssCodeEditor.setContent(
        this.editor.getCss({ avoidProtected: true })
      );
    }
  }

  getGrapesHtml() {
    let result = '';
    const config = this.editor.getConfig();

    if (this.opts.inlineCss) {
      const html = this.editor.getHtml();

      const htmlInlineCss = juice(
        `${html}<style>${this.editor.getCss()}</style>`
      );
      result += htmlInlineCss;
    } else {
      const exportWrapper = config.exportWrapper;
      const wrappesIsBody = config.wrappesIsBody;
      const rootNode = this.editor.LayerManager.getRoot(); // get from root, not wrapper.
      const html = this.editor.CodeManager.getCode(rootNode, 'html', {
        exportWrapper,
        wrappesIsBody,
      });

      result += html;
    }

    const js = config.jsInHtml ? this.editor.getJs() : '';
    result += js ? `<script>${js}</script>` : '';

    return result;
  }
}

export default CodeEditor;
