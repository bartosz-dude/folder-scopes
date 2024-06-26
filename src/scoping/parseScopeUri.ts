import * as vscode from "vscode"

export function parseScopeUri(folderUri: vscode.Uri) {
	const folderUriWorkspace = vscode.workspace.getWorkspaceFolder(folderUri)
	const folderUriRelative = vscode.workspace.asRelativePath(folderUri, false)

	return {
		folderPath: folderUriRelative,
		workspaceFolder: folderUriWorkspace?.name ?? "",
	}
}
