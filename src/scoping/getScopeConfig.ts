import * as vscode from "vscode"
import { FileScopesWorkspaceState } from "../extension"

export function getScopeConfig(context: vscode.ExtensionContext) {
	const workspaceState = context.workspaceState
	const config = workspaceState.get<FileScopesWorkspaceState["user"]>("user")

	return config
}
