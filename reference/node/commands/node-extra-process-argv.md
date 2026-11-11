# process.argv

Node.js command · Process

The command line arguments as an array. The first two entries are the Node binary and the script path, so slice them off.

## Syntax

```js
process.argv.slice(2)
```

## Example

```js
// File: src/import.js, run with: node src/import.js hotels.csv 2026
const args = process.argv.slice(2);
const [fileName, year] = args;

console.log(process.argv[0]); // "/usr/bin/node"
console.log(process.argv[1]); // "/srv/app/src/import.js"

if (!fileName) {
  console.error("Usage: node src/import.js <file> [year]");
  process.exit(1);
}

console.log("importing " + fileName + " for " + (year || "all years"));
```
