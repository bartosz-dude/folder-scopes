import * as vscode from "vscode"
import { getScope } from "./getScope"

export function getWorkspaceFolderScope(
	context: vscode.ExtensionContext,
	scope: { workspaceFolder: string; name: string }
) {
	const scopeWorkspaceFolders = getScope(context, scope)
	if (scopeWorkspaceFolders) {
		return scopeWorkspaceFolders[scope.workspaceFolder]
	}
}
