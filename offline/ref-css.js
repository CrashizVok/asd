(function () {
    const lang = 'CSS';

    const entries = [
        {
            id: 'css-selector-element',
            group: 'Selectors',
            name: 'element selector',
            syntax: 'p { color: #333; }',
            desc: 'Selects every element of that type.',
            example: 'p {\n  color: #333;\n  line-height: 1.6;\n}'
        },
        {
            id: 'css-selector-class',
            group: 'Selectors',
            name: '.class selector',
            syntax: '.card { border: 1px solid #ccc; }',
            desc: 'Selects every element with that class. One element can have several classes.',
            example: '.card {\n  padding: 16px;\n  border-radius: 12px;\n}\n\n.card.is-active {\n  border-color: teal;\n}'
        },
        {
            id: 'css-selector-id',
            group: 'Selectors',
            name: '#id selector',
            syntax: '#header { background: #111; }',
            desc: 'Selects the element with that id. An id must be unique on the page.',
            example: '#content {\n  max-width: 1100px;\n  margin: 0 auto;\n}'
        },
        {
            id: 'css-selector-universal',
            group: 'Selectors',
            name: '* selector',
            syntax: '* { box-sizing: border-box; }',
            desc: 'Selects every element. Use it sparingly for global resets.',
            example: '*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}'
        },
        {
            id: 'css-selector-attribute',
            group: 'Selectors',
            name: '[attribute] selector',
            syntax: 'input[type="email"] { border-color: teal; }',
            desc: 'Selects elements that have an attribute, or an attribute with a specific value.',
            example: 'a[target="_blank"] {\n  text-decoration: underline;\n}\n\ninput[type="date"] {\n  font-family: inherit;\n}'
        },
        {
            id: 'css-selector-descendant',
            group: 'Selectors',
            name: 'descendant selector',
            syntax: '.card p { margin: 0; }',
            desc: 'Selects p elements inside .card, at any depth.',
            example: '.card h2 {\n  margin: 0 0 8px;\n}\n\n.card p {\n  margin: 0;\n}'
        },
        {
            id: 'css-selector-child',
            group: 'Selectors',
            name: 'child selector >',
            syntax: '.menu > li { display: inline-block; }',
            desc: 'Selects only direct children, not deeper descendants.',
            example: '.menu > li {\n  display: inline-block;\n  margin-right: 12px;\n}'
        },
        {
            id: 'css-selector-sibling',
            group: 'Selectors',
            name: 'adjacent and general sibling',
            syntax: 'h2 + p { margin-top: 0; }\nh2 ~ p { color: #555; }',
            desc: '+ selects the next sibling, ~ selects all following siblings.',
            example: 'h2 + p {\n  margin-top: 0;\n}\n\nlabel + input {\n  margin-left: 8px;\n}'
        },
        {
            id: 'css-selector-hover',
            group: 'Selectors',
            name: ':hover',
            syntax: 'button:hover { background: teal; }',
            desc: 'Applies styles while the pointer is over the element.',
            example: 'button:hover {\n  background: #0f766e;\n  color: white;\n}'
        },
        {
            id: 'css-selector-focus',
            group: 'Selectors',
            name: ':focus and :focus-visible',
            syntax: 'input:focus { outline: 2px solid teal; }',
            desc: 'Applies styles when the element has keyboard or mouse focus. :focus-visible is usually better for keyboard rings.',
            example: 'a:focus-visible,\nbutton:focus-visible {\n  outline: 3px solid #5eead4;\n  outline-offset: 3px;\n}'
        },
        {
            id: 'css-selector-nth-child',
            group: 'Selectors',
            name: ':nth-child()',
            syntax: 'li:nth-child(2n) { background: #f5f5f5; }',
            desc: 'Selects elements by their position among siblings. odd, even, and formulas like 2n+1 work.',
            example: 'tbody tr:nth-child(even) {\n  background: #f1f5f9;\n}\n\nli:first-child {\n  font-weight: 700;\n}'
        },
        {
            id: 'css-selector-not',
            group: 'Selectors',
            name: ':not()',
            syntax: '.card:not(.featured) { opacity: 0.8; }',
            desc: 'Selects elements that do not match the inner selector.',
            example: 'input:not([type="submit"]) {\n  border: 1px solid #ccc;\n}'
        },
        {
            id: 'css-selector-is',
            group: 'Selectors',
            name: ':is() and :where()',
            syntax: ':is(h1, h2, h3) { line-height: 1.2; }',
            desc: 'Groups selectors. :is takes the highest specificity of its arguments; :where has zero specificity.',
            example: ':is(h1, h2, h3) {\n  line-height: 1.2;\n}\n\n:where(.card, .panel) {\n  padding: 16px;\n}'
        },
        {
            id: 'css-selector-before-after',
            group: 'Selectors',
            name: '::before and ::after',
            syntax: '.required::after { content: " *"; color: red; }',
            desc: 'Creates a pseudo-element before or after the content. The content property is required.',
            example: '.required::after {\n  content: " *";\n  color: #b91c1c;\n}\n\n.clearfix::after {\n  content: "";\n  display: table;\n  clear: both;\n}'
        },
        {
            id: 'css-selector-root',
            group: 'Selectors',
            name: ':root',
            syntax: ':root { --accent: teal; }',
            desc: 'Selects the document root, usually html. It is the usual place for CSS variables.',
            example: ':root {\n  --bg: #0b0f14;\n  --text: #e6edf3;\n  --accent: #5eead4;\n}\n\nbody {\n  background: var(--bg);\n  color: var(--text);\n}'
        },
        {
            id: 'css-width-height',
            group: 'Box model',
            name: 'width and height',
            syntax: '.box { width: 300px; height: 200px; }',
            desc: 'Sets the content size. With box-sizing: border-box, padding and border are included.',
            example: '.card {\n  width: 100%;\n  max-width: 420px;\n  height: auto;\n}'
        },
        {
            id: 'css-min-max',
            group: 'Box model',
            name: 'min-width, max-width, min-height, max-height',
            syntax: '.panel { max-width: 1100px; min-height: 100vh; }',
            desc: 'Sets limits so an element can grow or shrink but never past the limit.',
            example: '.panel {\n  width: 100%;\n  max-width: 1100px;\n  min-height: 60vh;\n  margin: 0 auto;\n}'
        },
        {
            id: 'css-margin',
            group: 'Box model',
            name: 'margin',
            syntax: 'margin: 16px auto;',
            desc: 'Space outside the border. auto centers a block with a fixed width. Shorthand order: top, right, bottom, left.',
            example: '.container {\n  margin: 0 auto;\n}\n\n.card {\n  margin: 0 0 16px;\n}'
        },
        {
            id: 'css-padding',
            group: 'Box model',
            name: 'padding',
            syntax: 'padding: 16px 24px;',
            desc: 'Space inside the border, around the content. It increases the clickable area.',
            example: '.button {\n  padding: 10px 18px;\n}\n\n.card {\n  padding: 20px;\n}'
        },
        {
            id: 'css-border',
            group: 'Box model',
            name: 'border',
            syntax: 'border: 1px solid #ccc;',
            desc: 'Sets width, style, and colour of the border. Use border-radius for rounded corners.',
            example: '.card {\n  border: 1px solid #d0d7de;\n  border-radius: 12px;\n}\n\n.card:hover {\n  border-color: teal;\n}'
        },
        {
            id: 'css-border-radius',
            group: 'Box model',
            name: 'border-radius',
            syntax: 'border-radius: 12px;',
            desc: 'Rounds the corners. Use 50% for a circle on a square element.',
            example: '.avatar {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n}\n\n.panel {\n  border-radius: 16px;\n}'
        },
        {
            id: 'css-box-sizing',
            group: 'Box model',
            name: 'box-sizing',
            syntax: 'box-sizing: border-box;',
            desc: 'Makes width include padding and border. Most projects set it globally.',
            example: '*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}'
        },
        {
            id: 'css-box-shadow',
            group: 'Box model',
            name: 'box-shadow',
            syntax: 'box-shadow: 0 8px 24px rgba(0,0,0,.12);',
            desc: 'Adds a shadow around the box. Values: x offset, y offset, blur, spread, colour.',
            example: '.card {\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);\n}\n\n.button:focus-visible {\n  box-shadow: 0 0 0 4px rgba(94, 234, 212, 0.35);\n}'
        },
        {
            id: 'css-outline',
            group: 'Box model',
            name: 'outline',
            syntax: 'outline: 3px solid teal;',
            desc: 'Draws a line outside the border. Unlike border, it does not take space. Never remove focus outlines without a replacement.',
            example: 'a:focus-visible {\n  outline: 3px solid #5eead4;\n  outline-offset: 3px;\n}'
        },
        {
            id: 'css-overflow',
            group: 'Box model',
            name: 'overflow',
            syntax: 'overflow: auto;',
            desc: 'Controls what happens when content is too large. visible, hidden, scroll, auto, and clip are common.',
            example: '.table-wrap {\n  overflow-x: auto;\n}\n\n.modal {\n  overflow-y: auto;\n  max-height: 80vh;\n}'
        },
        {
            id: 'css-aspect-ratio',
            group: 'Box model',
            name: 'aspect-ratio',
            syntax: 'aspect-ratio: 16 / 9;',
            desc: 'Keeps a width-to-height ratio while the element resizes.',
            example: '.cover {\n  width: 100%;\n  aspect-ratio: 16 / 9;\n  object-fit: cover;\n}'
        },
        {
            id: 'css-display',
            group: 'Layout',
            name: 'display',
            syntax: 'display: flex;',
            desc: 'Sets the layout type: block, inline, inline-block, flex, grid, none, contents, and more.',
            example: '.nav {\n  display: flex;\n  gap: 12px;\n}\n\n.hidden {\n  display: none;\n}'
        },
        {
            id: 'css-position',
            group: 'Layout',
            name: 'position',
            syntax: 'position: relative;',
            desc: 'Places an element in the normal flow or relative to another box. Values: static, relative, absolute, fixed, sticky.',
            example: '.card {\n  position: relative;\n}\n\n.badge {\n  position: absolute;\n  top: 8px;\n  right: 8px;\n}'
        },
        {
            id: 'css-top-right-bottom-left',
            group: 'Layout',
            name: 'top, right, bottom, left',
            syntax: 'top: 0; right: 0;',
            desc: 'Offsets a positioned element. They do nothing unless position is not static.',
            example: '.navbar {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n}'
        },
        {
            id: 'css-z-index',
            group: 'Layout',
            name: 'z-index',
            syntax: 'z-index: 10;',
            desc: 'Sets the stacking order of positioned elements. A higher number is closer to the viewer.',
            example: '.navbar {\n  position: sticky;\n  top: 0;\n  z-index: 20;\n}\n\n.modal-overlay {\n  position: fixed;\n  inset: 0;\n  z-index: 100;\n}'
        },
        {
            id: 'css-float-clear',
            group: 'Layout',
            name: 'float and clear',
            syntax: 'float: left; clear: both;',
            desc: 'Moves an element to the left or right and lets text wrap around it. Modern layouts use flex or grid instead.',
            example: '.photo {\n  float: left;\n  margin: 0 16px 8px 0;\n}\n\n.footer {\n  clear: both;\n}'
        },
        {
            id: 'css-flex',
            group: 'Flexbox',
            name: 'display: flex',
            syntax: '.row { display: flex; }',
            desc: 'Turns the container into a flex container. Children become flex items in one direction.',
            example: '.row {\n  display: flex;\n  gap: 16px;\n  align-items: center;\n}'
        },
        {
            id: 'css-flex-direction',
            group: 'Flexbox',
            name: 'flex-direction',
            syntax: 'flex-direction: column;',
            desc: 'Sets the main axis: row (default), row-reverse, column, or column-reverse.',
            example: '.stack {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}'
        },
        {
            id: 'css-justify-content',
            group: 'Flexbox',
            name: 'justify-content',
            syntax: 'justify-content: space-between;',
            desc: 'Spreads items along the main axis: flex-start, center, flex-end, space-between, space-around, space-evenly.',
            example: '.topbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}'
        },
        {
            id: 'css-align-items',
            group: 'Flexbox',
            name: 'align-items and align-self',
            syntax: 'align-items: center;',
            desc: 'Aligns items on the cross axis. align-self overrides it for one item.',
            example: '.card-row {\n  display: flex;\n  align-items: stretch;\n}\n\n.card-row .icon {\n  align-self: flex-start;\n}'
        },
        {
            id: 'css-flex-wrap',
            group: 'Flexbox',
            name: 'flex-wrap',
            syntax: 'flex-wrap: wrap;',
            desc: 'Lets flex items move to the next line when there is no space.',
            example: '.tags {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}'
        },
        {
            id: 'css-flex-grow-shrink-basis',
            group: 'Flexbox',
            name: 'flex-grow, flex-shrink, flex-basis',
            syntax: 'flex: 1 1 240px;',
            desc: 'Controls how an item grows, shrinks, and starts. flex: 1 1 240px is a common responsive card rule.',
            example: '.card {\n  flex: 1 1 260px;\n}\n\n.sidebar {\n  flex: 0 0 260px;\n}'
        },
        {
            id: 'css-gap',
            group: 'Flexbox',
            name: 'gap',
            syntax: 'gap: 16px;',
            desc: 'Sets space between flex or grid items. It is cleaner than margins on every child.',
            example: '.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}'
        },
        {
            id: 'css-order',
            group: 'Flexbox',
            name: 'order',
            syntax: 'order: -1;',
            desc: 'Changes the visual order of a flex or grid item without changing the HTML order.',
            example: '.sidebar {\n  order: 2;\n}\n\n.main {\n  order: 1;\n}'
        },
        {
            id: 'css-grid',
            group: 'Grid',
            name: 'display: grid',
            syntax: '.grid { display: grid; }',
            desc: 'Turns the container into a grid. You define columns and rows, and items are placed into cells.',
            example: '.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}'
        },
        {
            id: 'css-grid-template-columns',
            group: 'Grid',
            name: 'grid-template-columns',
            syntax: 'grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));',
            desc: 'Defines the column track sizes. repeat and minmax make a responsive card grid without media queries.',
            example: '.cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));\n  gap: 20px;\n}'
        },
        {
            id: 'css-grid-template-rows',
            group: 'Grid',
            name: 'grid-template-rows',
            syntax: 'grid-template-rows: auto 1fr auto;',
            desc: 'Defines the row track sizes. 1fr takes the remaining space.',
            example: '.page {\n  display: grid;\n  grid-template-rows: auto 1fr auto;\n  min-height: 100vh;\n}'
        },
        {
            id: 'css-grid-column-row',
            group: 'Grid',
            name: 'grid-column and grid-row',
            syntax: 'grid-column: 1 / 3;',
            desc: 'Places an item across grid lines. span 2 is also common.',
            example: '.featured {\n  grid-column: 1 / -1;\n}\n\n.card.wide {\n  grid-column: span 2;\n}'
        },
        {
            id: 'css-grid-area',
            group: 'Grid',
            name: 'grid-template-areas and grid-area',
            syntax: 'grid-template-areas: "head head" "side main";',
            desc: 'Names areas and places items by name. Good for page layouts.',
            example: '.layout {\n  display: grid;\n  grid-template-areas:\n    "head head"\n    "side main";\n  grid-template-columns: 240px 1fr;\n}\n\n.header { grid-area: head; }\n.sidebar { grid-area: side; }\n.main { grid-area: main; }'
        },
        {
            id: 'css-place-items',
            group: 'Grid',
            name: 'place-items and place-content',
            syntax: 'place-items: center;',
            desc: 'Shorthand for align-items and justify-items, or align-content and justify-content.',
            example: '.center {\n  display: grid;\n  place-items: center;\n  min-height: 60vh;\n}'
        },
        {
            id: 'css-font-family',
            group: 'Typography',
            name: 'font-family',
            syntax: 'font-family: system-ui, sans-serif;',
            desc: 'Sets the typeface. Always end with a generic family.',
            example: 'body {\n  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;\n}\n\ncode {\n  font-family: ui-monospace, Consolas, monospace;\n}'
        },
        {
            id: 'css-font-size',
            group: 'Typography',
            name: 'font-size',
            syntax: 'font-size: 1.125rem;',
            desc: 'Sets text size. rem is relative to the root font size and is easier to scale.',
            example: 'body {\n  font-size: 16px;\n}\n\nh1 {\n  font-size: clamp(2rem, 5vw, 4rem);\n}'
        },
        {
            id: 'css-font-weight',
            group: 'Typography',
            name: 'font-weight',
            syntax: 'font-weight: 700;',
            desc: 'Sets boldness: 400 normal, 700 bold, or 100 to 900 if the font supports it.',
            example: '.card h2 {\n  font-weight: 700;\n}\n\n.muted {\n  font-weight: 400;\n}'
        },
        {
            id: 'css-line-height',
            group: 'Typography',
            name: 'line-height',
            syntax: 'line-height: 1.6;',
            desc: 'Sets the space between lines. A unitless value scales with the font size.',
            example: 'body {\n  line-height: 1.65;\n}\n\nh1 {\n  line-height: 1.1;\n}'
        },
        {
            id: 'css-text-align',
            group: 'Typography',
            name: 'text-align',
            syntax: 'text-align: center;',
            desc: 'Aligns inline content inside the box: left, right, center, justify.',
            example: '.hero {\n  text-align: center;\n}\n\n.price {\n  text-align: right;\n}'
        },
        {
            id: 'css-text-decoration',
            group: 'Typography',
            name: 'text-decoration',
            syntax: 'text-decoration: none;',
            desc: 'Adds or removes underline, overline, or line-through. You can also set colour and style.',
            example: 'a {\n  text-decoration: none;\n}\n\na:hover {\n  text-decoration: underline;\n}\n\n.old-price {\n  text-decoration: line-through;\n}'
        },
        {
            id: 'css-text-transform',
            group: 'Typography',
            name: 'text-transform',
            syntax: 'text-transform: uppercase;',
            desc: 'Changes letter case: uppercase, lowercase, capitalize, none.',
            example: '.label {\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n}'
        },
        {
            id: 'css-letter-spacing',
            group: 'Typography',
            name: 'letter-spacing',
            syntax: 'letter-spacing: 0.05em;',
            desc: 'Adds space between letters. Small caps and labels often use a little tracking.',
            example: '.eyebrow {\n  letter-spacing: 0.12em;\n  text-transform: uppercase;\n}'
        },
        {
            id: 'css-white-space',
            group: 'Typography',
            name: 'white-space',
            syntax: 'white-space: nowrap;',
            desc: 'Controls wrapping and spaces. nowrap keeps text on one line; pre keeps formatting.',
            example: '.badge {\n  white-space: nowrap;\n}\n\npre {\n  white-space: pre;\n  overflow-x: auto;\n}'
        },
        {
            id: 'css-color',
            group: 'Typography',
            name: 'color',
            syntax: 'color: #e6edf3;',
            desc: 'Sets the text colour. Use a contrast checker for body text.',
            example: 'body {\n  color: #e6edf3;\n  background: #0b0f14;\n}\n\n.muted {\n  color: #8b949e;\n}'
        },
        {
            id: 'css-background-color',
            group: 'Background',
            name: 'background-color',
            syntax: 'background-color: #11151c;',
            desc: 'Sets a solid background colour.',
            example: '.panel {\n  background-color: #11151c;\n  color: #e6edf3;\n}'
        },
        {
            id: 'css-background-image',
            group: 'Background',
            name: 'background-image',
            syntax: 'background-image: url("photo.jpg");',
            desc: 'Sets one or more background images. A gradient is also an image value.',
            example: '.hero {\n  background-image: linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.6)), url("hotel.jpg");\n}'
        },
        {
            id: 'css-background-size',
            group: 'Background',
            name: 'background-size',
            syntax: 'background-size: cover;',
            desc: 'Scales the image. cover fills the box and crops; contain shows the whole image.',
            example: '.hero {\n  background-image: url("hotel.jpg");\n  background-size: cover;\n  background-position: center;\n}'
        },
        {
            id: 'css-background-position-repeat',
            group: 'Background',
            name: 'background-position and background-repeat',
            syntax: 'background-position: center; background-repeat: no-repeat;',
            desc: 'Places the image and controls tiling.',
            example: '.hero {\n  background-image: url("hotel.jpg");\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n}'
        },
        {
            id: 'css-gradient',
            group: 'Background',
            name: 'linear-gradient and radial-gradient',
            syntax: 'background: linear-gradient(135deg, #0f766e, #0b0f14);',
            desc: 'Creates a gradient image. Use it as a background or overlay.',
            example: '.button {\n  background: linear-gradient(135deg, #14b8a6, #0f766e);\n}\n\n.hero {\n  background: radial-gradient(circle at top, #1f2937, #0b0f14 60%);\n}'
        },
        {
            id: 'css-opacity',
            group: 'Effects',
            name: 'opacity',
            syntax: 'opacity: 0.7;',
            desc: 'Makes the whole element, including children, translucent. Use rgba for a transparent colour only.',
            example: '.disabled {\n  opacity: 0.5;\n  pointer-events: none;\n}'
        },
        {
            id: 'css-visibility',
            group: 'Effects',
            name: 'visibility',
            syntax: 'visibility: hidden;',
            desc: 'Hides the element but keeps its space. display: none removes the space too.',
            example: '.tooltip {\n  visibility: hidden;\n}\n\n.card:hover .tooltip {\n  visibility: visible;\n}'
        },
        {
            id: 'css-filter',
            group: 'Effects',
            name: 'filter',
            syntax: 'filter: blur(6px);',
            desc: 'Applies visual effects: blur, brightness, contrast, grayscale, saturate, drop-shadow, and more.',
            example: '.cover {\n  filter: brightness(0.7) saturate(1.1);\n}\n\n.modal-backdrop {\n  backdrop-filter: blur(6px);\n}'
        },
        {
            id: 'css-transform',
            group: 'Effects',
            name: 'transform',
            syntax: 'transform: translateY(-4px) scale(1.02);',
            desc: 'Moves, rotates, scales, or skews an element without changing the layout around it.',
            example: '.card {\n  transition: transform 0.2s ease;\n}\n\n.card:hover {\n  transform: translateY(-4px);\n}'
        },
        {
            id: 'css-transform-origin',
            group: 'Effects',
            name: 'transform-origin',
            syntax: 'transform-origin: center bottom;',
            desc: 'Sets the point around which a transform happens.',
            example: '.menu {\n  transform-origin: top right;\n  transform: scale(0.9);\n}'
        },
        {
            id: 'css-transition',
            group: 'Effects',
            name: 'transition',
            syntax: 'transition: background 0.2s ease, transform 0.2s ease;',
            desc: 'Animates changes to properties over time. Name the property, duration, timing function, and optional delay.',
            example: '.button {\n  transition: background 0.2s ease, transform 0.2s ease;\n}\n\n.button:hover {\n  background: #0f766e;\n  transform: translateY(-2px);\n}'
        },
        {
            id: 'css-animation',
            group: 'Animation',
            name: 'animation and @keyframes',
            syntax: 'animation: fade 0.4s ease both;',
            desc: 'Runs a keyframe animation. The shorthand sets name, duration, timing, delay, iteration, direction, and fill mode.',
            example: '@keyframes fade {\n  from { opacity: 0; transform: translateY(8px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n\n.card {\n  animation: fade 0.4s ease both;\n}'
        },
        {
            id: 'css-cursor',
            group: 'Effects',
            name: 'cursor',
            syntax: 'cursor: pointer;',
            desc: 'Sets the mouse pointer shape. Use pointer on clickable elements.',
            example: 'button,\n.card-link {\n  cursor: pointer;\n}\n\n.disabled {\n  cursor: not-allowed;\n}'
        },
        {
            id: 'css-pointer-events',
            group: 'Effects',
            name: 'pointer-events',
            syntax: 'pointer-events: none;',
            desc: 'Controls whether an element can be the target of mouse events. Useful for overlays and disabled controls.',
            example: '.overlay {\n  pointer-events: none;\n}\n\n.overlay.is-open {\n  pointer-events: auto;\n}'
        },
        {
            id: 'css-user-select',
            group: 'Effects',
            name: 'user-select',
            syntax: 'user-select: none;',
            desc: 'Controls whether text can be selected. Do not disable it on body text.',
            example: '.button {\n  user-select: none;\n}'
        },
        {
            id: 'css-object-fit',
            group: 'Effects',
            name: 'object-fit',
            syntax: 'object-fit: cover;',
            desc: 'Fits an image or video inside its box. cover crops, contain shows the whole image.',
            example: '.card img {\n  width: 100%;\n  height: 180px;\n  object-fit: cover;\n}'
        },
        {
            id: 'css-list-style',
            group: 'Lists and tables',
            name: 'list-style',
            syntax: 'list-style: none;',
            desc: 'Sets the marker type, position, and image for a list. none removes bullets.',
            example: '.menu {\n  list-style: none;\n  padding: 0;\n}\n\n.checks {\n  list-style: "✓  ";\n}'
        },
        {
            id: 'css-border-collapse',
            group: 'Lists and tables',
            name: 'border-collapse',
            syntax: 'border-collapse: collapse;',
            desc: 'Merges table cell borders into one line.',
            example: 'table {\n  border-collapse: collapse;\n  width: 100%;\n}\n\nth, td {\n  border: 1px solid #30363d;\n  padding: 8px;\n}'
        },
        {
            id: 'css-vertical-align',
            group: 'Lists and tables',
            name: 'vertical-align',
            syntax: 'vertical-align: middle;',
            desc: 'Aligns inline or table-cell content vertically.',
            example: 'td {\n  vertical-align: middle;\n}\n\n.icon {\n  vertical-align: middle;\n}'
        },
        {
            id: 'css-media-query',
            group: 'Responsive',
            name: '@media',
            syntax: '@media (max-width: 700px) { ... }',
            desc: 'Applies rules only when the condition matches. Mobile-first uses min-width; desktop-first uses max-width.',
            example: '.cards {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}\n\n@media (max-width: 700px) {\n  .cards {\n    grid-template-columns: 1fr;\n  }\n}'
        },
        {
            id: 'css-variables',
            group: 'Responsive',
            name: 'CSS variables',
            syntax: ':root { --gap: 16px; } .box { gap: var(--gap); }',
            desc: 'Stores reusable values. Change the variable once to update every use.',
            example: ':root {\n  --bg: #0b0f14;\n  --card: #11151c;\n  --text: #e6edf3;\n  --accent: #5eead4;\n  --radius: 16px;\n}\n\n.card {\n  background: var(--card);\n  color: var(--text);\n  border-radius: var(--radius);\n}'
        },
        {
            id: 'css-calc',
            group: 'Responsive',
            name: 'calc()',
            syntax: 'width: calc(100% - 32px);',
            desc: 'Calculates a value by mixing units. Useful for sidebars and full-width layouts.',
            example: '.content {\n  width: calc(100% - 280px);\n}\n\n.modal {\n  max-height: calc(100vh - 80px);\n}'
        },
        {
            id: 'css-clamp',
            group: 'Responsive',
            name: 'clamp()',
            syntax: 'font-size: clamp(1.5rem, 4vw, 3rem);',
            desc: 'Sets a value between a minimum and a maximum, with a preferred fluid value.',
            example: 'h1 {\n  font-size: clamp(2rem, 6vw, 4.5rem);\n  line-height: 1.05;\n}'
        },
        {
            id: 'css-units',
            group: 'Responsive',
            name: 'px, rem, em, %, vw, vh, fr',
            syntax: 'padding: 1rem; width: 50%; height: 100vh;',
            desc: 'px is fixed. rem is relative to root font size. em is relative to the parent. % is relative to the parent. vw/vh are viewport size. fr is a grid fraction.',
            example: '.panel {\n  width: min(1100px, 92vw);\n  padding: 2rem;\n  min-height: 100vh;\n}\n\n.grid {\n  grid-template-columns: 1fr 2fr;\n}'
        },
        {
            id: 'css-important',
            group: 'Responsive',
            name: '!important',
            syntax: 'color: red !important;',
            desc: 'Forces a declaration to win over normal cascade rules. Use it only as a last resort.',
            example: '.is-hidden {\n  display: none !important;\n}'
        }
    ];

    window.WIKI_REFERENCE = (window.WIKI_REFERENCE || []).concat(
        entries.map((entry) => ({ lang, ...entry }))
    );
})();
