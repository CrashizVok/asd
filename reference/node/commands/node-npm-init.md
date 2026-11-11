# npm init

Node.js command · Setup

Writes a default package.json in the current folder. The -y flag accepts every prompt, which is what you want in an exam.

## Syntax

```js
npm init -y
```

## Example

```js
mkdir bookings-api
cd bookings-api

# Default manifest: name from the folder, version 1.0.0, no dependencies.
npm init -y

# Edit one field without opening an editor.
npm pkg set type=module
npm pkg set private=true

cat package.json
```

## Details

Interactive `npm init` asks for name, version, description, entry point, test command, repository, keywords, author and license. Only name and version change behavior, and `-y` fills both from the folder name.

`npm init` does not create folders, install packages, or touch git. Those are separate commands.
