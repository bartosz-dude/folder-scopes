# Folder Scopes

Scope Visual Studio Code file tree in a similar way to IntelliJ IDEA Scopes.

## Overview

- Create scopes to show ony specific folder
![Create a scope and scope a folder](https://raw.githubusercontent.com/bartosz-dude/folder-scopes/main/images/createScope.gif?token=GHSAT0AAAAAACRIFC55TW4NWD724GQ6EWHSZTFZTOA)

- Hide unwanted files and folders in a scope
![Hide files and folders](https://raw.githubusercontent.com/bartosz-dude/folder-scopes/main/images/hideItems.gif?token=GHSAT0AAAAAACRIFC55KHHZAB7E7E2RRKQMZTFZTVA)

- Reveal again files and folders
![Show hidden files and folders](https://raw.githubusercontent.com/bartosz-dude/folder-scopes/main/images/showHidden.gif?token=GHSAT0AAAAAACRIFC55SILAHNYT4ZRYE7R2ZTFZT4Q)

- Switch between multiple scopes
![Switch between multiple scopes](https://raw.githubusercontent.com/bartosz-dude/folder-scopes/main/images/switchScopes.gif?token=GHSAT0AAAAAACRIFC54XINFFOYZRYWUOPW2ZTFZUKA)

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

## Support

You can support me on [ko-fi](https://ko-fi.com/bartoszdude)

<a href='https://ko-fi.com/E1E5Z3TEO' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi1.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
