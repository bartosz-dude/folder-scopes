import * as vscode from "vscode"
import { setWorkspaceFolderScope } from "./setWorkspaceFolderScope"
import { updateFileExcluding } from "./updateFileExcluding"
import { getScopeConfig } from "./getScopeConfig"

export function scopeFolder(
	context: vscode.ExtensionContext,
	scope: {
		workspaceFolder: string
		folderPath: string
	}
) {
	setWorkspaceFolderScope(context, {
		...scope,
		name: getScopeConfig(context)!.currentScope,
	})
	updateFileExcluding(context)
}
