import * as vscode from "vscode"
import { getWorkspaceFolderScope } from "./getWorkspaceFolderScope"
import { setWorkspaceFolderScope } from "./setWorkspaceFolderScope"
import { updateFileExcluding } from "./updateFileExcluding"
import { getScopeConfig } from "./getScopeConfig"

export function hideFile(
	context: vscode.ExtensionContext,
	scope: {
		workspaceFolder: string
		filePath: string
	}
) {
	const curretWorkspaceFolderScope = getWorkspaceFolderScope(context, {
		workspaceFolder: scope.workspaceFolder,
		name: getScopeConfig(context)!.currentScope,
	})!

	setWorkspaceFolderScope(context, {
		workspaceFolder: scope.workspaceFolder,
		name: getScopeConfig(context)!.currentScope,
		folderPath: "",
		...curretWorkspaceFolderScope,
		excludedFilePaths: [
			...(curretWorkspaceFolderScope.excludedPaths ?? []),
			scope.filePath,
		],
		// name: getScopeConfig(context)!.currentScope,
	})
	updateFileExcluding(context)
}
