"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate({ subscriptions }) {
    const disposable = vscode.commands.registerCommand('extension.format', function () {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            // Get selection text
            const selectedText = document.getText(selection);
            const nTabs = selection.start.character;
            const tabsStr = '\t'.repeat(nTabs);
            const tabsStrPlus1 = '\t'.repeat(nTabs + 1);
            // Count how many props are in the selection
            const props = selectedText.match(/([a-z].*?=)([{"'])?(.*?)(['"}])/gm);
            const singleProps = selectedText.match(/( )([a-z]+)(=?)( +)/gmi);
            const propsCount = ((props === null || props === void 0 ? void 0 : props.length) || 0) + ((singleProps === null || singleProps === void 0 ? void 0 : singleProps.length) || 0);
            const config = vscode.workspace.getConfiguration('jsx-format');
            const minimumProps = config.get("minimumProps") || 1;
            if (propsCount >= minimumProps) {
                let newText = selectedText;
                newText = newText.replace(/( )([a-z].*?=)([{"'])?(.*?)(['"}])/gm, `\n${tabsStrPlus1}$2$3$4$5`); // props key={value} key="value"
                newText = newText.replace(/(>)(.*?)(<\/.*?)(>)$/gm, `\n${tabsStr}$1\n${tabsStrPlus1}$2\n${tabsStr}$3$4`); // <tag>children</tag>
                newText = newText.replace(/( )(\/>)$/gm, `\n${tabsStr}$2`); // ending />
                newText = newText.replace(/(\t?)([a-z]+)( +)(.*)/gmi, `$1$2\n${tabsStrPlus1}$4`); // singleProp other="stuff"
                newText = newText.replace(/(.*)( +)([a-z]+)$/gmi, `$1$2\n${tabsStrPlus1}$3`); // other="stuff" singleProp
                editor.edit(editBuilder => {
                    editBuilder.replace(selection, newText);
                });
            }
            ;
        }
    });
    subscriptions.push(disposable);
}
exports.activate = activate;
;
//# sourceMappingURL=extension.js.map