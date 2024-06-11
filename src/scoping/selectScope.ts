import * as vscode from "vscode"
import { setScopeConfig } from "./setScopeConfig"
import { updateFileExcluding } from "./updateFileExcluding"
import setCurrentScopeConfig from "./setCurrentScopeConfig"

export function selectScope(
	context: vscode.ExtensionContext,
	scopeName: string
) {
	setCurrentScopeConfig(context, scopeName)
	// removeFileExcluding(context)
	updateFileExcluding(context)
}
