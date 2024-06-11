import * as vscode from "vscode"
import { getWorkspaceFolderScope } from "./getWorkspaceFolderScope"
import { generatePattern } from "./generatePattern"
import { FileScopesWorkspaceState } from "../extension"

type WorkspaceFolderScope = FileScopesWorkspaceState["scopes"][string][string]

export function generateExcludePaths(
	workspaceScope: WorkspaceFolderScope
): string[]
export function generateExcludePaths(
	context: vscode.ExtensionContext,
	scope: {
		workspaceFolder: string
		name: string
	}
): string[]
export function generateExcludePaths(
	contextInternal: vscode.ExtensionContext | WorkspaceFolderScope,
	scopeInternal?: {
		workspaceFolder: string
		name: string
	}
): string[] {
	let workspaceFolderScope: WorkspaceFolderScope | undefined

	if (arguments.length === 1) {
		const workspaceScope = contextInternal as WorkspaceFolderScope
		workspaceFolderScope = workspaceScope
	} else {
		const context = contextInternal as vscode.ExtensionContext
		const scope = scopeInternal!

		workspaceFolderScope = getWorkspaceFolderScope(context, scope)
	}

	if (!workspaceFolderScope) {
		return []
	}

	const folderPath = workspaceFolderScope?.scopedFolderPath?.replace(
		/^\//,
		""
	)

	const pathFragments = folderPath?.split("/") ?? []

	const filePaths = workspaceFolderScope.excludedPaths?.map((v) =>
		v.replace(/^\//, "")
	)
	const excludePaths: string[] = [...(filePaths ?? [])]

	pathFragments.forEach((v, i, arr) => {
		if (i === 0 && v === "") {
			return
		}

		if (i === 0) {
			const pattern = generatePattern(v)
			excludePaths.push(pattern)
			// excludePaths.push(`${v}?*`)
			// excludePaths.push(`.[!${v}]*`)
			return
		}

		function genPath(index = i): string {
			if (index - 1 < 0) {
				return ""
			}

			return `${genPath(index - 1)}${arr[index - 1]}/`
		}

		const backPath = genPath()

		const pattern = generatePattern(v)
		excludePaths.push(`${backPath}${pattern}`)
		// excludePaths.push(`${backPath}${v}?*`)
		// excludePaths.push(`.${backPath}*`)
	})

	return excludePaths
}
