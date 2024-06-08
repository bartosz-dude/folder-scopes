import * as vscode from "vscode"
import { FileScopesWorkspaceState } from "../extension"

export function setScopeConfig(
	context: vscode.ExtensionContext,
	config: Partial<FileScopesWorkspaceState["user"]>
) {
	const workspaceState = context.workspaceState
	const savedConfig: Partial<FileScopesWorkspaceState["user"]> =
		workspaceState.get<FileScopesWorkspaceState["user"]>("user") ?? {}

	const newConfig = {
		...savedConfig,
		...config,
	}

	workspaceState.update("user", newConfig)
}
