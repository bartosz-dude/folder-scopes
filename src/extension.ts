import * as vscode from "vscode"
import { createScopeCommand } from "./commands/createScope"
import { deleteScopeCommand } from "./commands/deleteScope"
import { hideFileCommand } from "./commands/hideFile"
import { hideFolderCommand } from "./commands/hideFolder"
import { renameScopeCommand } from "./commands/renameScope"
import { scopeFolderCommand } from "./commands/scopeFolder"
import { selectScopeCommand } from "./commands/selectScope"
import { unscopeCommand } from "./commands/unscope"
import { loadFromSettings } from "./scoping/loadFromSettings"
import { updateFileExcluding } from "./scoping/updateFileExcluding"
import { setScopeConfig } from "./scoping/setScopeConfig"
import { getScopeConfig } from "./scoping/getScopeConfig"
import { scopeExist } from "./scoping/scopeExist"
import { createScope } from "./scoping/createScope"
import { revealFilesCommand } from "./commands/revealFiles"

export interface FileScopesWorkspaceState {
	user: {
		currentScope: string
	}
	scopes: {
		[scopeName: string]: {
			[workspaceFolder: string]: {
				folderPath?: string
				excludedFilePaths?: string[]
			}
		}
	}
}

export const RootScope = "Root"

export function activate(context: vscode.ExtensionContext) {
	loadFromSettings(context)

	// inits scopes when opening a workspace
	setScopeConfig(context, {
		currentScope: RootScope,
		...getScopeConfig(context),
	})

	if (!scopeExist(context, { name: RootScope })) {
		createScope(context, { name: RootScope })
	}
	//

	// Status bar current scope label init
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
	//

	// Hides option to hide workspace folder and .vscode
	// ? maybe add option to add such folders in extension settings
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
	//

	// Updates scopes when settings file changes
	vscode.workspace.onDidChangeConfiguration((e) => {
		const affected = e.affectsConfiguration("folder-scopes.scopes")
		if (affected) {
			loadFromSettings(context)
			updateFileExcluding(context)
		}
	})
	//

	context.subscriptions.push(
		selectScopeCommand(context, scopeLabel),
		scopeFolderCommand(context),
		createScopeCommand(context, scopeLabel),
		deleteScopeCommand(context, scopeLabel),
		hideFileCommand(context),
		hideFolderCommand(context),
		unscopeCommand(context),
		revealFilesCommand(context),
		renameScopeCommand(context, scopeLabel)
	)
}

export function deactivate() {
	// Reveals all files
	vscode.workspace.workspaceFolders?.forEach((workspaceFolder) => {
		const workspaceFolderFiles = vscode.workspace.getConfiguration(
			"files",
			workspaceFolder
		)

		workspaceFolderFiles.update("exclude", {})
	})
	//
}
