import * as vscode from "vscode"
import { getScopeConfig } from "./getScopeConfig"
import { setScopeConfig } from "./setScopeConfig"
import { getScope } from "./getScope"

export default function setCurrentScopeConfig(
	context: vscode.ExtensionContext,
	newScopeName: string
) {
	const currentConfig = getScopeConfig(context)

	if ((currentConfig?.recentScopes ?? []).length >= 50) {
		currentConfig?.recentScopes.shift()
	}

	setScopeConfig(context, {
		currentScope: newScopeName,
		recentScopes: currentConfig?.recentScopes.concat({
			name: newScopeName,
			workspaceFolders: getScope(context, {
				name: getScopeConfig(context)?.currentScope!,
			})!,
		}),
	})
}
