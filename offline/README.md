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

## No npm, no build

`data.js` is already generated and committed. Opening `index.html` is all the exam machine needs. There is no `package.json`, no `node_modules`, and no install step.

The five cheat sheets are the source material:

- `../html/cheatsheet.md`
- `../css/cheatsheet.md`
- `../javascript/cheatsheet.md`
- `../react/cheatsheet.md`
- `../java/cheatsheet.md`

If you edit a cheat sheet, the wiki does not update by itself. Add the new article to `data.js` by hand, or ask for a regeneration before the exam.

## Files

```text
offline/
  index.html    layout and script tags
  style.css     Wikipedia-style design and responsive rules
  app.js        routing, sidebar, search, copy buttons
  data.js       all articles, committed
```

## Add a topic

Add an object to the `window.WIKI_ARTICLES` array in `data.js`:

```js
{
  id: "java-my-topic",
  lang: "Java",
  title: "My topic",
  html: "<p>Explanation.</p><pre><code>int x = 1;</code></pre>",
  plain: "Java My topic Explanation. int x = 1;",
  w3: "https://www.w3schools.com/java/"
}
```

The sidebar and search read the array on load. Keep `id` unique and include the words you want to find in `plain`.

## Design notes

The layout follows the familiar wiki pattern: search and logo in the top bar, contents in the left sidebar, one white article sheet, serif headings, blue links, and thin gray rules. It does not use the Wikipedia name or logo.

## Licence

The notes are original. The linked W3Schools pages remain the property of Refsnes Data.
