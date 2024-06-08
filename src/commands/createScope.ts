import * as vscode from "vscode"
import { saveToSettings } from "../scoping/saveToSettings"
import { selectScope } from "../scoping/selectScope"
import { scopeExist } from "../scoping/scopeExist"
import { createScope } from "../scoping/createScope"

export const createScopeCommand = (
	context: vscode.ExtensionContext,
	scopeLabel: vscode.StatusBarItem
) =>
	vscode.commands.registerCommand(
		"folder-scopes.createScope",
		(...commandArgs) => {
			vscode.window
				.showInputBox({
					title: "Scope Name",
					placeHolder: "Enter Name for the Scope",
					validateInput(value) {
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
				.then((v) => {
					if (v) {
						createScope(context, { name: v })
						vscode.window.showInformationMessage(
							`Scope "${v}" has been created`
						)
						scopeLabel.text = v
						selectScope(context, v)
						// vscode.window.showInformationMessage(
						// 	`Switched to "${v}" scope`
						// )
						saveToSettings(context)
					}
				})
		}
	)
