const vscode = require("vscode")
const simpleGit = require("simple-git")
const path = require("path")

/**
 * use ThemeIcon
 */
function activate(context) {
  /**
   * 注册一个命令，习惯都是 "项目命名.命令名" 的格式。命令执行后会在状态栏显示一个按钮。
   */
  let initBtn = vscode.commands.registerCommand("gitbtn.initBtn", function () {
    const myButton = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Center,
      100
    )
    myButton.tooltip = "Open RemoteRepository"
    myButton.text = `$(github)`
    myButton.color = "white"
    myButton.command = "gitbtn.openRepository"
    myButton.show()
  })
  /**
   * 显示提示框
   */
  let disposable = vscode.commands.registerCommand(
    "gitbtn.gitbtnInfo",
    function () {
      vscode.window.showInformationMessage("gitbtn create by larryane!")
    }
  )
  /**
   * 打开git仓库首页
   */
  let openRepository = vscode.commands.registerCommand(
    "gitbtn.openRepository",
    async function () {
      const editor = vscode.window.activeTextEditor
      const filePath = editor.document.uri.fsPath
      const lineNumber = editor.selection.active.line + 1

      if (!filePath) {
        vscode.window.showErrorMessage("No file is opened in the editor!")
        return
      }

      const getGitRepositoryUrl = async (filePath) => {
        try {
          const git = simpleGit(path.dirname(filePath))
          const remotes = await git.getRemotes(true)
          const gitRepoUrl = remotes.filter(
            (remote) => remote.name === "origin"
          )[0].refs.fetch
          return gitRepoUrl
        } catch (error) {
          console.error(error)
          return null
        }
      }

      const gitRepoUrl = await getGitRepositoryUrl(filePath)

      const externalUri = await vscode.env.asExternalUri(
        vscode.Uri.parse(gitRepoUrl)
      )
      vscode.env.openExternal(externalUri)
    }
  )

  // 将命令注册到插件上下文中，以便在插件停用时自动注销
  /**
   * Registering commands in the plugin context
   * for automatic logout when the plugin is disabled
   */
  context.subscriptions.push(initBtn)
  context.subscriptions.push(disposable)
  context.subscriptions.push(openRepository)

  // 初始化插件
  // init plugin
  vscode.commands.executeCommand("gitbtn.initBtn")
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
}
