import * as vscode from "vscode"
import { RootScope } from "../extension"
import { saveToSettings } from "../scoping/saveToSettings"
import { getScopeConfig } from "../scoping/getScopeConfig"
import { revealFiles } from "../scoping/revealFiles"

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
