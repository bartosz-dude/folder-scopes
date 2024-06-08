import * as vscode from "vscode"
import { RootScope } from "../extension"
import { getScopeConfig, revealFiles, saveToSettings } from "../scope"

export const unscopeCommand = (context: vscode.ExtensionContext) =>
	vscode.commands.registerCommand(
		"folder-scopes.revealFiles",
		(...commandArgs) => {
			if (getScopeConfig(context)?.currentScope === RootScope) {
				return
			}

			vscode.workspace.workspaceFolders?.forEach((workspaceFolder) => {
				revealFiles(context, {
					workspaceFolder: workspaceFolder.name,
				})
			})
			saveToSettings(context)
		}
	)
