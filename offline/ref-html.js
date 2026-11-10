(function () {
    const lang = 'HTML';

    const entries = [
        {
            id: 'html-doctype',
            group: 'Document',
            name: '<!DOCTYPE html>',
            syntax: '<!DOCTYPE html>',
            desc: 'Tells the browser to use standards mode. It must be the first line of the document.',
            example: '<!DOCTYPE html>\n<html lang="en">\n  <head>...</head>\n  <body>...</body>\n</html>'
        },
        {
            id: 'html-html',
            group: 'Document',
            name: '<html>',
            syntax: '<html lang="en"> ... </html>',
            desc: 'The root element. The lang attribute tells screen readers and search engines which language the page uses.',
            example: '<html lang="hu">\n  <head>...</head>\n  <body>...</body>\n</html>'
        },
        {
            id: 'html-head',
            group: 'Document',
            name: '<head>',
            syntax: '<head> ... </head>',
            desc: 'Holds metadata: title, character set, viewport, styles, scripts, and icons. It is not shown in the page body.',
            example: '<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Bookings</title>\n  <link rel="stylesheet" href="style.css">\n</head>'
        },
        {
            id: 'html-title',
            group: 'Document',
            name: '<title>',
            syntax: '<title>Page title</title>',
            desc: 'Sets the browser tab title and the default name when the page is bookmarked.',
            example: '<title>Hotel bookings</title>'
        },
        {
            id: 'html-meta',
            group: 'Document',
            name: '<meta>',
            syntax: '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
            desc: 'Provides metadata. charset sets the encoding, viewport controls mobile scaling, and name/content pairs describe the page.',
            example: '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<meta name="description" content="Hotel booking exam project">'
        },
        {
            id: 'html-link',
            group: 'Document',
            name: '<link>',
            syntax: '<link rel="stylesheet" href="style.css">',
            desc: 'Connects an external resource. The most common use is a stylesheet. It is a void element with no closing tag.',
            example: '<link rel="stylesheet" href="css/style.css">\n<link rel="icon" href="favicon.ico">'
        },
        {
            id: 'html-style',
            group: 'Document',
            name: '<style>',
            syntax: '<style> ... </style>',
            desc: 'Writes CSS directly in the HTML file. Useful for small pages; external stylesheets are easier to reuse.',
            example: '<style>\n  body { font-family: sans-serif; }\n  .card { border: 1px solid #ccc; }\n</style>'
        },
        {
            id: 'html-script',
            group: 'Document',
            name: '<script>',
            syntax: '<script src="app.js"></script>',
            desc: 'Loads JavaScript. Put it at the end of body, or use defer, so the HTML exists before the script runs.',
            example: '<script src="app.js" defer></script>\n<script>\n  console.log("inline script");\n</script>'
        },
        {
            id: 'html-base',
            group: 'Document',
            name: '<base>',
            syntax: '<base href="/" target="_blank">',
            desc: 'Sets a base URL or default target for every relative link on the page. Use it rarely because it affects all links.',
            example: '<base href="https://example.com/docs/">\n<a href="intro.html">Intro</a>'
        },
        {
            id: 'html-body',
            group: 'Structure',
            name: '<body>',
            syntax: '<body> ... </body>',
            desc: 'Contains everything the visitor sees or interacts with: text, images, forms, and scripts that need the page body.',
            example: '<body>\n  <header>...</header>\n  <main>...</main>\n  <footer>...</footer>\n</body>'
        },
        {
            id: 'html-header',
            group: 'Structure',
            name: '<header>',
            syntax: '<header> ... </header>',
            desc: 'A page or section header. It often holds the logo, site title, and main navigation.',
            example: '<header class="site-header">\n  <h1>Hotel bookings</h1>\n  <nav>...</nav>\n</header>'
        },
        {
            id: 'html-nav',
            group: 'Structure',
            name: '<nav>',
            syntax: '<nav> ... </nav>',
            desc: 'Marks a block of navigation links. It helps screen readers find the menu.',
            example: '<nav aria-label="Main menu">\n  <a href="/">Home</a>\n  <a href="/hotels">Hotels</a>\n</nav>'
        },
        {
            id: 'html-main',
            group: 'Structure',
            name: '<main>',
            syntax: '<main> ... </main>',
            desc: 'The main content of the page. There should be only one main element per page, and it must not be inside header, nav, aside, or footer.',
            example: '<main id="content">\n  <h1>Hotels</h1>\n  <p>Choose a hotel.</p>\n</main>'
        },
        {
            id: 'html-section',
            group: 'Structure',
            name: '<section>',
            syntax: '<section> ... </section>',
            desc: 'A thematic group of content, usually with its own heading. Do not use it just to wrap a div.',
            example: '<section aria-labelledby="offers">\n  <h2 id="offers">Offers</h2>\n  <p>Summer discounts.</p>\n</section>'
        },
        {
            id: 'html-article',
            group: 'Structure',
            name: '<article>',
            syntax: '<article> ... </article>',
            desc: 'A self-contained piece of content that could be published on its own, such as a blog post, card, or comment.',
            example: '<article class="hotel-card">\n  <h2>Danube View</h2>\n  <p>Four stars in Budapest.</p>\n</article>'
        },
        {
            id: 'html-aside',
            group: 'Structure',
            name: '<aside>',
            syntax: '<aside> ... </aside>',
            desc: 'Content that is related but not central: a sidebar, note, advertisement, or related links.',
            example: '<aside class="tips">\n  <h2>Tip</h2>\n  <p>Book early for the summer.</p>\n</aside>'
        },
        {
            id: 'html-footer',
            group: 'Structure',
            name: '<footer>',
            syntax: '<footer> ... </footer>',
            desc: 'The footer of a page or section. It often contains copyright, contact details, and small links.',
            example: '<footer>\n  <p>&copy; 2026 Hotel bookings</p>\n</footer>'
        },
        {
            id: 'html-div',
            group: 'Structure',
            name: '<div>',
            syntax: '<div class="card"> ... </div>',
            desc: 'A generic block container with no semantic meaning. Use it for layout when no semantic element fits.',
            example: '<div class="card-grid">\n  <div class="card">...</div>\n  <div class="card">...</div>\n</div>'
        },
        {
            id: 'html-span',
            group: 'Structure',
            name: '<span>',
            syntax: '<span class="price">99 EUR</span>',
            desc: 'A generic inline container. Use it to style or target a small piece of text.',
            example: '<p>Price: <span class="price">99 EUR</span> per night</p>'
        },
        {
            id: 'html-headings',
            group: 'Text',
            name: '<h1> to <h6>',
            syntax: '<h1>Main title</h1>\n<h2>Section</h2>',
            desc: 'Headings create the document outline. Use one h1 per page and do not skip levels just for smaller text.',
            example: '<h1>Hotel bookings</h1>\n<h2>Rooms</h2>\n<h3>Double room</h3>'
        },
        {
            id: 'html-p',
            group: 'Text',
            name: '<p>',
            syntax: '<p>Text</p>',
            desc: 'A paragraph. Browsers add space before and after it. Do not use br to create paragraph spacing.',
            example: '<p>The hotel is near the river.</p>\n<p>Breakfast is included.</p>'
        },
        {
            id: 'html-br',
            group: 'Text',
            name: '<br>',
            syntax: 'Line one<br>Line two',
            desc: 'A line break inside text, such as an address or a poem. It is not for spacing between paragraphs.',
            example: '<p>Danube View<br>12 River Street<br>Budapest</p>'
        },
        {
            id: 'html-hr',
            group: 'Text',
            name: '<hr>',
            syntax: '<hr>',
            desc: 'A thematic break between sections. It is a void element.',
            example: '<p>End of the first topic.</p>\n<hr>\n<p>Start of the next topic.</p>'
        },
        {
            id: 'html-strong',
            group: 'Text',
            name: '<strong>',
            syntax: '<strong>Important</strong>',
            desc: 'Marks text as strongly important. Browsers usually show it in bold. Prefer it over b for meaning.',
            example: '<p><strong>Warning:</strong> the pool closes at 20:00.</p>'
        },
        {
            id: 'html-b',
            group: 'Text',
            name: '<b>',
            syntax: '<b>Bold text</b>',
            desc: 'Bold text without extra importance. Use strong when the meaning is importance.',
            example: '<p>The <b>Deluxe</b> room is on the top floor.</p>'
        },
        {
            id: 'html-em',
            group: 'Text',
            name: '<em>',
            syntax: '<em>Emphasised</em>',
            desc: 'Marks emphasis, usually shown in italics. Screen readers may change the tone.',
            example: '<p>Please <em>do not</em> smoke in the room.</p>'
        },
        {
            id: 'html-i',
            group: 'Text',
            name: '<i>',
            syntax: '<i>Italic text</i>',
            desc: 'Italic text for a term, a foreign phrase, or a thought, without extra emphasis.',
            example: '<p>The Latin term <i>per night</i> means for each night.</p>'
        },
        {
            id: 'html-mark',
            group: 'Text',
            name: '<mark>',
            syntax: '<mark>Highlighted</mark>',
            desc: 'Marks text for reference or highlighting, like a marker pen.',
            example: '<p>Search result: <mark>Budapest</mark> hotels</p>'
        },
        {
            id: 'html-small',
            group: 'Text',
            name: '<small>',
            syntax: '<small>Small print</small>',
            desc: 'Smaller text for side comments, legal notes, or copyright.',
            example: '<p><small>Prices include VAT.</small></p>'
        },
        {
            id: 'html-del',
            group: 'Text',
            name: '<del>',
            syntax: '<del>Old price</del>',
            desc: 'Text that was removed. Browsers usually show a line through it.',
            example: '<p><del>120 EUR</del> 99 EUR</p>'
        },
        {
            id: 'html-ins',
            group: 'Text',
            name: '<ins>',
            syntax: '<ins>New text</ins>',
            desc: 'Text that was inserted. Browsers usually underline it.',
            example: '<p>The pool is <ins>open until 21:00</ins>.</p>'
        },
        {
            id: 'html-sub',
            group: 'Text',
            name: '<sub>',
            syntax: 'H<sub>2</sub>O',
            desc: 'Subscript text, lower than the baseline. Useful for chemical formulas and footnotes.',
            example: '<p>Water is H<sub>2</sub>O.</p>'
        },
        {
            id: 'html-sup',
            group: 'Text',
            name: '<sup>',
            syntax: 'x<sup>2</sup>',
            desc: 'Superscript text, higher than the baseline. Useful for powers and footnote marks.',
            example: '<p>Area = a<sup>2</sup>.</p>'
        },
        {
            id: 'html-code',
            group: 'Text',
            name: '<code>',
            syntax: '<code>const x = 1;</code>',
            desc: 'Marks a short piece of computer code inside text.',
            example: '<p>Use <code>querySelector</code> to find an element.</p>'
        },
        {
            id: 'html-pre',
            group: 'Text',
            name: '<pre>',
            syntax: '<pre> ... </pre>',
            desc: 'Preserves spaces and line breaks. Use it for code blocks and ASCII art.',
            example: '<pre>\nfunction greet() {\n  console.log("Hello");\n}\n</pre>'
        },
        {
            id: 'html-kbd',
            group: 'Text',
            name: '<kbd>',
            syntax: '<kbd>Ctrl</kbd> + <kbd>S</kbd>',
            desc: 'Marks keyboard input.',
            example: '<p>Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save.</p>'
        },
        {
            id: 'html-samp',
            group: 'Text',
            name: '<samp>',
            syntax: '<samp>Error: not found</samp>',
            desc: 'Marks sample output from a program.',
            example: '<p><samp>Build finished.</samp></p>'
        },
        {
            id: 'html-var',
            group: 'Text',
            name: '<var>',
            syntax: '<var>x</var>',
            desc: 'Marks a variable in a mathematical or programming expression.',
            example: '<p>The formula is <var>a</var> + <var>b</var>.</p>'
        },
        {
            id: 'html-blockquote',
            group: 'Text',
            name: '<blockquote>',
            syntax: '<blockquote cite="url">Quote</blockquote>',
            desc: 'A long quotation from another source. The cite attribute holds the source URL.',
            example: '<blockquote cite="https://example.com/review">\n  A quiet hotel near the river.\n</blockquote>'
        },
        {
            id: 'html-q',
            group: 'Text',
            name: '<q>',
            syntax: '<q>Short quote</q>',
            desc: 'A short inline quotation. Browsers add quotation marks.',
            example: '<p>She said <q>the room was clean</q>.</p>'
        },
        {
            id: 'html-cite',
            group: 'Text',
            name: '<cite>',
            syntax: '<cite>Book title</cite>',
            desc: 'Marks the title of a work: a book, film, song, or article.',
            example: '<p><cite>Clean Code</cite> is on the shelf.</p>'
        },
        {
            id: 'html-abbr',
            group: 'Text',
            name: '<abbr>',
            syntax: '<abbr title="HyperText Markup Language">HTML</abbr>',
            desc: 'Marks an abbreviation. The title attribute shows the full form on hover.',
            example: '<p><abbr title="Application Programming Interface">API</abbr></p>'
        },
        {
            id: 'html-address',
            group: 'Text',
            name: '<address>',
            syntax: '<address>Name<br>Street<br>City</address>',
            desc: 'Contact information for the author or owner of the page or article.',
            example: '<address>\n  Hotel Danube<br>\n  12 River Street, Budapest\n</address>'
        },
        {
            id: 'html-time',
            group: 'Text',
            name: '<time>',
            syntax: '<time datetime="2026-11-10">10 November 2026</time>',
            desc: 'Marks a date or time. The datetime attribute gives a machine-readable value.',
            example: '<p>Check-in: <time datetime="2026-07-01">1 July 2026</time></p>'
        },
        {
            id: 'html-a',
            group: 'Links and media',
            name: '<a>',
            syntax: '<a href="page.html">Text</a>',
            desc: 'Creates a link. href can point to a page, a file, an email address, a phone number, or an id on the same page.',
            example: '<a href="/hotels">Hotels</a>\n<a href="#top">Back to top</a>\n<a href="mailto:info@example.com">Email</a>'
        },
        {
            id: 'html-img',
            group: 'Links and media',
            name: '<img>',
            syntax: '<img src="photo.jpg" alt="Description">',
            desc: 'Shows an image. alt is required for accessibility and is shown when the image cannot load.',
            example: '<img src="hotel.jpg" alt="Danube View hotel from the river" width="640" height="360">'
        },
        {
            id: 'html-picture',
            group: 'Links and media',
            name: '<picture>',
            syntax: '<picture><source ...><img ...></picture>',
            desc: 'Lets the browser choose an image source based on screen size or format. The img is the fallback.',
            example: '<picture>\n  <source media="(min-width: 800px)" srcset="wide.jpg">\n  <img src="small.jpg" alt="Hotel">\n</picture>'
        },
        {
            id: 'html-source',
            group: 'Links and media',
            name: '<source>',
            syntax: '<source src="movie.mp4" type="video/mp4">',
            desc: 'Provides a media source for picture, video, or audio. The browser picks the first format it supports.',
            example: '<video controls>\n  <source src="tour.mp4" type="video/mp4">\n  <source src="tour.webm" type="video/webm">\n</video>'
        },
        {
            id: 'html-video',
            group: 'Links and media',
            name: '<video>',
            syntax: '<video controls src="movie.mp4"></video>',
            desc: 'Embeds a video. controls shows play, pause, and volume. Add fallback text for old browsers.',
            example: '<video controls width="640" poster="cover.jpg">\n  <source src="tour.mp4" type="video/mp4">\n  Your browser does not support video.\n</video>'
        },
        {
            id: 'html-audio',
            group: 'Links and media',
            name: '<audio>',
            syntax: '<audio controls src="sound.mp3"></audio>',
            desc: 'Embeds audio. controls shows the player. Browsers do not autoplay sound by default.',
            example: '<audio controls>\n  <source src="intro.mp3" type="audio/mpeg">\n</audio>'
        },
        {
            id: 'html-track',
            group: 'Links and media',
            name: '<track>',
            syntax: '<track src="subs.vtt" kind="subtitles" srclang="en" label="English">',
            desc: 'Adds subtitles, captions, or descriptions to video or audio.',
            example: '<video controls>\n  <source src="tour.mp4" type="video/mp4">\n  <track src="tour-en.vtt" kind="subtitles" srclang="en" label="English">\n</video>'
        },
        {
            id: 'html-iframe',
            group: 'Links and media',
            name: '<iframe>',
            syntax: '<iframe src="page.html" title="Description"></iframe>',
            desc: 'Embeds another page inside the current page. Always give it a title for screen readers.',
            example: '<iframe src="https://example.com/map" title="Hotel location map" width="600" height="400"></iframe>'
        },
        {
            id: 'html-canvas',
            group: 'Links and media',
            name: '<canvas>',
            syntax: '<canvas id="draw" width="400" height="200"></canvas>',
            desc: 'A drawing surface for JavaScript. You draw with the 2D or WebGL context.',
            example: '<canvas id="draw" width="400" height="200"></canvas>\n<script>\n  const ctx = document.getElementById("draw").getContext("2d");\n  ctx.fillRect(10, 10, 80, 40);\n</script>'
        },
        {
            id: 'html-svg',
            group: 'Links and media',
            name: '<svg>',
            syntax: '<svg width="40" height="40">...</svg>',
            desc: 'Draws vector graphics with XML elements. It scales without losing quality.',
            example: '<svg width="40" height="40" viewBox="0 0 40 40">\n  <circle cx="20" cy="20" r="16" fill="teal" />\n</svg>'
        },
        {
            id: 'html-map-area',
            group: 'Links and media',
            name: '<map> and <area>',
            syntax: '<map name="m"><area shape="rect" coords="0,0,50,50" href="a.html"></map>',
            desc: 'Defines clickable areas on an image. The img usemap attribute points to the map name.',
            example: '<img src="plan.png" usemap="#rooms" alt="Hotel plan">\n<map name="rooms">\n  <area shape="rect" coords="10,10,80,60" href="room-a.html" alt="Room A">\n</map>'
        },
        {
            id: 'html-object',
            group: 'Links and media',
            name: '<object>',
            syntax: '<object data="file.pdf" type="application/pdf"></object>',
            desc: 'Embeds an external resource such as a PDF. Fallback content goes inside the element.',
            example: '<object data="menu.pdf" type="application/pdf" width="600" height="400">\n  <a href="menu.pdf">Download the menu</a>\n</object>'
        },
        {
            id: 'html-embed',
            group: 'Links and media',
            name: '<embed>',
            syntax: '<embed src="file.pdf" type="application/pdf">',
            desc: 'Embeds external content. It is older and less flexible than object; prefer object or iframe.',
            example: '<embed src="menu.pdf" type="application/pdf" width="600" height="400">'
        },
        {
            id: 'html-ul',
            group: 'Lists',
            name: '<ul>',
            syntax: '<ul><li>Item</li></ul>',
            desc: 'An unordered list. Browsers show bullets. Use it when the order does not matter.',
            example: '<ul>\n  <li>Breakfast</li>\n  <li>Free Wi-Fi</li>\n  <li>Parking</li>\n</ul>'
        },
        {
            id: 'html-ol',
            group: 'Lists',
            name: '<ol>',
            syntax: '<ol><li>First</li></ol>',
            desc: 'An ordered list. Browsers show numbers. Use it for steps or rankings.',
            example: '<ol>\n  <li>Choose a hotel.</li>\n  <li>Pick dates.</li>\n  <li>Confirm.</li>\n</ol>'
        },
        {
            id: 'html-li',
            group: 'Lists',
            name: '<li>',
            syntax: '<li>Item</li>',
            desc: 'A list item inside ul, ol, or menu.',
            example: '<ul>\n  <li>Double room</li>\n  <li>Twin room</li>\n</ul>'
        },
        {
            id: 'html-dl',
            group: 'Lists',
            name: '<dl>, <dt>, <dd>',
            syntax: '<dl><dt>Term</dt><dd>Definition</dd></dl>',
            desc: 'A description list: dt is the term, dd is the description. Useful for key/value pairs.',
            example: '<dl>\n  <dt>Check-in</dt><dd>14:00</dd>\n  <dt>Check-out</dt><dd>10:00</dd>\n</dl>'
        },
        {
            id: 'html-table',
            group: 'Tables',
            name: '<table>',
            syntax: '<table>...</table>',
            desc: 'A data table. Use tables for tabular data, not for page layout.',
            example: '<table>\n  <tr><th>Guest</th><th>Nights</th></tr>\n  <tr><td>Anna</td><td>3</td></tr>\n</table>'
        },
        {
            id: 'html-caption',
            group: 'Tables',
            name: '<caption>',
            syntax: '<caption>Table title</caption>',
            desc: 'A title for the table. It must be the first child of table.',
            example: '<table>\n  <caption>Bookings in 2026</caption>\n  ...\n</table>'
        },
        {
            id: 'html-thead-tbody-tfoot',
            group: 'Tables',
            name: '<thead>, <tbody>, <tfoot>',
            syntax: '<thead>...</thead><tbody>...</tbody><tfoot>...</tfoot>',
            desc: 'Groups table rows into header, body, and footer. It helps styling and screen readers.',
            example: '<table>\n  <thead><tr><th>Guest</th><th>Nights</th></tr></thead>\n  <tbody><tr><td>Anna</td><td>3</td></tr></tbody>\n  <tfoot><tr><td>Total</td><td>3</td></tr></tfoot>\n</table>'
        },
        {
            id: 'html-tr',
            group: 'Tables',
            name: '<tr>',
            syntax: '<tr><td>Cell</td></tr>',
            desc: 'A table row. It contains th or td cells.',
            example: '<tr>\n  <td>Anna</td>\n  <td>3</td>\n</tr>'
        },
        {
            id: 'html-th',
            group: 'Tables',
            name: '<th>',
            syntax: '<th scope="col">Name</th>',
            desc: 'A header cell. scope tells screen readers whether it applies to a column or a row.',
            example: '<tr>\n  <th scope="col">Guest</th>\n  <th scope="col">Nights</th>\n</tr>'
        },
        {
            id: 'html-td',
            group: 'Tables',
            name: '<td>',
            syntax: '<td>Value</td>',
            desc: 'A data cell. Use colspan or rowspan to merge cells, but keep the table simple.',
            example: '<tr>\n  <td>Anna</td>\n  <td>3</td>\n</tr>'
        },
        {
            id: 'html-colgroup-col',
            group: 'Tables',
            name: '<colgroup> and <col>',
            syntax: '<colgroup><col span="2"></colgroup>',
            desc: 'Defines groups of columns for styling. It goes after caption and before thead.',
            example: '<table>\n  <colgroup>\n    <col style="background:#1f6feb33">\n    <col span="2">\n  </colgroup>\n  ...\n</table>'
        },
        {
            id: 'html-form',
            group: 'Forms',
            name: '<form>',
            syntax: '<form action="/submit" method="post">...</form>',
            desc: 'Collects and sends user input. action is the URL, method is get or post.',
            example: '<form action="/api/customer" method="post">\n  <label>Email <input type="email" name="email" required></label>\n  <button type="submit">Save</button>\n</form>'
        },
        {
            id: 'html-input',
            group: 'Forms',
            name: '<input>',
            syntax: '<input type="text" name="first_name">',
            desc: 'A form control. type changes the control: text, email, password, number, date, checkbox, radio, file, submit, and more.',
            example: '<input type="text" name="first_name" placeholder="Anna" required>\n<input type="email" name="email">\n<input type="date" name="start_date">\n<input type="number" name="adults" min="1" value="2">'
        },
        {
            id: 'html-label',
            group: 'Forms',
            name: '<label>',
            syntax: '<label for="email">Email</label>',
            desc: 'A caption for a form control. The for value must match the input id. Clicking the label focuses the control.',
            example: '<label for="email">Email</label>\n<input id="email" type="email" name="email">'
        },
        {
            id: 'html-select',
            group: 'Forms',
            name: '<select>',
            syntax: '<select name="city"><option>Budapest</option></select>',
            desc: 'A drop-down list. Each choice is an option. Use size or multiple for a list box.',
            example: '<label for="city">City</label>\n<select id="city" name="city">\n  <option value="budapest">Budapest</option>\n  <option value="debrecen">Debrecen</option>\n</select>'
        },
        {
            id: 'html-option',
            group: 'Forms',
            name: '<option>',
            syntax: '<option value="x">Label</option>',
            desc: 'One choice inside select or datalist. value is what the form sends; the text is what the user sees.',
            example: '<select name="stars">\n  <option value="3">3 stars</option>\n  <option value="4" selected>4 stars</option>\n</select>'
        },
        {
            id: 'html-optgroup',
            group: 'Forms',
            name: '<optgroup>',
            syntax: '<optgroup label="Group"><option>...</option></optgroup>',
            desc: 'Groups options inside a select. The label is shown as a non-selectable heading.',
            example: '<select name="city">\n  <optgroup label="Hungary">\n    <option>Budapest</option>\n    <option>Debrecen</option>\n  </optgroup>\n</select>'
        },
        {
            id: 'html-textarea',
            group: 'Forms',
            name: '<textarea>',
            syntax: '<textarea name="note" rows="4"></textarea>',
            desc: 'A multi-line text field. The text between the tags is the initial value.',
            example: '<label for="note">Note</label>\n<textarea id="note" name="note" rows="4" placeholder="Arrival time"></textarea>'
        },
        {
            id: 'html-button',
            group: 'Forms',
            name: '<button>',
            syntax: '<button type="submit">Send</button>',
            desc: 'A clickable button. type submit sends the form, type button does nothing by default, type reset clears the form.',
            example: '<button type="submit">Save booking</button>\n<button type="button" onclick="cancel()">Cancel</button>'
        },
        {
            id: 'html-fieldset-legend',
            group: 'Forms',
            name: '<fieldset> and <legend>',
            syntax: '<fieldset><legend>Title</legend>...</fieldset>',
            desc: 'Groups related form controls. The legend names the group.',
            example: '<fieldset>\n  <legend>Guest details</legend>\n  <label>Name <input name="name"></label>\n</fieldset>'
        },
        {
            id: 'html-datalist',
            group: 'Forms',
            name: '<datalist>',
            syntax: '<input list="cities"><datalist id="cities"><option value="Budapest"></datalist>',
            desc: 'Provides suggested values for an input. The user can still type a value that is not in the list.',
            example: '<label for="city">City</label>\n<input id="city" name="city" list="cities">\n<datalist id="cities">\n  <option value="Budapest">\n  <option value="Debrecen">\n</datalist>'
        },
        {
            id: 'html-output',
            group: 'Forms',
            name: '<output>',
            syntax: '<output name="result">0</output>',
            desc: 'Shows the result of a calculation or user action. It is often updated by JavaScript.',
            example: '<input id="a" type="number" value="2">\n<output id="result" for="a">2</output>'
        },
        {
            id: 'html-progress',
            group: 'Forms',
            name: '<progress>',
            syntax: '<progress value="30" max="100">30%</progress>',
            desc: 'Shows progress of a task. Without value it shows an indeterminate bar.',
            example: '<progress value="70" max="100">70%</progress>'
        },
        {
            id: 'html-meter',
            group: 'Forms',
            name: '<meter>',
            syntax: '<meter value="0.7">70%</meter>',
            desc: 'Shows a measurement within a known range, such as disk usage or a score.',
            example: '<meter value="8" min="0" max="10">8 out of 10</meter>'
        },
        {
            id: 'html-figure-figcaption',
            group: 'Interactive',
            name: '<figure> and <figcaption>',
            syntax: '<figure><img ...><figcaption>Caption</figcaption></figure>',
            desc: 'A self-contained figure with an optional caption. The caption can be above or below the content.',
            example: '<figure>\n  <img src="hotel.jpg" alt="Danube View">\n  <figcaption>Danube View, Budapest</figcaption>\n</figure>'
        },
        {
            id: 'html-details-summary',
            group: 'Interactive',
            name: '<details> and <summary>',
            syntax: '<details><summary>More</summary>Hidden text</details>',
            desc: 'A native expandable section. The summary is always visible; the rest opens on click.',
            example: '<details>\n  <summary>Cancel policy</summary>\n  <p>Free cancellation up to 48 hours before arrival.</p>\n</details>'
        },
        {
            id: 'html-dialog',
            group: 'Interactive',
            name: '<dialog>',
            syntax: '<dialog id="box">...</dialog>',
            desc: 'A native popup or modal dialog. Use showModal() and close() from JavaScript.',
            example: '<dialog id="owner">\n  <h2>Owner</h2>\n  <button onclick="owner.close()">Close</button>\n</dialog>\n<script>owner.showModal();</script>'
        },
        {
            id: 'html-template',
            group: 'Interactive',
            name: '<template>',
            syntax: '<template><p>Reusable</p></template>',
            desc: 'Holds HTML that is not rendered until JavaScript clones it. Useful for repeated cards or rows.',
            example: '<template id="card">\n  <article class="card"><h2></h2></article>\n</template>\n<script>\n  const copy = card.content.cloneNode(true);\n</script>'
        },
        {
            id: 'html-noscript',
            group: 'Interactive',
            name: '<noscript>',
            syntax: '<noscript>JavaScript is disabled.</noscript>',
            desc: 'Content shown only when JavaScript is disabled or unsupported.',
            example: '<noscript>\n  <p>This page needs JavaScript. Please enable it.</p>\n</noscript>'
        }
    ];

    window.WIKI_REFERENCE = (window.WIKI_REFERENCE || []).concat(
        entries.map((entry) => ({ lang, ...entry }))
    );
})();
