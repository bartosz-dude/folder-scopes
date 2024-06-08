import * as vscode from "vscode"
import { getScope } from "./getScope"

export function scopeExist(
	context: vscode.ExtensionContext,
	scope: { name: string }
) {
	return typeof getScope(context, scope) !== "undefined"
}
