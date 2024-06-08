import * as vscode from "vscode"
import { setScopeConfig } from "./setScopeConfig"
import { updateFileExcluding } from "./updateFileExcluding"

export function selectScope(
	context: vscode.ExtensionContext,
	scopeName: string
) {
	setScopeConfig(context, {
		currentScope: scopeName,
	})
	// removeFileExcluding(context)
	updateFileExcluding(context)
}
