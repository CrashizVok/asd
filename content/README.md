# Content pipeline

The site is generated from Markdown and JSON in this folder.

- `content/<language>/*.md` holds topic pages.
- `content/ref/*.json` holds command entries.
- `node tools/build-content.mjs` writes `offline/generated-content.js`.
- `node tools/export-reference.mjs` rebuilds the `reference/` Markdown export.

The build has no dependencies. It runs on Node built-ins only.

## Language folders

```text
content/
  html/
  css/
  javascript/
  react/
  node/
  java/
  javafx/
  ref/
```

## Add one topic

Create `content/react/my-topic.md`:

```markdown
---
id: react-my-topic
lang: React
title: My topic
---

# My topic

## Simplest form

```jsx
// Data shape: { value: string }
const [value, setValue] = useState('');
```

...
```

Then run:

```bash
node tools/build-content.mjs
node tools/export-reference.mjs
```

## Add one command

Create `content/ref/my-commands.json`:

```json
[
  {
    "id": "react-my-hook",
    "group": "Hooks",
    "name": "useMyHook()",
    "syntax": "const value = useMyHook(input)",
    "desc": "What the hook returns and when it runs.",
    "example": "const value = useMyHook(input);"
  }
]
```

Then run the two build commands. The site loads `offline/generated-content.js`
before `offline/app.js`.
