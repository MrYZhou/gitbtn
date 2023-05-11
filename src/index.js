const simpleGit = require('simple-git');
const vscode = require('vscode');

function activate(context) {
  // 创建 "Open RemoteRepository" 按钮
  let initBtn = vscode.commands.registerCommand('gitbtn.initBtn', function () {
    const myButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Center, 100);
    myButton.tooltip = "Open RemoteRepository";
    myButton.text = `$(github)`
    myButton.color = 'white';
    myButton.command = 'gitbtn.openRepository';
    myButton.show();
  });

  // 创建 "gitbtnInfo" 命令
  let disposable = vscode.commands.registerCommand('gitbtn.gitbtnInfo', function () {
    vscode.window.showInformationMessage('gitbtn create by larryane!');
  });



  // let openRepository = vscode.commands.registerCommand('gitbtn.openRepository', function () {
	// 	// 获取当前打开的文件夹
	// 	const repositoryUrl = 'https://juejin.cn/post/7226376235559403575'
	// 	const currentFolder = vscode.workspace.workspaceFolders?.[0];
	// 	const externalUri = vscode.Uri.parse(repositoryUrl);
  // 	vscode.env.openExternal(externalUri);
	// 	if (currentFolder) {
	// 		// 使用 simple-git 打开 Git 仓库
	// 		const git = simpleGit(currentFolder.uri.fsPath);
	// 		console.log(11);
	// 		const promise = new Promise((resolve, reject) => {
	// 			git.outputHandler((command, stdout, stderr) => {
	// 				stdout.on('data', (data) => {
	// 					console.log(data.toString());
	// 				});
	// 				stderr.on('data', (data) => {
	// 					console.error(data.toString());
	// 				});
	// 				stdout.on('end', () => {
	// 					resolve();
	// 				});
	// 				stderr.on('end', () => {
	// 					reject(new Error('Failed to open Git repository!'));
	// 				});
	// 			});
	// 		});
	
	// 		promise.then((res) => {
	// 			console.log(res,111);
	// 			vscode.window.showInformationMessage('Git repository opened successfully!');
	// 		}).catch((err) => {
	// 			vscode.window.showErrorMessage(`Failed to open Git repository: ${err}`);
	// 		});
	// 	} else {
	// 		vscode.window.showErrorMessage('No folder is opened in the workspace!');
	// 	}
	// });

	let openRepository = vscode.commands.registerCommand('gitbtn.openRepository', async function () {
		// 获取当前文件路径和行号
		const editor = vscode.window.activeTextEditor;
		const filePath = editor.document.uri.fsPath;
		const lineNumber = editor.selection.active.line + 1;
	
		if (!filePath) {
			vscode.window.showErrorMessage('No file is opened in the editor!');
			return;
		}
	
		// 获取Git仓库的根目录
		const repositoryPath = await getRepositoryPath(filePath);
		if (!repositoryPath) {
			vscode.window.showErrorMessage('The current file is not in a Git repository!');
			return;
		}
	
		// 获取 Git 仓库的 URL
		const repositoryUrl = await getRepositoryUrl(repositoryPath);
		if (!repositoryUrl) {
			vscode.window.showErrorMessage('The current Git repository does not have a remote URL!');
			return;
		}
	
		// 将 Git 仓库 URL 转换为外部 URI，并在 URI 中包含当前文件和行号信息
		const externalUri = await vscode.env.asExternalUri(vscode.Uri.parse(repositoryUrl));
	
		// 打开外部 URI
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