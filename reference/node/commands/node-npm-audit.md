# npm audit

Node.js command · Security

Lists known vulnerabilities in the installed tree, read from the lockfile. npm audit fix updates inside the allowed ranges.

## Syntax

```js
npm audit [fix]
```

## Example

```js
# Report only. Exit code 1 when a vulnerability is found.
npm audit

# Update packages within the existing semver ranges.
npm audit fix

# Show what a forced major upgrade would change, without doing it.
npm audit fix --dry-run --force

# Check one direct dependency and its tree.
npm ls express
```

## Details

The report separates direct dependencies from transitive ones. A finding deep in the tree is usually fixed by updating the package that pulls it in, not by editing the lockfile by hand.

`--force` crosses major versions, so run the app and the tests afterwards. Ten minutes before a deadline is the wrong moment for it.
