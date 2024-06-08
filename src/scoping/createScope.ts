import * as vscode from "vscode"
import { setScope } from "./setScope"
import { scopeExist } from "./scopeExist"

export function createScope(
	context: vscode.ExtensionContext,
	scope: { name: string }
) {
	if (scopeExist(context, scope)) {
		vscode.window.showErrorMessage(
			`Scope with name "${scope.name}" already exists`
		)
		return
	}

	setScope(context, scope)
}
