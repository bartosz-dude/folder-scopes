import * as vscode from "vscode"
import { RootScope } from "../extension"
import { FileScopesWorkspaceState } from "../extension"

export function deleteScope(
	context: vscode.ExtensionContext,
	scopeName: string
) {
	if (scopeName === RootScope) {
		return
	}

	const workspaceState = context.workspaceState
	const scopes =
		workspaceState.get<FileScopesWorkspaceState["scopes"]>("scopes")!

	const filteredScopes = Object.entries(scopes).filter(
		(v) => v[0] !== scopeName
	)

	const filteredScopesObject = Object.fromEntries(filteredScopes)

	workspaceState.update("scopes", filteredScopesObject)
}
