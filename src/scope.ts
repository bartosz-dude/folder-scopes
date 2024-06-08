import * as vscode from "vscode"
import { RootScope } from "./extension"
import path from "path"

interface FileScopesWorkspaceState {
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

export function getWorkspaceFolderScope(
	context: vscode.ExtensionContext,
	scope: { workspaceFolder: string; name: string }
) {
	const scopeWorkspaceFolders = getScope(context, scope)
	if (scopeWorkspaceFolders)
		return scopeWorkspaceFolders[scope.workspaceFolder]
}

export function getScope(
	context: vscode.ExtensionContext,
	scope: { name: string }
) {
	const workspaceState = context.workspaceState
	const targetScope =
		workspaceState.get<FileScopesWorkspaceState["scopes"]>("scopes")?.[
			scope.name
		]

	return targetScope
}

function setWorkspaceFolderScope(
	context: vscode.ExtensionContext,
	scope: {
		workspaceFolder: string
		name: string
		folderPath: string
		excludedFilePaths?: string[]
	}
) {
	const workspaceState = context.workspaceState

	const currentScope = getScope(context, scope)

	let excludedFilePaths
	if (
		currentScope &&
		Object.keys(currentScope).includes(scope.workspaceFolder)
	) {
		excludedFilePaths =
			currentScope[scope.workspaceFolder].excludedFilePaths
	}

	if (scope.excludedFilePaths) {
		excludedFilePaths = scope.excludedFilePaths
	}

	const updatedWorkspaceScopes: FileScopesWorkspaceState["scopes"][string] = {
		...currentScope,
		[scope.workspaceFolder]: {
			folderPath: scope.folderPath,
			excludedFilePaths: excludedFilePaths,
		},
	}

	const updatedScopes: FileScopesWorkspaceState["scopes"] = {
		...workspaceState.get("scopes"),
		[scope.name]: updatedWorkspaceScopes,
	}

	// const updatedScopes: FileScopesWorkspaceState["scopes"][string] = {
	// 	...(getScope(context, scope) ?? {}),
	// 	[scope.name]: {
	// 		folderPath: scope.folderPath,
	// 		excludedFilePaths: scope.excludedFilePaths,
	// 	},
	// }

	workspaceState.update("scopes", updatedScopes)
}

function setScope(
	context: vscode.ExtensionContext,
	scope: {
		name: string
	}
) {
	const workspaceState = context.workspaceState
	const scopes =
		workspaceState.get<FileScopesWorkspaceState["scopes"]>("scopes")

	workspaceState.update("scopes", {
		...scopes,
		[scope.name]: {},
	})
}

export function scopeFolder(
	context: vscode.ExtensionContext,
	scope: {
		workspaceFolder: string
		folderPath: string
	}
) {
	setWorkspaceFolderScope(context, {
		...scope,
		name: getScopeConfig(context)!.currentScope,
	})
	updateFileExcluding(context)
}

export function hideFile(
	context: vscode.ExtensionContext,
	scope: {
		workspaceFolder: string
		filePath: string
	}
) {
	const curretWorkspaceFolderScope = getWorkspaceFolderScope(context, {
		workspaceFolder: scope.workspaceFolder,
		name: getScopeConfig(context)!.currentScope,
	})!

	setWorkspaceFolderScope(context, {
		workspaceFolder: scope.workspaceFolder,
		name: getScopeConfig(context)!.currentScope,
		folderPath: "",
		...curretWorkspaceFolderScope,
		excludedFilePaths: [
			...(curretWorkspaceFolderScope.excludedFilePaths ?? []),
			scope.filePath,
		],
		// name: getScopeConfig(context)!.currentScope,
	})
	updateFileExcluding(context)
}

export function revealFiles(
	context: vscode.ExtensionContext,
	scope: {
		workspaceFolder: string
	}
) {
	const curretWorkspaceFolderScope = getWorkspaceFolderScope(context, {
		workspaceFolder: scope.workspaceFolder,
		name: getScopeConfig(context)!.currentScope,
	})!

	setWorkspaceFolderScope(context, {
		workspaceFolder: scope.workspaceFolder,
		name: getScopeConfig(context)!.currentScope,
		folderPath: "",
		...curretWorkspaceFolderScope,
		excludedFilePaths: [],
	})
	updateFileExcluding(context)
}

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

export function scopeExist(
	context: vscode.ExtensionContext,
	scope: { name: string }
) {
	return typeof getScope(context, scope) !== "undefined"
}

export function parseScopeUri(folderUri: vscode.Uri) {
	const folderUriWorkspace = vscode.workspace.getWorkspaceFolder(folderUri)
	const folderUriRelative = vscode.workspace.asRelativePath(folderUri)

	return {
		folderPath: folderUriRelative,
		workspaceFolder: folderUriWorkspace?.name ?? "",
	}
}

/**
 *
 * @returns array of names of scopes
 */
export function getScopes(context: vscode.ExtensionContext) {
	const workspaceState = context.workspaceState
	const scopes =
		workspaceState.get<FileScopesWorkspaceState["scopes"]>("scopes")

	if (scopes) return Object.keys(scopes)

	return []
}

export function getScopeConfig(context: vscode.ExtensionContext) {
	const workspaceState = context.workspaceState
	const config = workspaceState.get<FileScopesWorkspaceState["user"]>("user")

	return config
}

export function setScopeConfig(
	context: vscode.ExtensionContext,
	config: Partial<FileScopesWorkspaceState["user"]>
) {
	const workspaceState = context.workspaceState
	const savedConfig: Partial<FileScopesWorkspaceState["user"]> =
		workspaceState.get<FileScopesWorkspaceState["user"]>("user") ?? {}

	const newConfig = {
		...savedConfig,
		...config,
	}

	workspaceState.update("user", newConfig)
}

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

function generatePattern(fragment: string) {
	const splitFragment = fragment.split("")
	const patternFragments = []

	splitFragment.forEach((v, i, arr) => {
		if (i == splitFragment.length - 1) {
			const prefix = arr.slice(0, i).join("")
			patternFragments.push(`${prefix}[!${v}]*`)
			return
		}

		const prefix = arr.slice(0, i).join("")
		patternFragments.push(prefix + v)
		patternFragments.push(`${prefix}[!${v}]*`)
	})

	patternFragments.push(`${fragment}?*`)

	return `{${patternFragments.join()}}`
}

function generateExcludePaths(
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
		if (i == 0 && v === "") return

		if (i == 0) {
			const pattern = generatePattern(v)
			excludePaths.push(pattern)
			// excludePaths.push(`${v}?*`)
			// excludePaths.push(`.[!${v}]*`)
			return
		}

		function genPath(index = i): string {
			if (index - 1 < 0) return ""

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

function removeFileExcluding(context: vscode.ExtensionContext) {
	const workspaceFolders = vscode.workspace.workspaceFolders

	if (workspaceFolders) {
		workspaceFolders.forEach((v) => {
			const pathsToExclude = generateExcludePaths(context, {
				workspaceFolder: v.name,
				name: getScopeConfig(context)?.currentScope ?? "",
			})

			const workspaceFolderFiles = vscode.workspace.getConfiguration(
				"files",
				v
			)

			const currentExclude = workspaceFolderFiles.get(
				"exclude"
			) as Record<string, true>

			const filteredExclude = Object.entries(currentExclude).filter((v) =>
				pathsToExclude.some((vI) => vI == v[0])
			)

			workspaceFolderFiles.update(
				"exclude",
				Object.fromEntries(filteredExclude)
			)

			workspaceFolderFiles
		})
	}
}

export function updateFileExcluding(context: vscode.ExtensionContext) {
	const workspaceFolders = vscode.workspace.workspaceFolders

	if (workspaceFolders) {
		workspaceFolders.forEach((workspaceFolder) => {
			const pathsToExclude = generateExcludePaths(context, {
				workspaceFolder: workspaceFolder.name,
				name: getScopeConfig(context)?.currentScope!,
			})

			const pathsToExcludeObj = Object.fromEntries(
				pathsToExclude?.map((v) => [v, true])
			)

			const workspaceFolderFiles = vscode.workspace.getConfiguration(
				"files",
				workspaceFolder
			)

			// const currentExclude = workspaceFolderFiles.get(
			// 	"exclude"
			// ) as Record<string, true>

			workspaceFolderFiles.update("exclude", {
				...pathsToExcludeObj,
				// ...currentExclude,
			})

			// const revealFolderPath = getWorkspaceFolderScope(context, {
			// 	workspaceFolder: workspaceFolder.name,
			// 	name: getScopeConfig(context)?.currentScope!,
			// })?.folderPath!

			// const revealFolderUri = workspaceFolder.uri.with({
			// 	path: revealFolderPath,
			// })

			// const a = vscode.workspace.asRelativePath("**/" + revealFolderPath)
		})
	}
}

export function deleteScope(
	context: vscode.ExtensionContext,
	scopeName: string
) {
	if (scopeName === RootScope) return

	const workspaceState = context.workspaceState
	const scopes =
		workspaceState.get<FileScopesWorkspaceState["scopes"]>("scopes")!

	const filteredScopes = Object.entries(scopes).filter(
		(v) => v[0] !== scopeName
	)

	const filteredScopesObject = Object.fromEntries(filteredScopes)

	workspaceState.update("scopes", filteredScopesObject)
}

export function renameScope(
	context: vscode.ExtensionContext,
	scopeName: string,
	newScopeName: string
) {
	if (scopeName === RootScope) return

	const workspaceState = context.workspaceState
	const scopes =
		workspaceState.get<FileScopesWorkspaceState["scopes"]>("scopes")!

	const renamedScopes = Object.entries(scopes).map((v) => {
		if (v[0] === scopeName) {
			return [newScopeName, v[1]]
		}

		return v
	})

	const renamedScopesObject = Object.fromEntries(renamedScopes)

	workspaceState.update("scopes", renamedScopesObject)
	selectScope(context, newScopeName)
}

export function saveToSettings(context: vscode.ExtensionContext) {
	const workspaceState = context.workspaceState
	const scopes =
		workspaceState.get<FileScopesWorkspaceState["scopes"]>("scopes")!

	const extensionSettings = vscode.workspace.getConfiguration("folder-scopes")

	const filteredScopes = Object.entries(scopes).filter(
		(v) => v[0] !== RootScope
	)
	const filteredScopesObject = Object.fromEntries(filteredScopes)

	filteredScopesObject[RootScope] = {}

	extensionSettings.update("scopes", filteredScopesObject)
}

export function loadFromSettings(context: vscode.ExtensionContext) {
	const workspaceState = context.workspaceState

	const extensionSettings = vscode.workspace.getConfiguration("folder-scopes")

	const scopesFromSettings = extensionSettings.get(
		"scopes"
	) as FileScopesWorkspaceState["scopes"]

	const filteredScopes = Object.entries(scopesFromSettings).filter(
		(v) => v[0] !== RootScope
	)
	const filteredScopesObject = Object.fromEntries(filteredScopes)

	workspaceState.update("scopes", filteredScopesObject)
}
