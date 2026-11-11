# fs.writeFile

Node.js command · File system

Writes data and creates or replaces the file. Pass flag 'a' to append instead of truncating.

## Syntax

```js
await writeFile(path, data, 'utf8')
```

## Example

```js
// File: src/write-report.js
import { writeFile } from "node:fs/promises";

const lines = ["name,city,stars", "Danube View,Budapest,4", "City Loft,Budapest,5"];

// The array is joined with newlines before writing
await writeFile("out/hotels.csv", lines.join("\n") + "\n", "utf8");

// Append keeps the existing content
await writeFile("out/hotels.csv", "Lake Garden,Eger,3\n", { flag: "a" });

// The parent directory must exist, writeFile does not create it
// Use mkdir with recursive: true first when unsure
```
