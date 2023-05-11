// const simpleGit = require('simple-git');
const vscode = require('vscode');
const { execSync } = require('child_process');
const { dirname } = require('path');

/**
 * use ThemeIcon
 */
function activate(context) {

  let initBtn = vscode.commands.registerCommand('gitbtn.initBtn', function () {
    const myButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Center, 100);
    myButton.tooltip = "Open RemoteRepository";
    myButton.text = `$(github)`
    myButton.color = 'white';
    myButton.command = 'gitbtn.openRepository';
    myButton.show();
  });

  let disposable = vscode.commands.registerCommand('gitbtn.gitbtnInfo', function () {
    vscode.window.showInformationMessage('gitbtn create by larryane!');
  });

	let openRepository = vscode.commands.registerCommand('gitbtn.openRepository', async function () {
		// 获取当前文件路径和行号
		const editor = vscode.window.activeTextEditor;
		const filePath = editor.document.uri.fsPath;
		const lineNumber = editor.selection.active.line + 1;
	
		if (!filePath) {
			vscode.window.showErrorMessage('No file is opened in the editor!');
			return;
		}
		function getGitRepositoryUrl(filePath) {
			try {
				// 执行 "git remote get-url origin" 命令获取 Git 仓库的 URL
				const gitRepoUrl = execSync(`git remote get-url origin`, {
					cwd: dirname(filePath),
					encoding: 'utf-8',
				}).trim();
				return gitRepoUrl;
			} catch (error) {
				console.error(error);
				return null;
			}
		}

		const gitRepoUrl = getGitRepositoryUrl(filePath);

		// 打开外部 URI
		const externalUri = await vscode.env.asExternalUri(vscode.Uri.parse(gitRepoUrl));
		vscode.env.openExternal(externalUri);

	});
	
  // 将命令注册到插件上下文中，以便在插件停用时自动注销
	/**
	 * Registering commands in the plugin context 
	 * for automatic logout when the plugin is disabled
	 */
  context.subscriptions.push(initBtn);
  context.subscriptions.push(disposable);
  context.subscriptions.push(openRepository);

  // 初始化插件
	// init plugin
  vscode.commands.executeCommand('gitbtn.initBtn');
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};