import * as vscode from "vscode"
import { generateExcludePaths } from "./generateExcludePaths"
import { getScopeConfig } from "./getScopeConfig"

export default function removeFileExcluding(context: vscode.ExtensionContext) {
	const workspaceFolders = vscode.workspace.workspaceFolders

	if (workspaceFolders) {
		for (const workspaceFolder of workspaceFolders) {
			// }
			// workspaceFolders.forEach((workspaceFolder) => {
			const pathsToExclude = generateExcludePaths(context, {
				workspaceFolder: workspaceFolder.name,
				name: getScopeConfig(context)?.currentScope!,
			})

			const workspaceFolderFiles = vscode.workspace.getConfiguration(
				"files",
				workspaceFolder
			)

			const workspaceExcludeConfig = workspaceFolderFiles.inspect(
				"exclude"
			)?.workspaceValue as Record<string, boolean>

			const workspaceExcludeConfigFiltered = Object.keys(
				workspaceExcludeConfig
			).filter((existingKey) => !pathsToExclude.includes(existingKey))
			const nonExtensionExcludedPaths = Object.fromEntries(
				workspaceExcludeConfigFiltered.map((v) => [v, true])
			)

			workspaceFolderFiles.update("exclude", {
				...nonExtensionExcludedPaths,
			})
		}
	}
}
