# Exam Wiki

A static, offline study site for HTML, CSS, JavaScript, React, and Java.

The site has two layers:

- **Topics** explain a pattern or a language area.
- **Command index** gives each tag, property, method, hook, or API its own page with syntax and an example.

There are 126 topic pages and 338 command pages. Everything is local. The site has no external links and does not need the internet.

## Open it

Open `index.html` in a browser. No server, npm install, or build step is needed.

If your browser blocks local scripts, serve the folder:

```bash
cd offline
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Search

The search box at the top matches topic titles, command names, syntax, descriptions, and examples. Type a command such as `ArrayList`, `useEffect`, `grid-template-columns`, `querySelector`, or `try-with-resources`.

Search starts at two characters. Press `/` anywhere to focus the box, and `Escape` to clear it.

The home page also has a large search field, language chips, and a featured card for each language.

## Design

The interface is a dark, app-like reference in the spirit of Grokipedia: a large editorial headline, language chips, featured cards, a fixed top bar, and a compact sidebar. It does not use the Grokipedia name, logo, or assets.

## No npm, no build

`data.js` and the `ref-*.js` files are committed. Opening `index.html` is all the exam machine needs. There is no `package.json`, no `node_modules`, and no install step.

## Files

```text
offline/
  index.html      layout and script tags
  style.css       dark theme and responsive rules
  app.js          routing, sidebar, search, copy buttons
  data.js         126 topic articles
  ref-html.js     86 HTML command pages
  ref-css.js      80 CSS command pages
  ref-js.js       74 JavaScript command pages
  ref-react.js    39 React command pages
  ref-java.js     59 Java command pages
```

The Markdown export is in the repository root:

```text
reference/
  README.md       full index
  html/topics/    one md file per HTML topic
  html/commands/  one md file per HTML command
  css/...
  javascript/...
  react/...
  java/...
```

## Add a topic

Add an object to the `window.WIKI_ARTICLES` array in `data.js`:

```js
{
  id: "java-my-topic",
  lang: "Java",
  title: "My topic",
  html: "<p>Explanation.</p><pre><code>int x = 1;</code></pre>",
  plain: "Java My topic Explanation. int x = 1;"
}
```

The sidebar and search read the array on load. Keep `id` unique and include the words you want to find in `plain`.

## Add a command

Add an object to the matching `ref-*.js` file:

```js
{
  id: "java-my-command",
  group: "Collections",
  name: "My command",
  syntax: "command(value)",
  desc: "What it does.",
  example: "command(42);"
}
```

The file already adds the `lang` field. Keep the `id` prefix unique.

## Regenerate the Markdown export

The export script uses only Node built-ins:

```bash
node tools/export-reference.mjs
```

It reads the cheat sheets and the reference data, then rewrites `reference/`. The site does not depend on the script at runtime.

## Licence

The notes and examples are original. The site does not contain copied W3Schools text and does not link to W3Schools.
