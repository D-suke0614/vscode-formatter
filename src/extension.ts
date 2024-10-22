import * as vscode from 'vscode';
import * as prettier from 'prettier';

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
				insertFinalNewline: false, // 末尾に改行を入れない
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
