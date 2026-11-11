# <ruby>

HTML command · Semantic text

Places a small annotation above characters, used for pronunciation in East Asian text. rt holds the annotation, rp the fallback brackets.

## Syntax

```html
<ruby>漢<rt>kan</rt></ruby>
```

## Example

```html
<p lang="ja"><ruby>宿<rt>やど</rt></ruby> means inn.</p>

<!-- rp is shown only when ruby is unsupported -->
<ruby>東京<rp>(</rp><rt>とうきょう</rt><rp>)</rp></ruby>
```
