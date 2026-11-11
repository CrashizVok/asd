# npm run

Node.js command · Scripts

Runs a command from the scripts object, with node_modules/.bin on PATH. Everything after -- is passed to the command.

## Syntax

```js
npm run <script> [-- <args>]
```

## Example

```js
# List every script in the nearest package.json.
npm run

# Run one by name.
npm run dev

# start and test are shortcuts, no run needed.
npm start
npm test

# Flags go after -- or npm may eat them.
npm run lint -- --fix
```

## Details

npm also understands `pre<script>` and `post<script>` hooks, so `npm run dev` can run `predev` first. Use a hook for a cheap check such as "does .env exist", not for real work.

The exit code of the command becomes npm's exit code, so a failing test fails the pipeline.
