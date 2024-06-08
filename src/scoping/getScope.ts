import * as vscode from "vscode"
import { FileScopesWorkspaceState } from "../extension"

export function getScope(
	context: vscode.ExtensionContext,
	scope: { name: string }
) {
	const workspaceState = context.workspaceState
	const targetScope =
		workspaceState.get<FileScopesWorkspaceState["scopes"]>("scopes")?.[
			scope.name
		]

	return targetScope
}
