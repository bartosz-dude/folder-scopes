import * as vscode from "vscode"
import { FileScopesWorkspaceState } from "../extension"

export function setScope(
	context: vscode.ExtensionContext,
	scope: {
		name: string
	}
) {
	const workspaceState = context.workspaceState
	const scopes =
		workspaceState.get<FileScopesWorkspaceState["scopes"]>("scopes")

	workspaceState.update("scopes", {
		...scopes,
		[scope.name]: {},
	})
}
