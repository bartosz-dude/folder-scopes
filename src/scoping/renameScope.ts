import * as vscode from "vscode"
import { RootScope } from "../extension"
import { selectScope } from "./selectScope"
import { FileScopesWorkspaceState } from "../extension"

export function renameScope(
	context: vscode.ExtensionContext,
	scopeName: string,
	newScopeName: string
) {
	if (scopeName === RootScope) {
		return
	}

	const workspaceState = context.workspaceState
	const scopes =
		workspaceState.get<FileScopesWorkspaceState["scopes"]>("scopes")!

	const renamedScopes = Object.entries(scopes).map((v) => {
		if (v[0] === scopeName) {
			return [newScopeName, v[1]]
		}

		return v
	})

	const renamedScopesObject = Object.fromEntries(renamedScopes)

	workspaceState.update("scopes", renamedScopesObject)
	selectScope(context, newScopeName)
}
