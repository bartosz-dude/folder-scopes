import * as vscode from "vscode"
import { RootScope } from "../extension"
import { saveToSettings } from "../scoping/saveToSettings"
import { getScopeConfig } from "../scoping/getScopeConfig"
import { scopeFolder } from "../scoping/scopeFolder"
import removeFileExcluding from "../scoping/removeFileExcluding"

export const unscopeCommand = (context: vscode.ExtensionContext) =>
	vscode.commands.registerCommand(
		"folder-scopes.unscope",
		(...commandArgs) => {
			if (getScopeConfig(context)?.currentScope === RootScope) {
				return
			}

			// removeFileExcluding(context)
			vscode.workspace.workspaceFolders?.forEach((workspaceFolder) => {
				scopeFolder(context, {
					folderPath: "",
					workspaceFolder: workspaceFolder.name,
				})
			})
			saveToSettings(context)
		}
	)
