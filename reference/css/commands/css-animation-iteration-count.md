# animation-iteration-count

CSS command · Animation

How many passes run. Fractional values are legal and stop mid pass.

## Syntax

```css
animation-iteration-count: 1 | 3 | infinite;
```

## Example

```css
.blink {
  animation: blink 900ms steps(1, end) infinite;
}

.once {
  animation: fade-in 400ms ease 1 both;
}

/* half of the second pass, then it stops */
.halfway {
  animation: slide 1s ease 1.5 both;
}
```

## Details

`infinite` animations never finish, so `animationend` never fires for them. Anything relying on that event must target a finite animation instead.
