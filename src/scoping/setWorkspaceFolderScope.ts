import * as vscode from "vscode"
import { getScope } from "./getScope"
import { FileScopesWorkspaceState } from "../extension"

export function setWorkspaceFolderScope(
	context: vscode.ExtensionContext,
	scope: {
		workspaceFolder: string
		name: string
		folderPath: string
		excludedFilePaths?: string[]
	}
) {
	const workspaceState = context.workspaceState

	const currentScope = getScope(context, scope)

	let excludedFilePaths
	if (
		currentScope &&
		Object.keys(currentScope).includes(scope.workspaceFolder)
	) {
		excludedFilePaths = currentScope[scope.workspaceFolder].excludedPaths
	}

	if (scope.excludedFilePaths) {
		excludedFilePaths = scope.excludedFilePaths
	}

	const updatedWorkspaceScopes: FileScopesWorkspaceState["scopes"][string] = {
		...currentScope,
		[scope.workspaceFolder]: {
			scopedFolderPath: scope.folderPath,
			excludedPaths: excludedFilePaths,
		},
	}

	const updatedScopes: FileScopesWorkspaceState["scopes"] = {
		...workspaceState.get("scopes"),
		[scope.name]: updatedWorkspaceScopes,
	}

	// const updatedScopes: FileScopesWorkspaceState["scopes"][string] = {
	// 	...(getScope(context, scope) ?? {}),
	// 	[scope.name]: {
	// 		folderPath: scope.folderPath,
	// 		excludedFilePaths: scope.excludedFilePaths,
	// 	},
	// }
	workspaceState.update("scopes", updatedScopes)
}
