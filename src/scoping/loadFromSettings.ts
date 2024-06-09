import * as vscode from "vscode"
import { RootScope } from "../extension"
import { FileScopesWorkspaceState } from "../extension"

export function loadFromSettings(context: vscode.ExtensionContext) {
	const workspaceState = context.workspaceState

	const extensionSettings = vscode.workspace.getConfiguration("folder-scopes")

	const scopesFromSettings = extensionSettings.get(
		"scopes"
	) as FileScopesWorkspaceState["scopes"]

	const filteredScopes = Object.entries(scopesFromSettings).filter(
		(v) => v[0] !== RootScope
	)
	const filteredScopesObject = Object.fromEntries(filteredScopes)

	filteredScopesObject[RootScope] = {}

	workspaceState.update("scopes", filteredScopesObject)
}
