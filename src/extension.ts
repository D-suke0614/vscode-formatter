// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as prettier from 'prettier';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('extension.formatWithPrettier', async () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const document = editor.document;
      const selection = editor.selection;

      // 選択されたテキスト、または全体を取得
      const text = selection.isEmpty ? document.getText() : document.getText(selection);

      // Prettierの設定を取得してフォーマット
      const formatted = await prettier.format(text, {
        semi: true, // セミコロンを必ず追加
        parser: 'babel', // JavaScript用パーサ
      });

      // エディタにフォーマットされたテキストを書き戻す
      editor.edit(editBuilder => {
        if (selection.isEmpty) {
          const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(document.getText().length)
          );
          editBuilder.replace(fullRange, formatted);
        } else {
          editBuilder.replace(selection, formatted);
        }
      });

      vscode.window.showInformationMessage('Code formatted with Prettier!');
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
