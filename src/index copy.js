const octicons = require('octicons');
const vscode = require('vscode');

/**
 * use ThemeIcon
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	
	let initBtn = vscode.commands.registerCommand('gitbtn.initBtn', function () {
		const myButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Center, 100);
		myButton.tooltip  = "Open RemoteRepository";
		myButton.text = `$(github)`
		myButton.color = 'white';
		myButton.command = 'gitbtn.openRepository';
		myButton.show();	
	});

	let disposable = vscode.commands.registerCommand('gitbtn.gitbtnInfo', function () {
		vscode.window.showInformationMessage('gitbtn create by larryane!');
	});

	let openRepository = vscode.commands.registerCommand('gitbtn.openRepository', function () {
		// OPEN a git Repository
	});

	context.subscriptions.push(initBtn);
	context.subscriptions.push(disposable);
	context.subscriptions.push(openRepository);

	vscode.commands.executeCommand('gitbtn.initBtn');

}
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
