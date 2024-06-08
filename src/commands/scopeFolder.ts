import * as vscode from "vscode"
import { saveToSettings } from "../scoping/saveToSettings"
import { getScopeConfig } from "../scoping/getScopeConfig"
import { parseScopeUri } from "../scoping/parseScopeUri"
import { scopeFolder } from "../scoping/scopeFolder"
import { RootScope } from "../extension"

export const scopeFolderCommand = (context: vscode.ExtensionContext) =>
	vscode.commands.registerCommand(
		"folder-scopes.scopeFolder",
		(...commandArgs) => {
			if (getScopeConfig(context)?.currentScope === RootScope) {
				vscode.window.showErrorMessage(
					`Can't scope folder in ${RootScope} scope. Create a new scope to scope a folder.`
				)
				return
			}

			const scope = parseScopeUri(commandArgs[0] as vscode.Uri)
			scopeFolder(context, scope)
			saveToSettings(context)
		}
	)
