// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode"
import {
	deleteScope,
	getScopeConfig,
	hideFile,
	loadFromSettings,
	renameScope,
	revealFiles,
	saveToSettings,
	updateFileExcluding,
} from "./scope"
import {
	createScope,
	getScopes,
	parseScopeUri,
	scopeExist,
	scopeFolder,
	selectScope,
	setScopeConfig,
} from "./scope"

export const RootScope = "Root"

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	context.workspaceState.update("scopes", undefined)
	context.workspaceState.update("config", undefined)
	loadFromSettings(context)
	// setup
	setScopeConfig(context, {
		currentScope: RootScope,
		...getScopeConfig(context),
	})
	if (!scopeExist(context, { name: RootScope }))
		createScope(context, { name: RootScope })

	const scopeLabel = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Left,
		1
	)
	scopeLabel.command = "folder-scopes.selectScope"

	context.subscriptions.push(scopeLabel)

	scopeLabel.text = getScopeConfig(context)?.currentScope ?? RootScope
	scopeLabel.tooltip = "Current Scope"
	scopeLabel.name = "Current Scope"
	scopeLabel.show()

	const workspaceFolderPaths = vscode.workspace.workspaceFolders?.map(
		(v) => v.uri.path
	)

	const vscodeFolderPaths = vscode.workspace.workspaceFolders?.map(
		(v) => v.uri.path + "/.vscode"
	)

	const excludedPaths = [
		...(workspaceFolderPaths ?? []),
		...(vscodeFolderPaths ?? []),
	]

	vscode.commands.executeCommand("setContext", "excludedPaths", excludedPaths)

	vscode.workspace.onDidChangeConfiguration((e) => {
		const affected = e.affectsConfiguration("folder-scopes.scopes")
		if (affected) {
			loadFromSettings(context)
			updateFileExcluding(context)
		}
	})

	const disposableSelectScope = vscode.commands.registerCommand(
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
						} else {
							vscode.window.showInformationMessage(
								`Switched to "${v}" scope`
							)
						}
					}
				})
		}
	)

	const disposableScopeFolder = vscode.commands.registerCommand(
		"folder-scopes.scopeFolder",
		(...commandArgs) => {
			if (getScopeConfig(context)?.currentScope === RootScope) {
				vscode.window.showErrorMessage(
					`Can't scope folder in ${RootScope} scope. Create a new scope to scope a folder.`
				)
				return
			}

			const scope = parseScopeUri(commandArgs[0] as vscode.Uri)
			scopeFolder(context, scope)
			saveToSettings(context)
		}
	)

	const disposableCreateScope = vscode.commands.registerCommand(
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
						vscode.window.showInformationMessage(
							`Switched to "${v}" scope`
						)
						saveToSettings(context)
					}
				})
		}
	)

	const disposableDeleteScope = vscode.commands.registerCommand(
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

	const disposableHideFile = vscode.commands.registerCommand(
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

	const disposableHideFolder = vscode.commands.registerCommand(
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

	const disposableUnscope = vscode.commands.registerCommand(
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

	const disposableRevealFiles = vscode.commands.registerCommand(
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

	const disposableRenameScope = vscode.commands.registerCommand(
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

	context.subscriptions.push(
		disposableSelectScope,
		disposableScopeFolder,
		disposableCreateScope,
		disposableDeleteScope,
		disposableHideFile,
		disposableHideFolder,
		disposableUnscope,
		disposableRevealFiles,
		disposableRenameScope
	)
}

// This method is called when your extension is deactivated
export function deactivate() {
	vscode.workspace.workspaceFolders?.forEach((workspaceFolder) => {
		const workspaceFolderFiles = vscode.workspace.getConfiguration(
			"files",
			workspaceFolder
		)

		workspaceFolderFiles.update("exclude", {})
	})
}
