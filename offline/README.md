# Exam Wiki

A static, offline study site for seven languages: HTML, CSS, JavaScript, React, Node.js, Java, and JavaFX.

The site has two layers:

- **Topics** explain a pattern or a language area.
- **Command index** gives each tag, property, method, hook, or API its own page with syntax and an example.

There are 167 topic pages and 1240 command pages. Everything is local. The site has no external links and does not need the internet.

| Language | Topic pages | Command pages |
|---|---|---|
| HTML | 23 | 190 |
| CSS | 30 | 216 |
| JavaScript | 35 | 168 |
| React | 28 | 141 |
| Node.js | 10 | 151 |
| Java | 37 | 286 |
| JavaFX | 4 | 88 |

## Open it

Open `index.html` in a browser. No server, npm install, or build step is needed.

If your browser blocks local scripts, serve the folder:

```bash
cd offline
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Search

The search box at the top matches topic titles, command names, syntax, descriptions, and examples. Type a command such as `ArrayList`, `useEffect`, `grid-template-columns`, `querySelector`, `knex`, or `try-with-resources`.

Search starts at two characters. Press `/` anywhere to focus the box, and `Escape` to clear it.

The home page also has a large search field, language chips, and a featured card for each language.

## Design

The interface is a dark, app-like reference: a large editorial headline, language chips, featured cards, a fixed top bar, and a compact sidebar. It does not use the Grokipedia name, logo, or assets.

## No npm, no build

Everything the browser reads is committed: `data.js`, the five legacy `ref-*.js` files, and `generated-content.js`. Opening `index.html` is all the exam machine needs. There is no `package.json`, no `node_modules`, and no install step.

## Files

```text
offline/
  index.html            layout and script tags
  style.css             dark theme and responsive rules
  app.js                routing, sidebar, search, copy buttons
  data.js               126 base topic articles (HTML, CSS, JavaScript, React, Java)
  ref-html.js           86 base HTML command pages
  ref-css.js            80 base CSS command pages
  ref-js.js             74 base JavaScript command pages
  ref-react.js          39 base React command pages
  ref-java.js           59 base Java command pages
  generated-content.js  built from content/, loaded after the base files
```

The script order matters. `data.js` and `ref-*.js` load first, then `generated-content.js`, then `app.js`. The last two files merge into the base data by `id`, so a Markdown page can replace a thin base page or add a new one.

Node.js and JavaFX have no base files. Every one of their pages comes from `content/`.

## Content pipeline

The source of truth for new material is Markdown and JSON under `content/`:

```text
content/
  html/*.md           one topic page per file
  css/*.md
  javascript/*.md
  react/*.md
  node/*.md
  java/*.md
  javafx/*.md
  ref/*.json          command entries, filename prefixed with the language key
  AGENT_GUIDE.md      format rules for new content
```

A topic page starts with front matter:

```markdown
---
id: node-express-knex-project
lang: Node.js
title: Express and Knex project
---

# Express and Knex project
```

Add `override: true` to the front matter when the id belongs to an existing base page in `data.js` and the Markdown should win.

A command entry is a JSON object in `content/ref/<lang>-<name>.json`:

```json
{
  "id": "node-knex-select",
  "group": "Queries",
  "name": "select()",
  "syntax": "db('table').select('a', 'b')",
  "desc": "One sentence on what it does.",
  "example": "const rows = await db('bookings').select('id');",
  "body": "Optional extra Markdown shown under the example."
}
```

Rebuild the browser bundle after editing `content/`:

```bash
node tools/build-content.mjs
```

The script reads `content/`, writes `offline/generated-content.js`, and prints the override and extra counts. It uses only Node built-ins.

## Markdown export

The repository root holds a one-file-per-page Markdown mirror:

```text
reference/
  README.md       full index
  html/topics/    one md file per HTML topic
  html/commands/  one md file per HTML command
  css/...
  javascript/...
  react/...
  node/...
  java/...
  javafx/...
```

Regenerate it with:

```bash
node tools/export-reference.mjs
```

It reads the base cheat sheets and `generated-content.js` and rewrites `reference/`. The site does not depend on the script at runtime.

## Add a topic by hand

Without touching `content/`, add an object to the `window.WIKI_ARTICLES` array in `data.js`:

```js
{
  id: "java-my-topic",
  lang: "Java",
  title: "My topic",
  html: "<p>Explanation.</p><pre><code>int x = 1;</code></pre>",
  plain: "Java My topic Explanation. int x = 1;"
}
```

The sidebar and search read the array on load. Keep `id` unique and include the words you want to find in `plain`. For anything longer than a few paragraphs, use the Markdown pipeline instead.

## Licence

The notes and examples are original. The site does not contain copied W3Schools text and does not link to W3Schools.
