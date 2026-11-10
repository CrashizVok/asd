# Exam Wiki

A static, searchable reference for HTML, CSS, JavaScript, React, and Java.

The text is original exam material from the cheat sheets in this repository. It is not a copy of W3Schools. Each article links to the matching W3Schools section for the full tutorial.

## Open it

Open `index.html` in a browser. No server or build step is needed for the generated site.

If your browser blocks local scripts, serve the folder:

```bash
cd offline
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Search

The search box at the top matches titles, explanations, and code examples. Type a command such as `querySelector`, `useEffect`, `ArrayList`, `HashMap`, `try-with-resources`, or `grid-template-columns`.

Search starts at two characters. Press `/` anywhere to focus the box, and `Escape` to clear it.

## Rebuild after editing a cheat sheet

`data.js` is generated from the five cheat sheets:

- `../html/cheatsheet.md`
- `../css/cheatsheet.md`
- `../javascript/cheatsheet.md`
- `../react/cheatsheet.md`
- `../java/cheatsheet.md`

Run:

```bash
cd offline
npm install
npm run build
```

The build splits each sheet on `##` headings and converts the Markdown to HTML. Every level two heading becomes one article.

## Files

```text
offline/
  index.html    layout and script tags
  style.css     Wikipedia-style design and responsive rules
  app.js        routing, sidebar, search, copy buttons
  build.mjs     cheat sheet to data.js converter
  data.js       generated articles, do not edit by hand
  package.json  marked build dependency
```

## Add a topic

Add a new `##` section to the relevant cheat sheet, then run `npm run build`. The sidebar and search pick it up automatically.

## Design notes

The layout follows the familiar wiki pattern: search and logo in the top bar, contents in the left sidebar, one white article sheet, serif headings, blue links, and thin gray rules. It does not use the Wikipedia name or logo.

## Licence

The notes are original. The linked W3Schools pages remain the property of Refsnes Data.
