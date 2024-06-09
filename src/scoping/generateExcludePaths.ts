import * as vscode from "vscode"
import { getWorkspaceFolderScope } from "./getWorkspaceFolderScope"
import { generatePattern } from "./generatePattern"

export function generateExcludePaths(
	context: vscode.ExtensionContext,
	scope: {
		workspaceFolder: string
		name: string
	}
) {
	const workspaceFolderScope = getWorkspaceFolderScope(context, scope)

	if (!workspaceFolderScope) {
		return []
	}

	const folderPath = workspaceFolderScope?.folderPath?.replace(/^\//, "")

	const pathFragments = folderPath?.split("/") ?? []

	const filePaths = workspaceFolderScope.excludedFilePaths?.map((v) =>
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
