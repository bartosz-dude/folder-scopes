import * as vscode from "vscode"
import {
	deleteScope,
	getScopeConfig,
	getScopes,
	saveToSettings,
	selectScope,
} from "../scope"
import { RootScope } from "../extension"

export const deleteScopeCommand = (
	context: vscode.ExtensionContext,
	scopeLabel: vscode.StatusBarItem
) =>
	vscode.commands.registerCommand(
		"folder-scopes.deleteScope",
		(...commandArgs) => {
			const scopes = getScopes(context).filter((v) => v !== RootScope)
			vscode.window
				.showQuickPick(scopes, {
					title: "Delete Scope",
					placeHolder: "Select a Scope to Delete",
				})
				.then((v) => {
					if (v) {
						if (getScopeConfig(context)?.currentScope === v) {
							scopeLabel.text = RootScope
							selectScope(context, RootScope)
						}

						deleteScope(context, v)
						vscode.window.showInformationMessage(
							`Scope "${v}" has been deleted`
						)
						saveToSettings(context)
					}
				})
		}
	)
