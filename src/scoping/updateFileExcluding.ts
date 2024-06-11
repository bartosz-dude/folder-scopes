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

			// const workspaceExcludeConfig = workspaceFolderFiles.inspect(
			// 	"exclude"
			// )?.workspaceValue as Record<string, boolean>

			// const a = getScopeConfig(context)
			// const previousPathsToExclude = generateExcludePaths(
			// 	getScopeConfig(context)?.recentScopes.at(-0)?.workspaceFolders[
			// 		workspaceFolder.name
			// 	]!
			// )

			// const workspaceExcludeConfigFiltered = Object.keys(
			// 	workspaceExcludeConfig
			// ).filter(
			// 	(existingKey) => !previousPathsToExclude.includes(existingKey)
			// )
			// const nonExtensionExcludedPaths = Object.fromEntries(
			// 	workspaceExcludeConfigFiltered.map((v) => [v, true])
			// )

			workspaceFolderFiles.update("exclude", {
				// ...nonExtensionExcludedPaths,
				...pathsToExcludeObj,
			})
		})
	}
}
