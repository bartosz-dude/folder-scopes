import {
	getScopes,
	scopeExist,
	getScopeConfig,
	renameScope,
	saveToSettings,
} from "../scope"
import * as vscode from "vscode"

export const renameScopeCommand = (
	context: vscode.ExtensionContext,
	scopeLabel: vscode.StatusBarItem
) =>
	vscode.commands.registerCommand(
		"folder-scopes.renameScope",
		(...commandArgs) => {
			const scopes = getScopes(context)
			vscode.window
				.showQuickPick(scopes, {
					title: "Select Scope",
					placeHolder: "Select a Scope to Rename",
				})
				.then((scopeName) => {
					if (scopeName) {
						vscode.window
							.showInputBox({
								title: "Scope Name",
								placeHolder: "Enter Name for the Scope",
								validateInput(value) {
									if (scopeName === value) {
										return "This is the same name"
									}

									if (
										scopeExist(context, {
											name: value,
										})
									) {
										return "Scope with this name already exists"
									}

									return null
								},
							})
							.then((newScopeName) => {
								if (newScopeName) {
									// createScope(context, { name: newScopeName })
									if (
										getScopeConfig(context)
											?.currentScope === scopeName
									) {
										scopeLabel.text = newScopeName
									}

									renameScope(
										context,
										scopeName,
										newScopeName
									)

									vscode.window.showInformationMessage(
										`Scope "${scopeName}" has been renamed to "${newScopeName}"`
									)
									saveToSettings(context)
								}
							})
					}
				})
		}
	)
