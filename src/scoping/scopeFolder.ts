import * as vscode from "vscode"
import { setWorkspaceFolderScope } from "./setWorkspaceFolderScope"
import { updateFileExcluding } from "./updateFileExcluding"
import { getScopeConfig } from "./getScopeConfig"
import removeFileExcluding from "./removeFileExcluding"

export function scopeFolder(
	context: vscode.ExtensionContext,
	scope: {
		workspaceFolder: string
		folderPath: string
	}
) {
	// removeFileExcluding(context)
	setWorkspaceFolderScope(context, {
		...scope,
		name: getScopeConfig(context)!.currentScope,
	})
	updateFileExcluding(context)
}
