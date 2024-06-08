# Folder Scopes

Scope Visual Studio Code file tree in a similar way to IntelliJ IDEA Scopes.

## Overview

- Create scopes to show ony specific folder
![Create a scope and scope a folder](images/createScope.gif)

- Hide unwanted files and folders in a scope
![Hide files and folders](images/hideItems.gif)

- Reveal again files and folders
![Show hidden files and folders](images/showHidden.gif)

- Switch between multiple scopes
![Switch between multiple scopes](images/switchScopes.gif)

## Features

- Create scopes
- Scope file view to a specific folder
- Hide files and folders in a scope
- `Root` scope allows you to always see unscoped file view
- Each workspace folder has separate scope
- Saves defined scopes in `settings.json` in `.vscode` to work with source control

## How to use

By default a workspace has a `Root` scope, you can't hide files and scope folder in it. To do so you must create a new scope with `Create Scope` command, it will automatically switch to the newly created scope.

To scope a folder you open context menu of a folder in explorer and choose `Scope Folder`. To remove folder scoping in a scope you use `Unscope` command. You can't scope `.vscode` and workspace folders.

To hide a file or a folder you open context menu of target element and choose `Hide File` or `Hide Folder` respectively. To remove hiding you use `Reveal Hidden Files` command.

Switching between scopes can be done with either `Switch Scope` command or by clicking current scope name on the status bar.

Renaming scope can be done with `Rename Scope` command and deleting with `Delete Scope`.

## Quirks

Folder Scopes uses `"files.exclude"` setting saved in `.vscode` to work, so when using source control make sure that either you are commting empty `"files.exclude"` or all collaborators have this extension installed. Folder Scopes will maintain selected scope of a user independent of `"files.exclude"`.

File with its path will show up in file explorer as long as its editor is visible, even when the file is hidden.

## Known Issues

- `"file.exclude"` setting in `.vscode` folder will be overwritten
