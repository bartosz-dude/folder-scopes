import * as vscode from "vscode"
import { FileScopesWorkspaceState } from "../extension"

/**
 *
 * @returns array of names of scopes
 */

export function getScopes(context: vscode.ExtensionContext) {
	const workspaceState = context.workspaceState
	const scopes =
		workspaceState.get<FileScopesWorkspaceState["scopes"]>("scopes")

	if (scopes) {
		return Object.keys(scopes)
	}

	return []
}
