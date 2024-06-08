import * as vscode from "vscode"
import { getScopeConfig } from "./getScopeConfig"
import { generateExcludePaths } from "./generateExcludePaths"

export function updateFileExcluding(context: vscode.ExtensionContext) {
	const workspaceFolders = vscode.workspace.workspaceFolders

	if (workspaceFolders) {
		workspaceFolders.forEach((workspaceFolder) => {
			const pathsToExclude = generateExcludePaths(context, {
				workspaceFolder: workspaceFolder.name,
				name: getScopeConfig(context)?.currentScope!,
			})

			const pathsToExcludeObj = Object.fromEntries(
				pathsToExclude?.map((v) => [v, true])
			)

			const workspaceFolderFiles = vscode.workspace.getConfiguration(
				"files",
				workspaceFolder
			)

			// const currentExclude = workspaceFolderFiles.get(
			// 	"exclude"
			// ) as Record<string, true>
			workspaceFolderFiles.update("exclude", {
				...pathsToExcludeObj,
				// ...currentExclude,
			})

			// const revealFolderPath = getWorkspaceFolderScope(context, {
			// 	workspaceFolder: workspaceFolder.name,
			// 	name: getScopeConfig(context)?.currentScope!,
			// })?.folderPath!
			// const revealFolderUri = workspaceFolder.uri.with({
			// 	path: revealFolderPath,
			// })
			// const a = vscode.workspace.asRelativePath("**/" + revealFolderPath)
		})
	}
}
