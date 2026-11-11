# npm install

Node.js command · Dependencies

Downloads a package into node_modules and records it in package.json. With no argument it installs everything the manifest lists.

## Syntax

```js
npm install <package>
```

## Example

```js
# Runtime packages: needed by the running server.
npm install express cors dotenv mysql2

# No argument: install what package.json already lists.
npm install

# See what is installed at the top level.
npm ls --depth=0
```

## Details

Installing without a name is the normal command after cloning a repository. Installing with a name also writes the entry, so the two commands are not interchangeable.

A version suffix pins what gets recorded: `npm install express@4.21.2` writes an exact version, `npm install express@^4` writes a caret range.
