# Selectors

CSS topic · Exam Wiki

```css
p            { }   /* every paragraph */
.card        { }   /* class */
#hero        { }   /* id, use once per page */
nav a        { }   /* link inside nav */
ul > li      { }   /* direct child only */
h2 + p       { }   /* paragraph right after h2 */
h2 ~ p       { }   /* all later siblings */
input[type="email"] { }   /* attribute */
[data-open]  { }   /* attribute present */
a:hover      { }   /* pseudo-class */
p::first-line { }  /* pseudo-element */
.card, .panel { }  /* grouping */
```

Universal selector `*` matches everything. Use it for resets, not for styling.
