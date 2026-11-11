# rename()

Node.js command · Files

Moves or renames a path in one atomic step when both paths are on the same filesystem. This is the safe way to publish a finished file.

## Syntax

```js
await rename(oldPath, newPath)
```

## Example

```js
import { writeFile, rename, rm } from 'node:fs/promises';
import path from 'node:path';

async function writeAtomic(target, data) {
    // The temp file must sit in the same directory, or rename fails with EXDEV.
    const tmp = path.join(path.dirname(target), `.${path.basename(target)}.tmp`);
    try {
        await writeFile(tmp, data);
        await rename(tmp, target); // replaces the old file in one step
    } catch (err) {
        await rm(tmp, { force: true });
        throw err;
    }
}

await writeAtomic('out/report.json', '{"ok":true}\n');
```

## Details

A reader either sees the old file or the new one, never a partial write. Renaming across devices, for example from `/tmp` to a mounted volume, fails with `EXDEV` and needs a copy plus delete instead.
