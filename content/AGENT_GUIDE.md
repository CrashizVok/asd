# Content author guide

This repository builds an offline exam reference. Every topic and command is original
material written for this project. Do not copy W3Schools text, examples, or page
structures. Do not add external links.

## What you write

You write only the files assigned to you. Do not edit `offline/`, `tools/`,
`data.js`, `ref-*.js`, `README.md`, or another agent's files.

Two formats are accepted:

1. Topic pages: `content/<language>/<slug>.md`
2. Command entries: `content/ref/<language>-<unique-name>.json`

The command JSON filename must start with the language key: `html-`, `css-`, `js-`,
`react-`, `node-`, `java-`, or `javafx-`. The build uses that prefix to assign the
language when an entry has no `lang` field.

Topic pages are long explanations. Command entries are small reference cards with a
syntax line and an example. A language can have both.

## Topic page format

```markdown
---
id: react-useref
lang: React
title: useRef in depth
override: true
---

# useRef in depth

## Simplest form

```jsx
// Data shape: { current: value }
const ref = useRef(initialValue);
```

## What it does

...

## Every part

...

## Examples

### Example 1: ...
```

Rules:

- `id` is unique. Use the existing id when `override: true` replaces an existing page.
  For a new page, omit `override` or set it to `false`.
- `lang` must be one of `HTML`, `CSS`, `JavaScript`, `React`, `Node.js`, `Java`,
  `JavaFX`.
- Start the body with `## Simplest form` and a fenced code block. The first lines of
  that block are comments. Show the data shape or the smallest working call.
- Then explain every part, not only the happy path.
- Include at least three separate examples. At least one example must be a large,
  fully commented program or component that a student can read from top to bottom.
- Include `## Common mistakes` and `## Exam checklist`.
- Use fenced code blocks with `html`, `css`, `js`, `jsx`, or `java`.
- Use headings, paragraphs, lists, and code. Avoid tables in topic pages.
- Write English prose and English code comments.
- Do not use em dashes or en dashes in prose.

## Command entry format

```json
[
  {
    "id": "node-express-get",
    "group": "Express",
    "name": "app.get()",
    "syntax": "app.get(path, handler)",
    "desc": "Registers a handler for GET requests on a path.",
    "example": "app.get('/api/hotels', async (req, res) => {\n  // ...\n});",
    "body": "Optional Markdown. Use it for a longer explanation and a second example."
  }
]
```

Rules:

- The file must contain one JSON array.
- `id` is unique across the whole repository. Prefix it with the language, for example
  `node-`, `javafx-`, `react-`, `java-`.
- `group` is a short category, for example `Routing`, `Hooks`, `FXML`.
- `syntax` is the smallest signature. `desc` is one or two sentences. `example` is a
  complete, commented snippet.
- `body` is optional Markdown. The build converts it to HTML and the command page
  shows it under the example. Use it when the command deserves a longer explanation.
- Do not add external links. Link only to local topic ids if you must.

## Depth and style

- Write for a student who has four hours and no internet.
- Prefer complete examples over fragments. Name the file, the route, the table, or the
  component in the example.
- Show the simplest form first, then the realistic form.
- Explain why a line exists, not only what it does.
- Use neutral sample data. Do not use real people, real companies, or real credentials.
- Keep the existing exam field names where they matter: `customer_email`,
  `first_name`, `last_name`, `phone`, `birthday`, `image`, `hotel_id`, `city`, `name`,
  `description`, `stars`, `owner_email`, `start_date`, `end_date`, `adults`,
  `children`, `boylovers`.

## Check before you finish

1. JSON files parse with `node -e "JSON.parse(require('fs').readFileSync('FILE','utf8'))"`.
2. Every topic has front matter, `## Simplest form`, three examples, a large example,
   common mistakes, and an exam checklist.
3. No file outside your assignment changed.
4. No W3Schools text, no external links, no copied tutorial prose.
5. Return a short summary: files written and entry counts.
