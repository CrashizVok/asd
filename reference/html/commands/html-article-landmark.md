# <article>

HTML command · Semantics

A self-contained composition that would still make sense on its own, such as a post, a review or a comment. It should have its own heading.

## Syntax

```html
<article> ... </article>
```

## Example

```html
<article>
  <header>
    <h2>Quiet rooms, slow breakfast</h2>
    <p><time datetime="2026-03-02">2 March 2026</time></p>
  </header>

  <p>The room faced the river.</p>

  <!-- A comment is also self-contained, so it is a nested article. -->
  <section aria-labelledby="comments">
    <h3 id="comments">Comments</h3>
    <article>
      <h4>Reply from the hotel</h4>
      <p>Breakfast now starts at 6:30.</p>
    </article>
  </section>
</article>
```

## Details

The test is syndication: could this block move to another page or a feed and still stand? If yes, article. A product card in a grid often fails that test and is better as a list item or a div.
