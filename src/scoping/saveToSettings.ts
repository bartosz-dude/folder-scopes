import * as vscode from "vscode"
import { RootScope } from "../extension"
import { FileScopesWorkspaceState } from "../extension"

export function saveToSettings(context: vscode.ExtensionContext) {
	const workspaceState = context.workspaceState
	const scopes =
		workspaceState.get<FileScopesWorkspaceState["scopes"]>("scopes")!

	const extensionSettings = vscode.workspace.getConfiguration("folder-scopes")

	const filteredScopes = Object.entries(scopes).filter(
		(v) => v[0] !== RootScope
	)
	const filteredScopesObject = Object.fromEntries(filteredScopes)

	extensionSettings.update("scopes", filteredScopesObject)
}
