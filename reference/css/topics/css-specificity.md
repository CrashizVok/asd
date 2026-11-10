# Specificity

CSS topic · Exam Wiki

Specificity is a weight, not a count of characters. Four columns: inline style, id, class/attribute/pseudo-class, element/pseudo-element.

```text
style="..."         1,0,0,0
#hero               0,1,0,0
.card:hover         0,0,2,0
nav ul li           0,0,0,3
*                   0,0,0,0
```

Higher wins. Equal weight: the later rule wins. `!important` beats all normal rules, so treat it as a last resort. Keep selectors flat. Three classes beat one deep chain and they are easier to override.
