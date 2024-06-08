import * as vscode from "vscode"
import { RootScope } from "../extension"
import {
	getScopeConfig,
	parseScopeUri,
	hideFile,
	saveToSettings,
} from "../scope"

export const hideFolderCommand = (context: vscode.ExtensionContext) =>
	vscode.commands.registerCommand(
		"folder-scopes.hideFolder",
		(...commandArgs) => {
			if (getScopeConfig(context)?.currentScope === RootScope) {
				vscode.window.showErrorMessage(
					`Can't hide a folder in ${RootScope} scope. Create a new scope to hide a folder`
				)
				return
			}

			const scope = parseScopeUri(commandArgs[0] as vscode.Uri)
			hideFile(context, {
				workspaceFolder: scope.workspaceFolder,
				filePath: scope.folderPath,
			})
			saveToSettings(context)
		}
	)
