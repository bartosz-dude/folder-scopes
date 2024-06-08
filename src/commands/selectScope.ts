import * as vscode from "vscode"
import { selectScope } from "../scoping/selectScope"
import { getScopeConfig } from "../scoping/getScopeConfig"
import { getScopes } from "../scoping/getScopes"

export const selectScopeCommand = (
	context: vscode.ExtensionContext,
	scopeLabel: vscode.StatusBarItem
) =>
	vscode.commands.registerCommand(
		"folder-scopes.selectScope",
		(...commandArgs) => {
			const scopes = getScopes(context)
			vscode.window
				.showQuickPick(scopes, {
					title: "Select Scope",
					placeHolder: "Select a Scope to Switch to",
				})
				.then((v) => {
					if (v) {
						const prevScope = getScopeConfig(context)?.currentScope
						scopeLabel.text = v
						selectScope(context, v)
						if (v === prevScope) {
							vscode.window.showInformationMessage(
								`Reloaded "${v}" scope`
							)
						}
						// else {
						// 	vscode.window.showInformationMessage(
						// 		`Switched to "${v}" scope`
						// 	)
						// }
					}
				})
		}
	)
