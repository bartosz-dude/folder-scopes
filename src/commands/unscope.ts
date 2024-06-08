import * as vscode from "vscode"
import { RootScope } from "../extension"
import { getScopeConfig, scopeFolder, saveToSettings } from "../scope"

export const unscopeCommand = (context: vscode.ExtensionContext) =>
	vscode.commands.registerCommand(
		"folder-scopes.unscope",
		(...commandArgs) => {
			if (getScopeConfig(context)?.currentScope === RootScope) {
				return
			}

			vscode.workspace.workspaceFolders?.forEach((workspaceFolder) => {
				scopeFolder(context, {
					folderPath: "",
					workspaceFolder: workspaceFolder.name,
				})
			})
			saveToSettings(context)
		}
	)
