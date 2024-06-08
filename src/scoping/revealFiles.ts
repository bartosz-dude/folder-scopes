import * as vscode from "vscode"
import { getWorkspaceFolderScope } from "./getWorkspaceFolderScope"
import { setWorkspaceFolderScope } from "./setWorkspaceFolderScope"
import { updateFileExcluding } from "./updateFileExcluding"
import { getScopeConfig } from "./getScopeConfig"

export function revealFiles(
	context: vscode.ExtensionContext,
	scope: {
		workspaceFolder: string
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
		excludedFilePaths: [],
	})
	updateFileExcluding(context)
}
