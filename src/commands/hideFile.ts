import * as vscode from "vscode"
import { RootScope } from "../extension"
import { saveToSettings } from "../scoping/saveToSettings"
import { getScopeConfig } from "../scoping/getScopeConfig"
import { parseScopeUri } from "../scoping/parseScopeUri"
import { hideFile } from "../scoping/hideFile"

export const hideFileCommand = (context: vscode.ExtensionContext) =>
	vscode.commands.registerCommand(
		"folder-scopes.hideFile",
		(...commandArgs) => {
			if (getScopeConfig(context)?.currentScope === RootScope) {
				vscode.window.showErrorMessage(
					`Can't hide a file in ${RootScope} scope. Create a new scope to hide a file`
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
