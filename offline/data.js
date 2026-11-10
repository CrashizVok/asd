window.WIKI_ARTICLES = [
  {
    "id": "html-document-skeleton",
    "lang": "HTML",
    "title": "Document skeleton",
    "html": "<pre><code class=\"language-html\">&lt;!DOCTYPE html&gt;\n&lt;html lang=&quot;en&quot;&gt;\n&lt;head&gt;\n  &lt;meta charset=&quot;UTF-8&quot;&gt;\n  &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1&quot;&gt;\n  &lt;title&gt;Hotel bookings&lt;/title&gt;\n  &lt;meta name=&quot;description&quot; content=&quot;Search and book hotel rooms.&quot;&gt;\n  &lt;link rel=&quot;stylesheet&quot; href=&quot;css/components.css&quot;&gt;\n&lt;/head&gt;\n&lt;body&gt;\n  &lt;h1&gt;Hello&lt;/h1&gt;\n  &lt;script src=&quot;js/app.js&quot; defer&gt;&lt;/script&gt;\n&lt;/body&gt;\n&lt;/html&gt;\n</code></pre>\n<p><code>&lt;!DOCTYPE html&gt;</code> switches the browser to standards mode. <code>lang</code> helps screen readers pick a voice. <code>charset</code> must come first in <code>head</code>.</p>\n",
    "plain": "HTML Document skeleton <!DOCTYPE html> <html lang=\"en\"> <head> <meta charset=\"UTF-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> <title>Hotel bookings</title> <meta name=\"description\" content=\"Search and book hotel rooms.\"> <link rel=\"stylesheet\" href=\"css/components.css\"> </head> <body> <h1>Hello</h1> <script src=\"js/app.js\" defer></script> </body> </html> <!DOCTYPE html> switches the browser to standards mode. lang helps screen readers pick a voice. charset must come first in head ."
  },
  {
    "id": "html-semantic-tags",
    "lang": "HTML",
    "title": "Semantic tags",
    "html": "<p>Use the tag that describes the content, then style it.</p>\n<pre><code class=\"language-html\">&lt;header&gt;  site header, logo, nav      &lt;/header&gt;\n&lt;nav&gt;     main navigation links       &lt;/nav&gt;\n&lt;main&gt;    the one main content block  &lt;/main&gt;\n&lt;section&gt; a themed group of content   &lt;/section&gt;\n&lt;article&gt; self-contained item         &lt;/article&gt;\n&lt;aside&gt;   side notes, related links   &lt;/aside&gt;\n&lt;footer&gt;  copyright, contact          &lt;/footer&gt;\n&lt;figure&gt;  image with a caption        &lt;/figure&gt;\n&lt;figcaption&gt; the caption itself       &lt;/figcaption&gt;\n&lt;time datetime=&quot;2026-11-10&quot;&gt;10 Nov&lt;/time&gt;\n</code></pre>\n<p>Rules of thumb: one <code>&lt;h1&gt;</code> per page, one <code>&lt;main&gt;</code> per page, headings in order. A <code>&lt;div&gt;</code> is fine when nothing else fits; it carries no meaning.</p>\n",
    "plain": "HTML Semantic tags Use the tag that describes the content, then style it. <header> site header, logo, nav </header> <nav> main navigation links </nav> <main> the one main content block </main> <section> a themed group of content </section> <article> self-contained item </article> <aside> side notes, related links </aside> <footer> copyright, contact </footer> <figure> image with a caption </figure> <figcaption> the caption itself </figcaption> <time datetime=\"2026-11-10\">10 Nov</time> Rules of thumb: one <h1> per page, one <main> per page, headings in order. A <div> is fine when nothing else fits; it carries no meaning."
  },
  {
    "id": "html-links",
    "lang": "HTML",
    "title": "Links",
    "html": "<pre><code class=\"language-html\">&lt;a href=&quot;https://example.com&quot;&gt;External&lt;/a&gt;\n&lt;a href=&quot;about.html&quot;&gt;Same folder&lt;/a&gt;\n&lt;a href=&quot;../index.html&quot;&gt;One folder up&lt;/a&gt;\n&lt;a href=&quot;#rooms&quot;&gt;Jump to section&lt;/a&gt;\n&lt;a href=&quot;mailto:book@example.com&quot;&gt;Email us&lt;/a&gt;\n&lt;a href=&quot;tel:+3612345678&quot;&gt;Call us&lt;/a&gt;\n&lt;a href=&quot;file.pdf&quot; download&gt;Download&lt;/a&gt;\n&lt;a href=&quot;https://example.com&quot; target=&quot;_blank&quot; rel=&quot;noopener&quot;&gt;New tab&lt;/a&gt;\n</code></pre>\n<p>Link text should say where it goes. &quot;Click here&quot; tells the reader nothing, and screen readers list links out of context. <code>rel=&quot;noopener&quot;</code> is required with <code>target=&quot;_blank&quot;</code> for safety.</p>\n",
    "plain": "HTML Links <a href=\"https://example.com\">External</a> <a href=\"about.html\">Same folder</a> <a href=\"../index.html\">One folder up</a> <a href=\"#rooms\">Jump to section</a> <a href=\"mailto:book@example.com\">Email us</a> <a href=\"tel:+3612345678\">Call us</a> <a href=\"file.pdf\" download>Download</a> <a href=\"https://example.com\" target=\"_blank\" rel=\"noopener\">New tab</a> Link text should say where it goes. \"Click here\" tells the reader nothing, and screen readers list links out of context. rel=\"noopener\" is required with target=\"_blank\" for safety."
  },
  {
    "id": "html-images",
    "lang": "HTML",
    "title": "Images",
    "html": "<pre><code class=\"language-html\">&lt;img src=&quot;img/room.jpg&quot; alt=&quot;Double room with sea view&quot; width=&quot;640&quot; height=&quot;420&quot;&gt;\n&lt;img src=&quot;img/icon.svg&quot; alt=&quot;&quot; aria-hidden=&quot;true&quot;&gt;\n&lt;figure&gt;\n  &lt;img src=&quot;img/lobby.jpg&quot; alt=&quot;Hotel lobby at night&quot;&gt;\n  &lt;figcaption&gt;The lobby, open all night.&lt;/figcaption&gt;\n&lt;/figure&gt;\n</code></pre>\n<p><code>alt</code> describes the image for someone who cannot see it. Decorative images get <code>alt=&quot;&quot;</code> so they are skipped. Set <code>width</code> and <code>height</code> to reserve space and avoid layout shift. Use <code>&lt;picture&gt;</code> or <code>srcset</code> for different sizes.</p>\n",
    "plain": "HTML Images <img src=\"img/room.jpg\" alt=\"Double room with sea view\" width=\"640\" height=\"420\"> <img src=\"img/icon.svg\" alt=\"\" aria-hidden=\"true\"> <figure> <img src=\"img/lobby.jpg\" alt=\"Hotel lobby at night\"> <figcaption>The lobby, open all night.</figcaption> </figure> alt describes the image for someone who cannot see it. Decorative images get alt=\"\" so they are skipped. Set width and height to reserve space and avoid layout shift. Use <picture> or srcset for different sizes."
  },
  {
    "id": "html-lists",
    "lang": "HTML",
    "title": "Lists",
    "html": "<pre><code class=\"language-html\">&lt;ul&gt;\n  &lt;li&gt;Free cancel&lt;/li&gt;\n  &lt;li&gt;Breakfast included&lt;/li&gt;\n&lt;/ul&gt;\n\n&lt;ol&gt;\n  &lt;li&gt;Pick a date&lt;/li&gt;\n  &lt;li&gt;Choose a room&lt;/li&gt;\n&lt;/ol&gt;\n\n&lt;dl&gt;\n  &lt;dt&gt;Check-in&lt;/dt&gt;\n  &lt;dd&gt;From 14:00&lt;/dd&gt;\n&lt;/dl&gt;\n</code></pre>\n<p><code>ul</code> for unordered items, <code>ol</code> when order matters, <code>dl</code> for term and description pairs. Only <code>li</code> may sit directly inside <code>ul</code> or <code>ol</code>.</p>\n",
    "plain": "HTML Lists <ul> <li>Free cancel</li> <li>Breakfast included</li> </ul> <ol> <li>Pick a date</li> <li>Choose a room</li> </ol> <dl> <dt>Check-in</dt> <dd>From 14:00</dd> </dl> ul for unordered items, ol when order matters, dl for term and description pairs. Only li may sit directly inside ul or ol ."
  },
  {
    "id": "html-tables",
    "lang": "HTML",
    "title": "Tables",
    "html": "<pre><code class=\"language-html\">&lt;table&gt;\n  &lt;caption&gt;Room prices&lt;/caption&gt;\n  &lt;thead&gt;\n    &lt;tr&gt;\n      &lt;th scope=&quot;col&quot;&gt;Room&lt;/th&gt;\n      &lt;th scope=&quot;col&quot;&gt;Price&lt;/th&gt;\n    &lt;/tr&gt;\n  &lt;/thead&gt;\n  &lt;tbody&gt;\n    &lt;tr&gt;\n      &lt;th scope=&quot;row&quot;&gt;Double&lt;/th&gt;\n      &lt;td&gt;80 EUR&lt;/td&gt;\n    &lt;/tr&gt;\n  &lt;/tbody&gt;\n&lt;/table&gt;\n</code></pre>\n<p><code>caption</code> names the table. <code>th</code> is a header cell, <code>td</code> a data cell. <code>scope</code> tells assistive tech which cells the header covers. Wrap wide tables in a div with <code>overflow-x: auto</code>.</p>\n",
    "plain": "HTML Tables <table> <caption>Room prices</caption> <thead> <tr> <th scope=\"col\">Room</th> <th scope=\"col\">Price</th> </tr> </thead> <tbody> <tr> <th scope=\"row\">Double</th> <td>80 EUR</td> </tr> </tbody> </table> caption names the table. th is a header cell, td a data cell. scope tells assistive tech which cells the header covers. Wrap wide tables in a div with overflow-x: auto ."
  },
  {
    "id": "html-forms",
    "lang": "HTML",
    "title": "Forms",
    "html": "<pre><code class=\"language-html\">&lt;form action=&quot;/book&quot; method=&quot;post&quot;&gt;\n  &lt;label for=&quot;name&quot;&gt;Full name&lt;/label&gt;\n  &lt;input id=&quot;name&quot; name=&quot;name&quot; type=&quot;text&quot; required minlength=&quot;2&quot;&gt;\n\n  &lt;label for=&quot;email&quot;&gt;Email&lt;/label&gt;\n  &lt;input id=&quot;email&quot; name=&quot;email&quot; type=&quot;email&quot; required&gt;\n\n  &lt;label for=&quot;guests&quot;&gt;Guests&lt;/label&gt;\n  &lt;input id=&quot;guests&quot; name=&quot;guests&quot; type=&quot;number&quot; min=&quot;1&quot; max=&quot;6&quot; value=&quot;2&quot;&gt;\n\n  &lt;label for=&quot;arrive&quot;&gt;Arrival&lt;/label&gt;\n  &lt;input id=&quot;arrive&quot; name=&quot;arrive&quot; type=&quot;date&quot;&gt;\n\n  &lt;label for=&quot;room&quot;&gt;Room type&lt;/label&gt;\n  &lt;select id=&quot;room&quot; name=&quot;room&quot;&gt;\n    &lt;option value=&quot;single&quot;&gt;Single&lt;/option&gt;\n    &lt;option value=&quot;double&quot; selected&gt;Double&lt;/option&gt;\n  &lt;/select&gt;\n\n  &lt;fieldset&gt;\n    &lt;legend&gt;Extras&lt;/legend&gt;\n    &lt;label&gt;&lt;input type=&quot;checkbox&quot; name=&quot;breakfast&quot;&gt; Breakfast&lt;/label&gt;\n    &lt;label&gt;&lt;input type=&quot;radio&quot; name=&quot;bed&quot; value=&quot;king&quot;&gt; King bed&lt;/label&gt;\n    &lt;label&gt;&lt;input type=&quot;radio&quot; name=&quot;bed&quot; value=&quot;twin&quot;&gt; Twin beds&lt;/label&gt;\n  &lt;/fieldset&gt;\n\n  &lt;label for=&quot;notes&quot;&gt;Notes&lt;/label&gt;\n  &lt;textarea id=&quot;notes&quot; name=&quot;notes&quot; rows=&quot;4&quot;&gt;&lt;/textarea&gt;\n\n  &lt;button type=&quot;submit&quot;&gt;Book now&lt;/button&gt;\n&lt;/form&gt;\n</code></pre>\n<p>Key input types: <code>text</code>, <code>email</code>, <code>password</code>, <code>number</code>, <code>tel</code>, <code>url</code>, <code>date</code>, <code>time</code>, <code>search</code>, <code>file</code>, <code>hidden</code>, <code>checkbox</code>, <code>radio</code>, <code>range</code>, <code>color</code>.</p>\n<p>The <code>name</code> attribute is what the server receives. No <code>name</code>, no value submitted. <code>id</code> links the label to the input. <code>required</code>, <code>min</code>, <code>max</code>, <code>minlength</code>, <code>pattern</code> give free browser validation.</p>\n",
    "plain": "HTML Forms <form action=\"/book\" method=\"post\"> <label for=\"name\">Full name</label> <input id=\"name\" name=\"name\" type=\"text\" required minlength=\"2\"> <label for=\"email\">Email</label> <input id=\"email\" name=\"email\" type=\"email\" required> <label for=\"guests\">Guests</label> <input id=\"guests\" name=\"guests\" type=\"number\" min=\"1\" max=\"6\" value=\"2\"> <label for=\"arrive\">Arrival</label> <input id=\"arrive\" name=\"arrive\" type=\"date\"> <label for=\"room\">Room type</label> <select id=\"room\" name=\"room\"> <option value=\"single\">Single</option> <option value=\"double\" selected>Double</option> </select> <fieldset> <legend>Extras</legend> <label><input type=\"checkbox\" name=\"breakfast\"> Breakfast</label> <label><input type=\"radio\" name=\"bed\" value=\"king\"> King bed</label> <label><input type=\"radio\" name=\"bed\" value=\"twin\"> Twin beds</label> </fieldset> <label for=\"notes\">Notes</label> <textarea id=\"notes\" name=\"notes\" rows=\"4\"></textarea> <button type=\"submit\">Book now</button> </form> Key input types: text , email , password , number , tel , url , date , time , search , file , hidden , checkbox , radio , range , color . The name attribute is what the server receives. No name , no value submitted. id links the label to the input. required , min , max , minlength , pattern give free browser validation."
  },
  {
    "id": "html-labels-and-buttons",
    "lang": "HTML",
    "title": "Labels and buttons",
    "html": "<pre><code class=\"language-html\">&lt;label for=&quot;search&quot;&gt;Search&lt;/label&gt;\n&lt;input id=&quot;search&quot; type=&quot;search&quot;&gt;\n\n&lt;label&gt;\n  &lt;input type=&quot;checkbox&quot; name=&quot;terms&quot; required&gt;\n  I accept the terms\n&lt;/label&gt;\n\n&lt;button type=&quot;button&quot; class=&quot;btn&quot;&gt;Filter&lt;/button&gt;\n&lt;button type=&quot;submit&quot; class=&quot;btn&quot;&gt;Send&lt;/button&gt;\n&lt;button type=&quot;reset&quot;&gt;Clear&lt;/button&gt;\n</code></pre>\n<p>Always connect a label with <code>for</code> plus matching <code>id</code>, or by wrapping the input. A label increases the click target and gives the field an accessible name. <code>type=&quot;button&quot;</code> prevents an accidental form submit inside a form.</p>\n",
    "plain": "HTML Labels and buttons <label for=\"search\">Search</label> <input id=\"search\" type=\"search\"> <label> <input type=\"checkbox\" name=\"terms\" required> I accept the terms </label> <button type=\"button\" class=\"btn\">Filter</button> <button type=\"submit\" class=\"btn\">Send</button> <button type=\"reset\">Clear</button> Always connect a label with for plus matching id , or by wrapping the input. A label increases the click target and gives the field an accessible name. type=\"button\" prevents an accidental form submit inside a form."
  },
  {
    "id": "html-meta-viewport",
    "lang": "HTML",
    "title": "Meta viewport",
    "html": "<pre><code class=\"language-html\">&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1&quot;&gt;\n</code></pre>\n<p>Without it, a phone renders the page at desktop width and zooms out. With it, CSS pixels match the device. Do not add <code>user-scalable=no</code>; it blocks pinch zoom and fails accessibility checks.</p>\n",
    "plain": "HTML Meta viewport <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> Without it, a phone renders the page at desktop width and zooms out. With it, CSS pixels match the device. Do not add user-scalable=no ; it blocks pinch zoom and fails accessibility checks."
  },
  {
    "id": "html-accessibility-basics",
    "lang": "HTML",
    "title": "Accessibility basics",
    "html": "<ul>\n<li>Every image has <code>alt</code>; decorative images use <code>alt=&quot;&quot;</code>.</li>\n<li>Every input has a label. Placeholders are not labels.</li>\n<li>Headings run in order: h1, h2, h3. Do not pick a heading for its size.</li>\n<li>Colour contrast of at least 4.5:1 for body text.</li>\n<li>Visible focus outline on links, buttons and inputs.</li>\n<li>Buttons are <code>&lt;button&gt;</code>; links that navigate are <code>&lt;a&gt;</code>.</li>\n<li><code>lang</code> on <code>&lt;html&gt;</code>.</li>\n<li>Use real text instead of text baked into images.</li>\n<li>Give each landmark a name if there are several: <code>aria-label=&quot;Main&quot;</code>.</li>\n</ul>\n",
    "plain": "HTML Accessibility basics Every image has alt ; decorative images use alt=\"\" . Every input has a label. Placeholders are not labels. Headings run in order: h1, h2, h3. Do not pick a heading for its size. Colour contrast of at least 4.5:1 for body text. Visible focus outline on links, buttons and inputs. Buttons are <button> ; links that navigate are <a> . lang on <html> . Use real text instead of text baked into images. Give each landmark a name if there are several: aria-label=\"Main\" ."
  },
  {
    "id": "html-headings-and-paragraphs",
    "lang": "HTML",
    "title": "Headings and paragraphs",
    "html": "<pre><code class=\"language-html\">&lt;h1&gt;Hotel bookings&lt;/h1&gt;\n&lt;h2&gt;Rooms&lt;/h2&gt;\n&lt;h3&gt;Sea view double&lt;/h3&gt;\n&lt;p&gt;A paragraph of text. The browser wraps it automatically.&lt;/p&gt;\n&lt;p&gt;Use &lt;br&gt; for a line break inside a paragraph, not to make space.&lt;/p&gt;\n&lt;hr&gt;\n</code></pre>\n<p>Use one <code>h1</code> per page, then <code>h2</code> for sections and <code>h3</code> for subsections. Do not skip a level for style. A paragraph is a block; <code>br</code> is a line break, and <code>hr</code> is a thematic break.</p>\n",
    "plain": "HTML Headings and paragraphs <h1>Hotel bookings</h1> <h2>Rooms</h2> <h3>Sea view double</h3> <p>A paragraph of text. The browser wraps it automatically.</p> <p>Use <br> for a line break inside a paragraph, not to make space.</p> <hr> Use one h1 per page, then h2 for sections and h3 for subsections. Do not skip a level for style. A paragraph is a block; br is a line break, and hr is a thematic break."
  },
  {
    "id": "html-text-formatting",
    "lang": "HTML",
    "title": "Text formatting",
    "html": "<pre><code class=\"language-html\">&lt;p&gt;&lt;strong&gt;Important&lt;/strong&gt; and &lt;em&gt;emphasised&lt;/em&gt;.&lt;/p&gt;\n&lt;p&gt;&lt;mark&gt;Highlighted&lt;/mark&gt;, &lt;code&gt;inlineCode()&lt;/code&gt;, and &lt;small&gt;small print&lt;/small&gt;.&lt;/p&gt;\n&lt;blockquote&gt;\n  A quoted sentence.\n&lt;/blockquote&gt;\n&lt;pre&gt;&lt;code&gt;line one\nline two&lt;/code&gt;&lt;/pre&gt;\n</code></pre>\n<p><code>strong</code> means importance, <code>em</code> means stress. <code>mark</code> highlights a search match. <code>code</code> is inline code; <code>pre</code> keeps whitespace and line breaks. Do not use <code>b</code> and <code>i</code> for meaning; they carry no semantic weight.</p>\n",
    "plain": "HTML Text formatting <p><strong>Important</strong> and <em>emphasised</em>.</p> <p><mark>Highlighted</mark>, <code>inlineCode()</code>, and <small>small print</small>.</p> <blockquote> A quoted sentence. </blockquote> <pre><code>line one line two</code></pre> strong means importance, em means stress. mark highlights a search match. code is inline code; pre keeps whitespace and line breaks. Do not use b and i for meaning; they carry no semantic weight."
  },
  {
    "id": "html-classes-and-ids",
    "lang": "HTML",
    "title": "Classes and IDs",
    "html": "<pre><code class=\"language-html\">&lt;section class=&quot;card card--featured&quot; id=&quot;featured-room&quot;&gt;\n  &lt;h2 class=&quot;card__title&quot;&gt;Sea view double&lt;/h2&gt;\n&lt;/section&gt;\n</code></pre>\n<p>A class can repeat and can hold several names. An id must be unique on the page and is used by <code>#id</code>, labels, and fragment links. Style with classes; use ids for a single anchor or a JavaScript hook.</p>\n",
    "plain": "HTML Classes and IDs <section class=\"card card--featured\" id=\"featured-room\"> <h2 class=\"card__title\">Sea view double</h2> </section> A class can repeat and can hold several names. An id must be unique on the page and is used by #id , labels, and fragment links. Style with classes; use ids for a single anchor or a JavaScript hook."
  },
  {
    "id": "html-block-inline-div-and-span",
    "lang": "HTML",
    "title": "Block, inline, div and span",
    "html": "<pre><code class=\"language-html\">&lt;div class=&quot;card&quot;&gt;\n  &lt;p&gt;A paragraph is block level.&lt;/p&gt;\n  &lt;span class=&quot;badge&quot;&gt;New&lt;/span&gt;\n  &lt;a href=&quot;/rooms&quot;&gt;A link is inline.&lt;/a&gt;\n&lt;/div&gt;\n</code></pre>\n<p>Block elements start on a new line and take the available width. Inline elements sit in the text flow and only take the space they need. <code>div</code> and <code>span</code> are generic containers; use a semantic tag when one fits.</p>\n",
    "plain": "HTML Block, inline, div and span <div class=\"card\"> <p>A paragraph is block level.</p> <span class=\"badge\">New</span> <a href=\"/rooms\">A link is inline.</a> </div> Block elements start on a new line and take the available width. Inline elements sit in the text flow and only take the space they need. div and span are generic containers; use a semantic tag when one fits."
  },
  {
    "id": "html-audio-and-video",
    "lang": "HTML",
    "title": "Audio and video",
    "html": "<pre><code class=\"language-html\">&lt;video controls width=&quot;640&quot; poster=&quot;poster.jpg&quot;&gt;\n  &lt;source src=&quot;tour.mp4&quot; type=&quot;video/mp4&quot;&gt;\n  Your browser does not support video.\n&lt;/video&gt;\n\n&lt;audio controls&gt;\n  &lt;source src=&quot;intro.mp3&quot; type=&quot;audio/mpeg&quot;&gt;\n  Your browser does not support audio.\n&lt;/audio&gt;\n</code></pre>\n<p><code>controls</code> shows the browser player. The text inside is a fallback. <code>poster</code> is the image before playback. Do not autoplay sound; browsers block it and users dislike it.</p>\n",
    "plain": "HTML Audio and video <video controls width=\"640\" poster=\"poster.jpg\"> <source src=\"tour.mp4\" type=\"video/mp4\"> Your browser does not support video. </video> <audio controls> <source src=\"intro.mp3\" type=\"audio/mpeg\"> Your browser does not support audio. </audio> controls shows the browser player. The text inside is a fallback. poster is the image before playback. Do not autoplay sound; browsers block it and users dislike it."
  },
  {
    "id": "html-iframe",
    "lang": "HTML",
    "title": "Iframe",
    "html": "<pre><code class=\"language-html\">&lt;iframe\n  src=&quot;https://example.com/map&quot;\n  title=&quot;Hotel location&quot;\n  width=&quot;600&quot;\n  height=&quot;400&quot;\n  loading=&quot;lazy&quot;\n&gt;&lt;/iframe&gt;\n</code></pre>\n<p>An iframe embeds another page. Always set <code>title</code> for screen readers. <code>loading=&quot;lazy&quot;</code> delays off-screen frames. Many sites block embedding with <code>X-Frame-Options</code>.</p>\n",
    "plain": "HTML Iframe <iframe src=\"https://example.com/map\" title=\"Hotel location\" width=\"600\" height=\"400\" loading=\"lazy\" ></iframe> An iframe embeds another page. Always set title for screen readers. loading=\"lazy\" delays off-screen frames. Many sites block embedding with X-Frame-Options ."
  },
  {
    "id": "html-entities",
    "lang": "HTML",
    "title": "Entities",
    "html": "<pre><code class=\"language-html\">&lt;p&gt;&amp;lt;tag&amp;gt; &amp;amp; &amp;quot;quoted&amp;quot; &amp;copy; 2026&lt;/p&gt;\n&lt;p&gt;Non-breaking&amp;nbsp;space&lt;/p&gt;\n</code></pre>\n<p>Use <code>&amp;lt;</code> and <code>&amp;gt;</code> to show angle brackets as text. <code>&amp;amp;</code> is a literal ampersand. <code>&amp;nbsp;</code> keeps two words together. Named entities are clearer than numeric codes.</p>\n",
    "plain": "HTML Entities <p><tag> &amp; \"quoted\" &copy; 2026</p> <p>Non-breaking&nbsp;space</p> Use < and > to show angle brackets as text. &amp; is a literal ampersand. &nbsp; keeps two words together. Named entities are clearer than numeric codes."
  },
  {
    "id": "html-complete-page-skeleton",
    "lang": "HTML",
    "title": "Complete page skeleton",
    "html": "<pre><code class=\"language-html\">&lt;!DOCTYPE html&gt;\n&lt;html lang=&quot;en&quot;&gt;\n&lt;head&gt;\n  &lt;meta charset=&quot;UTF-8&quot;&gt;\n  &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1&quot;&gt;\n  &lt;title&gt;Hotel bookings&lt;/title&gt;\n  &lt;link rel=&quot;stylesheet&quot; href=&quot;css/components.css&quot;&gt;\n&lt;/head&gt;\n&lt;body&gt;\n  &lt;a class=&quot;skip-link&quot; href=&quot;#main&quot;&gt;Skip to content&lt;/a&gt;\n\n  &lt;header class=&quot;navbar&quot;&gt;\n    &lt;span class=&quot;navbar__brand&quot;&gt;StayEasy&lt;/span&gt;\n    &lt;nav class=&quot;navbar__links&quot; aria-label=&quot;Main&quot;&gt;\n      &lt;a href=&quot;index.html&quot;&gt;Home&lt;/a&gt;\n      &lt;a href=&quot;rooms.html&quot;&gt;Rooms&lt;/a&gt;\n      &lt;a href=&quot;contact.html&quot;&gt;Contact&lt;/a&gt;\n    &lt;/nav&gt;\n  &lt;/header&gt;\n\n  &lt;main id=&quot;main&quot;&gt;\n    &lt;section class=&quot;hero&quot;&gt;\n      &lt;div class=&quot;panel&quot;&gt;\n        &lt;h1&gt;Find a room tonight&lt;/h1&gt;\n        &lt;p&gt;Late checkout included on every booking.&lt;/p&gt;\n        &lt;a class=&quot;btn&quot; href=&quot;rooms.html&quot;&gt;See rooms&lt;/a&gt;\n      &lt;/div&gt;\n    &lt;/section&gt;\n\n    &lt;section class=&quot;container&quot;&gt;\n      &lt;h2&gt;Popular rooms&lt;/h2&gt;\n      &lt;div class=&quot;card-grid&quot;&gt;\n        &lt;article class=&quot;card&quot;&gt;\n          &lt;img class=&quot;card__media&quot; src=&quot;img/room-1.jpg&quot; alt=&quot;Double room with sea view&quot;&gt;\n          &lt;div class=&quot;card__body&quot;&gt;\n            &lt;h3 class=&quot;card__title&quot;&gt;Sea view double&lt;/h3&gt;\n            &lt;p class=&quot;card__meta&quot;&gt;2 guests, 1 bed&lt;/p&gt;\n            &lt;p class=&quot;card__price&quot;&gt;80 EUR / night&lt;/p&gt;\n          &lt;/div&gt;\n        &lt;/article&gt;\n      &lt;/div&gt;\n    &lt;/section&gt;\n  &lt;/main&gt;\n\n  &lt;footer class=&quot;container&quot;&gt;\n    &lt;p class=&quot;muted&quot;&gt;StayEasy, Budapest. 2026.&lt;/p&gt;\n  &lt;/footer&gt;\n\n  &lt;script src=&quot;js/app.js&quot; defer&gt;&lt;/script&gt;\n&lt;/body&gt;\n&lt;/html&gt;\n</code></pre>\n<p>The skip link is the first focusable element, so a keyboard user can jump past the nav. <code>defer</code> runs the script after the HTML is parsed, so the DOM exists.</p>\n",
    "plain": "HTML Complete page skeleton <!DOCTYPE html> <html lang=\"en\"> <head> <meta charset=\"UTF-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> <title>Hotel bookings</title> <link rel=\"stylesheet\" href=\"css/components.css\"> </head> <body> <a class=\"skip-link\" href=\"#main\">Skip to content</a> <header class=\"navbar\"> <span class=\"navbar__brand\">StayEasy</span> <nav class=\"navbar__links\" aria-label=\"Main\"> <a href=\"index.html\">Home</a> <a href=\"rooms.html\">Rooms</a> <a href=\"contact.html\">Contact</a> </nav> </header> <main id=\"main\"> <section class=\"hero\"> <div class=\"panel\"> <h1>Find a room tonight</h1> <p>Late checkout included on every booking.</p> <a class=\"btn\" href=\"rooms.html\">See rooms</a> </div> </section> <section class=\"container\"> <h2>Popular rooms</h2> <div class=\"card-grid\"> <article class=\"card\"> <img class=\"card__media\" src=\"img/room-1.jpg\" alt=\"Double room with sea view\"> <div class=\"card__body\"> <h3 class=\"card__title\">Sea view double</h3> <p class=\"card__meta\">2 guests, 1 bed</p> <p class=\"card__price\">80 EUR / night</p> </div> </article> </div> </section> </main> <footer class=\"container\"> <p class=\"muted\">StayEasy, Budapest. 2026.</p> </footer> <script src=\"js/app.js\" defer></script> </body> </html> The skip link is the first focusable element, so a keyboard user can jump past the nav. defer runs the script after the HTML is parsed, so the DOM exists."
  },
  {
    "id": "css-selectors",
    "lang": "CSS",
    "title": "Selectors",
    "html": "<pre><code class=\"language-css\">p            { }   /* every paragraph */\n.card        { }   /* class */\n#hero        { }   /* id, use once per page */\nnav a        { }   /* link inside nav */\nul &gt; li      { }   /* direct child only */\nh2 + p       { }   /* paragraph right after h2 */\nh2 ~ p       { }   /* all later siblings */\ninput[type=&quot;email&quot;] { }   /* attribute */\n[data-open]  { }   /* attribute present */\na:hover      { }   /* pseudo-class */\np::first-line { }  /* pseudo-element */\n.card, .panel { }  /* grouping */\n</code></pre>\n<p>Universal selector <code>*</code> matches everything. Use it for resets, not for styling.</p>\n",
    "plain": "CSS Selectors p { } /* every paragraph */ .card { } /* class */ #hero { } /* id, use once per page */ nav a { } /* link inside nav */ ul > li { } /* direct child only */ h2 + p { } /* paragraph right after h2 */ h2 ~ p { } /* all later siblings */ input[type=\"email\"] { } /* attribute */ [data-open] { } /* attribute present */ a:hover { } /* pseudo-class */ p::first-line { } /* pseudo-element */ .card, .panel { } /* grouping */ Universal selector * matches everything. Use it for resets, not for styling."
  },
  {
    "id": "css-specificity",
    "lang": "CSS",
    "title": "Specificity",
    "html": "<p>Specificity is a weight, not a count of characters. Four columns: inline style, id, class/attribute/pseudo-class, element/pseudo-element.</p>\n<pre><code class=\"language-text\">style=&quot;...&quot;         1,0,0,0\n#hero               0,1,0,0\n.card:hover         0,0,2,0\nnav ul li           0,0,0,3\n*                   0,0,0,0\n</code></pre>\n<p>Higher wins. Equal weight: the later rule wins. <code>!important</code> beats all normal rules, so treat it as a last resort. Keep selectors flat. Three classes beat one deep chain and they are easier to override.</p>\n",
    "plain": "CSS Specificity Specificity is a weight, not a count of characters. Four columns: inline style, id, class/attribute/pseudo-class, element/pseudo-element. style=\"...\" 1,0,0,0 #hero 0,1,0,0 .card:hover 0,0,2,0 nav ul li 0,0,0,3 * 0,0,0,0 Higher wins. Equal weight: the later rule wins. !important beats all normal rules, so treat it as a last resort. Keep selectors flat. Three classes beat one deep chain and they are easier to override."
  },
  {
    "id": "css-box-model",
    "lang": "CSS",
    "title": "Box model",
    "html": "<p>Every element is content, padding, border, margin, in that order.</p>\n<pre><code class=\"language-css\">.box {\n  width: 300px;\n  padding: 16px;\n  border: 1px solid #ddd;\n  margin: 24px auto;\n  box-sizing: border-box; /* width includes padding and border */\n}\n</code></pre>\n<p><code>content-box</code> is the default: <code>width</code> covers content only, so the real size grows. Set <code>box-sizing: border-box</code> on <code>*</code> and stop guessing. Vertical margins collapse between siblings; padding does not. <code>margin: 0 auto</code> centers a block with a set width.</p>\n",
    "plain": "CSS Box model Every element is content, padding, border, margin, in that order. .box { width: 300px; padding: 16px; border: 1px solid #ddd; margin: 24px auto; box-sizing: border-box; /* width includes padding and border */ } content-box is the default: width covers content only, so the real size grows. Set box-sizing: border-box on * and stop guessing. Vertical margins collapse between siblings; padding does not. margin: 0 auto centers a block with a set width."
  },
  {
    "id": "css-display",
    "lang": "CSS",
    "title": "Display",
    "html": "<pre><code class=\"language-css\">.block  { display: block; }        /* full width, respects height */\n.inline { display: inline; }       /* flows in text, no height */\n.inline-block { display: inline-block; }\n.none   { display: none; }         /* removed from layout */\n.flex   { display: flex; }\n.grid   { display: grid; }\n</code></pre>\n<p><code>display: none</code> removes the element and its space. <code>visibility: hidden</code> keeps the space. <code>inline-block</code> sits in a line but accepts width and height.</p>\n",
    "plain": "CSS Display .block { display: block; } /* full width, respects height */ .inline { display: inline; } /* flows in text, no height */ .inline-block { display: inline-block; } .none { display: none; } /* removed from layout */ .flex { display: flex; } .grid { display: grid; } display: none removes the element and its space. visibility: hidden keeps the space. inline-block sits in a line but accepts width and height."
  },
  {
    "id": "css-position",
    "lang": "CSS",
    "title": "Position",
    "html": "<pre><code class=\"language-css\">.static   { position: static; }   /* default */\n.relative { position: relative; top: 8px; left: 8px; }\n.absolute { position: absolute; top: 0; right: 0; }\n.fixed    { position: fixed; top: 0; left: 0; }\n.sticky   { position: sticky; top: 0; }\n</code></pre>\n<p><code>absolute</code> positions against the nearest ancestor that is not <code>static</code>. That ancestor is usually <code>position: relative</code>. <code>fixed</code> pins to the viewport and does not scroll. <code>sticky</code> switches between normal flow and fixed at a scroll threshold. Positioned elements can use <code>z-index</code>; a higher value paints on top.</p>\n",
    "plain": "CSS Position .static { position: static; } /* default */ .relative { position: relative; top: 8px; left: 8px; } .absolute { position: absolute; top: 0; right: 0; } .fixed { position: fixed; top: 0; left: 0; } .sticky { position: sticky; top: 0; } absolute positions against the nearest ancestor that is not static . That ancestor is usually position: relative . fixed pins to the viewport and does not scroll. sticky switches between normal flow and fixed at a scroll threshold. Positioned elements can use z-index ; a higher value paints on top."
  },
  {
    "id": "css-flexbox",
    "lang": "CSS",
    "title": "Flexbox",
    "html": "<p>One axis at a time. The container decides direction.</p>\n<pre><code class=\"language-css\">.row {\n  display: flex;\n  gap: 16px;\n  justify-content: space-between; /* main axis */\n  align-items: center;            /* cross axis */\n  flex-wrap: wrap;\n}\n.row &gt; .item { flex: 1 1 200px; } /* grow shrink basis */\n</code></pre>\n<p><code>justify-content</code> works on the main axis, <code>align-items</code> on the cross axis. <code>flex: 1</code> means grow and shrink equally. <code>margin-left: auto</code> on one child pushes it to the far end. Use <code>gap</code> instead of margins between items.</p>\n",
    "plain": "CSS Flexbox One axis at a time. The container decides direction. .row { display: flex; gap: 16px; justify-content: space-between; /* main axis */ align-items: center; /* cross axis */ flex-wrap: wrap; } .row > .item { flex: 1 1 200px; } /* grow shrink basis */ justify-content works on the main axis, align-items on the cross axis. flex: 1 means grow and shrink equally. margin-left: auto on one child pushes it to the far end. Use gap instead of margins between items."
  },
  {
    "id": "css-grid",
    "lang": "CSS",
    "title": "Grid",
    "html": "<p>Two axes. Good for page layouts and card galleries.</p>\n<pre><code class=\"language-css\">.gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n  gap: 24px;\n}\n.layout {\n  display: grid;\n  grid-template-columns: 240px 1fr;\n  grid-template-areas: &quot;side main&quot;;\n}\n</code></pre>\n<p><code>auto-fit</code> with <code>minmax</code> gives a responsive card grid without media queries. <code>fr</code> splits the free space. <code>grid-column: 1 / -1</code> spans the full row. <code>place-items: center</code> centers a single child on both axes.</p>\n",
    "plain": "CSS Grid Two axes. Good for page layouts and card galleries. .gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; } .layout { display: grid; grid-template-columns: 240px 1fr; grid-template-areas: \"side main\"; } auto-fit with minmax gives a responsive card grid without media queries. fr splits the free space. grid-column: 1 / -1 spans the full row. place-items: center centers a single child on both axes."
  },
  {
    "id": "css-media-queries",
    "lang": "CSS",
    "title": "Media queries",
    "html": "<p>Mobile first: base styles for small screens, then widen.</p>\n<pre><code class=\"language-css\">@media (min-width: 768px) { .grid { grid-template-columns: 1fr 1fr; } }\n@media (min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } }\n@media (max-width: 600px) { .nav { display: none; } }\n@media print { .navbar { display: none; } }\n</code></pre>\n<p>Common breakpoints in this repo: 600, 768, 1024. Use <code>min-width</code> for content that grows, <code>max-width</code> when hiding a desktop nav.</p>\n",
    "plain": "CSS Media queries Mobile first: base styles for small screens, then widen. @media (min-width: 768px) { .grid { grid-template-columns: 1fr 1fr; } } @media (min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } } @media (max-width: 600px) { .nav { display: none; } } @media print { .navbar { display: none; } } Common breakpoints in this repo: 600, 768, 1024. Use min-width for content that grows, max-width when hiding a desktop nav."
  },
  {
    "id": "css-variables",
    "lang": "CSS",
    "title": "Variables",
    "html": "<pre><code class=\"language-css\">:root {\n  --brand: #1f6feb;\n  --text: #1b1f24;\n  --radius: 12px;\n  --space: 1rem;\n}\n.btn { background: var(--brand); border-radius: var(--radius); }\n</code></pre>\n<p>Variables cascade and inherit. A child can override one locally. <code>var(--x, fallback)</code> supplies a default.</p>\n",
    "plain": "CSS Variables :root { --brand: #1f6feb; --text: #1b1f24; --radius: 12px; --space: 1rem; } .btn { background: var(--brand); border-radius: var(--radius); } Variables cascade and inherit. A child can override one locally. var(--x, fallback) supplies a default."
  },
  {
    "id": "css-transitions",
    "lang": "CSS",
    "title": "Transitions",
    "html": "<pre><code class=\"language-css\">.btn {\n  transition: background-color 0.2s ease, transform 0.2s ease;\n}\n.btn:hover { background-color: #1558b0; transform: translateY(-2px); }\n</code></pre>\n<p>Transition the property that actually changes. <code>all</code> is slow and unpredictable on big elements. Keep durations between 150 and 300 ms for interface feedback.</p>\n",
    "plain": "CSS Transitions .btn { transition: background-color 0.2s ease, transform 0.2s ease; } .btn:hover { background-color: #1558b0; transform: translateY(-2px); } Transition the property that actually changes. all is slow and unpredictable on big elements. Keep durations between 150 and 300 ms for interface feedback."
  },
  {
    "id": "css-transforms",
    "lang": "CSS",
    "title": "Transforms",
    "html": "<pre><code class=\"language-css\">.zoom:hover  { transform: scale(1.05); }\n.tilt        { transform: rotate(-3deg); }\n.lift        { transform: translateY(-4px); }\n.card        { transition: transform 0.2s ease; }\n</code></pre>\n<p>Transforms do not affect layout, so they are cheap to animate. Combine them in one declaration: <code>transform: translateY(-4px) scale(1.02)</code>. Use <code>transform-origin</code> to move the pivot.</p>\n",
    "plain": "CSS Transforms .zoom:hover { transform: scale(1.05); } .tilt { transform: rotate(-3deg); } .lift { transform: translateY(-4px); } .card { transition: transform 0.2s ease; } Transforms do not affect layout, so they are cheap to animate. Combine them in one declaration: transform: translateY(-4px) scale(1.02) . Use transform-origin to move the pivot."
  },
  {
    "id": "css-pseudo-classes",
    "lang": "CSS",
    "title": "Pseudo-classes",
    "html": "<pre><code class=\"language-css\">li:first-child { }\nli:last-child  { }\nli:nth-child(2n) { }      /* even items */\ninput:focus    { outline: 2px solid var(--brand); }\ninput:invalid  { border-color: #c0392b; }\n.card:hover    { }\na:visited      { }\n:not(.active)  { }\n</code></pre>\n<p><code>:focus-visible</code> targets keyboard focus only, which is the accessible choice for outlines. Never remove a focus outline without a replacement.</p>\n",
    "plain": "CSS Pseudo-classes li:first-child { } li:last-child { } li:nth-child(2n) { } /* even items */ input:focus { outline: 2px solid var(--brand); } input:invalid { border-color: #c0392b; } .card:hover { } a:visited { } :not(.active) { } :focus-visible targets keyboard focus only, which is the accessible choice for outlines. Never remove a focus outline without a replacement."
  },
  {
    "id": "css-pattern-full-screen-background-with-centered-panel",
    "lang": "CSS",
    "title": "Pattern: full-screen background with centered panel",
    "html": "<pre><code class=\"language-css\">.hero {\n  min-height: 100vh;\n  background: url(&quot;../img/hotel.jpg&quot;) center / cover no-repeat;\n  display: grid;\n  place-items: center;\n}\n.panel {\n  max-width: 1100px;\n  width: calc(100% - 32px);\n  padding: 40px;\n  border-radius: 12px;\n  background: rgba(255, 255, 255, 0.85);\n  backdrop-filter: blur(4px);\n}\n</code></pre>\n<p><code>center / cover</code> centers the image and covers the box. The panel stays readable because it has its own background. <code>calc(100% - 32px)</code> keeps a gutter on small screens.</p>\n",
    "plain": "CSS Pattern: full-screen background with centered panel .hero { min-height: 100vh; background: url(\"../img/hotel.jpg\") center / cover no-repeat; display: grid; place-items: center; } .panel { max-width: 1100px; width: calc(100% - 32px); padding: 40px; border-radius: 12px; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(4px); } center / cover centers the image and covers the box. The panel stays readable because it has its own background. calc(100% - 32px) keeps a gutter on small screens."
  },
  {
    "id": "css-pattern-fixed-navbar",
    "lang": "CSS",
    "title": "Pattern: fixed navbar",
    "html": "<pre><code class=\"language-css\">.navbar {\n  position: fixed;\n  inset: 0 0 auto 0;   /* top, right, bottom, left */\n  height: 64px;\n  display: flex;\n  align-items: center;\n  gap: 24px;\n  padding: 0 24px;\n  background: #10202f;\n  color: #fff;\n  z-index: 10;\n}\nbody { padding-top: 64px; } /* stop content sliding under it */\n</code></pre>\n<p>A fixed bar leaves the flow, so reserve its height on the body. Add <code>backdrop-filter: blur(8px)</code> and a transparent background for a glass look.</p>\n",
    "plain": "CSS Pattern: fixed navbar .navbar { position: fixed; inset: 0 0 auto 0; /* top, right, bottom, left */ height: 64px; display: flex; align-items: center; gap: 24px; padding: 0 24px; background: #10202f; color: #fff; z-index: 10; } body { padding-top: 64px; } /* stop content sliding under it */ A fixed bar leaves the flow, so reserve its height on the body. Add backdrop-filter: blur(8px) and a transparent background for a glass look."
  },
  {
    "id": "css-pattern-card-grid",
    "lang": "CSS",
    "title": "Pattern: card grid",
    "html": "<pre><code class=\"language-css\">.cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));\n  gap: 24px;\n  padding: 24px;\n}\n.card { background: #fff; border-radius: 12px; overflow: hidden; }\n.card img { width: 100%; height: 180px; object-fit: cover; display: block; }\n</code></pre>\n<p><code>object-fit: cover</code> stops image distortion. <code>overflow: hidden</code> clips the image to the rounded corners.</p>\n",
    "plain": "CSS Pattern: card grid .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; padding: 24px; } .card { background: #fff; border-radius: 12px; overflow: hidden; } .card img { width: 100%; height: 180px; object-fit: cover; display: block; } object-fit: cover stops image distortion. overflow: hidden clips the image to the rounded corners."
  },
  {
    "id": "css-colors-and-backgrounds",
    "lang": "CSS",
    "title": "Colors and backgrounds",
    "html": "<pre><code class=\"language-css\">:root {\n  --brand: #2563eb;\n  --ink: #1f2937;\n  --paper: #ffffff;\n}\n\n.hero {\n  color: var(--ink);\n  background-color: var(--paper);\n  background-image: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(&quot;hero.jpg&quot;);\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n}\n</code></pre>\n<p>Use hex for a fixed colour, <code>rgb()</code> or <code>hsl()</code> when you need transparency or a hue. A gradient layer over an image keeps text readable. <code>background-size: cover</code> fills the box and may crop.</p>\n",
    "plain": "CSS Colors and backgrounds :root { --brand: #2563eb; --ink: #1f2937; --paper: #ffffff; } .hero { color: var(--ink); background-color: var(--paper); background-image: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(\"hero.jpg\"); background-size: cover; background-position: center; background-repeat: no-repeat; } Use hex for a fixed colour, rgb() or hsl() when you need transparency or a hue. A gradient layer over an image keeps text readable. background-size: cover fills the box and may crop."
  },
  {
    "id": "css-text-and-fonts",
    "lang": "CSS",
    "title": "Text and fonts",
    "html": "<pre><code class=\"language-css\">body {\n  font-family: system-ui, -apple-system, &quot;Segoe UI&quot;, sans-serif;\n  font-size: 16px;\n  line-height: 1.6;\n  color: #1f2937;\n}\n\nh1 {\n  font-size: clamp(1.8rem, 4vw, 3rem);\n  font-weight: 700;\n  letter-spacing: -0.02em;\n}\n\n.muted {\n  color: #6b7280;\n  font-size: 0.875rem;\n}\n</code></pre>\n<p><code>line-height</code> without a unit scales with the font size. <code>clamp(min, preferred, max)</code> makes a fluid heading without a media query. A font stack falls back from left to right.</p>\n",
    "plain": "CSS Text and fonts body { font-family: system-ui, -apple-system, \"Segoe UI\", sans-serif; font-size: 16px; line-height: 1.6; color: #1f2937; } h1 { font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 700; letter-spacing: -0.02em; } .muted { color: #6b7280; font-size: 0.875rem; } line-height without a unit scales with the font size. clamp(min, preferred, max) makes a fluid heading without a media query. A font stack falls back from left to right."
  },
  {
    "id": "css-borders-margin-padding",
    "lang": "CSS",
    "title": "Borders, margin, padding",
    "html": "<pre><code class=\"language-css\">.card {\n  margin: 16px auto;\n  padding: 20px;\n  border: 1px solid #d1d5db;\n  border-radius: 12px;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);\n}\n\n.card &gt; h2 {\n  margin: 0 0 8px;\n}\n</code></pre>\n<p>Margin is space outside the border; padding is space inside. Shorthand <code>margin: 16px auto</code> means 16px top and bottom, auto left and right, which centers a fixed-width block. <code>border-radius</code> rounds the corners; <code>box-shadow</code> adds depth without affecting layout.</p>\n",
    "plain": "CSS Borders, margin, padding .card { margin: 16px auto; padding: 20px; border: 1px solid #d1d5db; border-radius: 12px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12); } .card > h2 { margin: 0 0 8px; } Margin is space outside the border; padding is space inside. Shorthand margin: 16px auto means 16px top and bottom, auto left and right, which centers a fixed-width block. border-radius rounds the corners; box-shadow adds depth without affecting layout."
  },
  {
    "id": "css-overflow-and-z-index",
    "lang": "CSS",
    "title": "Overflow and z-index",
    "html": "<pre><code class=\"language-css\">.table-wrap {\n  overflow-x: auto;\n}\n\n.modal {\n  position: fixed;\n  inset: 0;\n  z-index: 100;\n  background: rgba(0, 0, 0, 0.5);\n}\n\n.navbar {\n  position: sticky;\n  top: 0;\n  z-index: 10;\n}\n</code></pre>\n<p><code>overflow-x: auto</code> adds a horizontal scrollbar only when needed. <code>z-index</code> only works on a positioned element or a flex/grid item. A child cannot escape its parent&#39;s stacking context, so a high number is not always enough.</p>\n",
    "plain": "CSS Overflow and z-index .table-wrap { overflow-x: auto; } .modal { position: fixed; inset: 0; z-index: 100; background: rgba(0, 0, 0, 0.5); } .navbar { position: sticky; top: 0; z-index: 10; } overflow-x: auto adds a horizontal scrollbar only when needed. z-index only works on a positioned element or a flex/grid item. A child cannot escape its parent's stacking context, so a high number is not always enough."
  },
  {
    "id": "css-pseudo-elements-and-combinators",
    "lang": "CSS",
    "title": "Pseudo-elements and combinators",
    "html": "<pre><code class=\"language-css\">.card::before {\n  content: &quot;&quot;;\n  display: block;\n  height: 4px;\n  background: #2563eb;\n}\n\n.card &gt; h2 { margin-top: 0; }\n.card + .card { margin-top: 16px; }\n.card:hover { border-color: #2563eb; }\n.card:focus-within { outline: 2px solid #2563eb; }\n\nli:nth-child(odd) { background: #f9fafb; }\ninput:not([type=&quot;checkbox&quot;]) { width: 100%; }\n</code></pre>\n<p><code>::before</code> and <code>::after</code> create a decorative box; <code>content</code> is required. <code>&gt;</code> is a direct child, <code>+</code> the next sibling, <code>~</code> any later sibling. <code>:nth-child</code> counts among siblings. <code>:not()</code> excludes a case.</p>\n",
    "plain": "CSS Pseudo-elements and combinators .card::before { content: \"\"; display: block; height: 4px; background: #2563eb; } .card > h2 { margin-top: 0; } .card + .card { margin-top: 16px; } .card:hover { border-color: #2563eb; } .card:focus-within { outline: 2px solid #2563eb; } li:nth-child(odd) { background: #f9fafb; } input:not([type=\"checkbox\"]) { width: 100%; } ::before and ::after create a decorative box; content is required. > is a direct child, + the next sibling, ~ any later sibling. :nth-child counts among siblings. :not() excludes a case."
  },
  {
    "id": "css-animation",
    "lang": "CSS",
    "title": "Animation",
    "html": "<pre><code class=\"language-css\">.fade-in {\n  animation: fade-in 0.4s ease-out both;\n}\n\n@keyframes fade-in {\n  from { opacity: 0; transform: translateY(8px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n\n.button {\n  transition: background-color 0.2s ease, transform 0.2s ease;\n}\n\n.button:hover {\n  background-color: #1d4ed8;\n  transform: translateY(-1px);\n}\n\n@media (prefers-reduced-motion: reduce) {\n  * { animation: none; transition: none; }\n}\n</code></pre>\n<p><code>animation</code> runs a keyframe sequence; <code>transition</code> animates a property change. <code>both</code> keeps the final state. Respect <code>prefers-reduced-motion</code> for people who get motion sickness.</p>\n",
    "plain": "CSS Animation .fade-in { animation: fade-in 0.4s ease-out both; } @keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } .button { transition: background-color 0.2s ease, transform 0.2s ease; } .button:hover { background-color: #1d4ed8; transform: translateY(-1px); } @media (prefers-reduced-motion: reduce) { * { animation: none; transition: none; } } animation runs a keyframe sequence; transition animates a property change. both keeps the final state. Respect prefers-reduced-motion for people who get motion sickness."
  },
  {
    "id": "css-units-and-functions",
    "lang": "CSS",
    "title": "Units and functions",
    "html": "<pre><code class=\"language-css\">.panel {\n  width: min(1100px, 100% - 32px);\n  min-height: 100vh;\n  padding: clamp(16px, 3vw, 32px);\n  font-size: 1rem;\n}\n\n.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));\n  gap: 20px;\n}\n</code></pre>\n<p><code>rem</code> is relative to the root font size, <code>em</code> to the current element, <code>vh</code> and <code>vw</code> to the viewport. <code>min()</code>, <code>max()</code>, and <code>clamp()</code> choose a value at runtime. <code>auto-fill</code> and <code>minmax()</code> make a responsive grid without media queries.</p>\n",
    "plain": "CSS Units and functions .panel { width: min(1100px, 100% - 32px); min-height: 100vh; padding: clamp(16px, 3vw, 32px); font-size: 1rem; } .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; } rem is relative to the root font size, em to the current element, vh and vw to the viewport. min() , max() , and clamp() choose a value at runtime. auto-fill and minmax() make a responsive grid without media queries."
  },
  {
    "id": "css-quick-reminders",
    "lang": "CSS",
    "title": "Quick reminders",
    "html": "<ul>\n<li><code>width: 100%</code> plus padding overflows unless <code>border-box</code> is set.</li>\n<li>A flex child with long text needs <code>min-width: 0</code> to shrink.</li>\n<li><code>z-index</code> only works on positioned elements or flex and grid children.</li>\n<li>Test at 320 px wide. That is where layouts break first.</li>\n<li>Prefer <code>rem</code> for text and <code>px</code> for borders.</li>\n<li>Use <code>clamp(1rem, 4vw, 2rem)</code> for fluid type.</li>\n</ul>\n",
    "plain": "CSS Quick reminders width: 100% plus padding overflows unless border-box is set. A flex child with long text needs min-width: 0 to shrink. z-index only works on positioned elements or flex and grid children. Test at 320 px wide. That is where layouts break first. Prefer rem for text and px for borders. Use clamp(1rem, 4vw, 2rem) for fluid type."
  },
  {
    "id": "javascript-variables",
    "lang": "JavaScript",
    "title": "Variables",
    "html": "<pre><code class=\"language-js\">let count = 0;      // reassignable\nconst rate = 0.27;  // binding fixed\nvar old = 1;        // function scoped, avoid\n</code></pre>\n<p>Use <code>const</code> by default, <code>let</code> when it changes. A <code>const</code> object can still be mutated; only the binding is fixed.</p>\n",
    "plain": "JavaScript Variables let count = 0; // reassignable const rate = 0.27; // binding fixed var old = 1; // function scoped, avoid Use const by default, let when it changes. A const object can still be mutated; only the binding is fixed."
  },
  {
    "id": "javascript-types",
    "lang": "JavaScript",
    "title": "Types",
    "html": "<pre><code class=\"language-js\">typeof &quot;hi&quot;        // &quot;string&quot;\ntypeof 42          // &quot;number&quot;\ntypeof undefined   // &quot;undefined&quot;\ntypeof null        // &quot;object&quot; (known quirk)\ntypeof (() =&gt; 1)   // &quot;function&quot;\nArray.isArray([])  // true, reliable array check\n</code></pre>\n<p>Primitives: string, number, boolean, undefined, null, symbol, bigint. Everything else is an object. Numbers are doubles, so <code>0.1 + 0.2 !== 0.3</code>.</p>\n",
    "plain": "JavaScript Types typeof \"hi\" // \"string\" typeof 42 // \"number\" typeof undefined // \"undefined\" typeof null // \"object\" (known quirk) typeof (() => 1) // \"function\" Array.isArray([]) // true, reliable array check Primitives: string, number, boolean, undefined, null, symbol, bigint. Everything else is an object. Numbers are doubles, so 0.1 + 0.2 !== 0.3 ."
  },
  {
    "id": "javascript-operators",
    "lang": "JavaScript",
    "title": "Operators",
    "html": "<pre><code class=\"language-js\">5 % 2      // 1, remainder\n2 ** 3     // 8, power\n5 == &quot;5&quot;   // true, loose, avoid\n5 === &quot;5&quot;  // false, strict, use\nnull ?? &quot;fallback&quot;   // &quot;fallback&quot;\nfalse || &quot;fallback&quot;  // &quot;fallback&quot;\nuser?.address?.city  // undefined, no throw\n</code></pre>\n<p><code>??</code> falls back only for <code>null</code> and <code>undefined</code>. <code>||</code> falls back for every falsy value, including <code>0</code> and <code>&quot;&quot;</code>, which is a common bug.</p>\n",
    "plain": "JavaScript Operators 5 % 2 // 1, remainder 2 ** 3 // 8, power 5 == \"5\" // true, loose, avoid 5 === \"5\" // false, strict, use null ?? \"fallback\" // \"fallback\" false || \"fallback\" // \"fallback\" user?.address?.city // undefined, no throw ?? falls back only for null and undefined . || falls back for every falsy value, including 0 and \"\" , which is a common bug."
  },
  {
    "id": "javascript-conditionals",
    "lang": "JavaScript",
    "title": "Conditionals",
    "html": "<pre><code class=\"language-js\">if (score &gt; 90) grade = &quot;A&quot;;\nelse if (score &gt; 75) grade = &quot;B&quot;;\nelse grade = &quot;C&quot;;\n\nconst label = count === 1 ? &quot;item&quot; : &quot;items&quot;;\nswitch (role) { case &quot;admin&quot;: allow = true; break; default: allow = false; }\n</code></pre>\n",
    "plain": "JavaScript Conditionals if (score > 90) grade = \"A\"; else if (score > 75) grade = \"B\"; else grade = \"C\"; const label = count === 1 ? \"item\" : \"items\"; switch (role) { case \"admin\": allow = true; break; default: allow = false; }"
  },
  {
    "id": "javascript-loops",
    "lang": "JavaScript",
    "title": "Loops",
    "html": "<pre><code class=\"language-js\">for (let i = 0; i &lt; 3; i++) console.log(i);\nfor (const item of list) console.log(item);   // values\nfor (const key in obj) console.log(key);      // keys\nwhile (n &lt; 3) n++;\nlist.forEach((x, i) =&gt; console.log(i, x));\n</code></pre>\n<p><code>for...of</code> works on arrays, strings, Maps and Sets. <code>for...in</code> is for object keys. <code>break</code> exits, <code>continue</code> skips the round.</p>\n",
    "plain": "JavaScript Loops for (let i = 0; i < 3; i++) console.log(i); for (const item of list) console.log(item); // values for (const key in obj) console.log(key); // keys while (n < 3) n++; list.forEach((x, i) => console.log(i, x)); for...of works on arrays, strings, Maps and Sets. for...in is for object keys. break exits, continue skips the round."
  },
  {
    "id": "javascript-functions",
    "lang": "JavaScript",
    "title": "Functions",
    "html": "<pre><code class=\"language-js\">function add(a, b = 0) { return a + b; }\nconst sub = function (a, b) { return a - b; };\nfunction total(...nums) { return nums.reduce((s, n) =&gt; s + n, 0); }\n</code></pre>\n<p>No <code>return</code> gives <code>undefined</code>. Extra arguments are ignored. Rest <code>...</code> collects the extras into an array.</p>\n",
    "plain": "JavaScript Functions function add(a, b = 0) { return a + b; } const sub = function (a, b) { return a - b; }; function total(...nums) { return nums.reduce((s, n) => s + n, 0); } No return gives undefined . Extra arguments are ignored. Rest ... collects the extras into an array."
  },
  {
    "id": "javascript-arrow-functions",
    "lang": "JavaScript",
    "title": "Arrow functions",
    "html": "<pre><code class=\"language-js\">const double = (n) =&gt; n * 2;\nconst greet = (name) =&gt; { const text = `Hi ${name}`; return text; };\n</code></pre>\n<p>Short body without braces returns implicitly. Arrow functions do not bind their own <code>this</code>, so avoid them as object methods or handlers that need <code>this</code>.</p>\n",
    "plain": "JavaScript Arrow functions const double = (n) => n * 2; const greet = (name) => { const text = `Hi ${name}`; return text; }; Short body without braces returns implicitly. Arrow functions do not bind their own this , so avoid them as object methods or handlers that need this ."
  },
  {
    "id": "javascript-arrays",
    "lang": "JavaScript",
    "title": "Arrays",
    "html": "<pre><code class=\"language-js\">const nums = [3, 1, 4, 1, 5];\nnums.length;        // 5\nnums.push(9);       // add to end\nnums.pop();         // remove from end\nnums.slice(1, 3);   // copy, no mutation\nnums.splice(1, 2);  // removes items, mutates\nnums.includes(4);   // true\nnums.join(&quot;, &quot;);    // &quot;3, 1, 4, 1, 5&quot;\n</code></pre>\n<p><code>push</code> and <code>pop</code> change the array. <code>slice</code> copies. <code>splice</code> edits in place and returns the removed items.</p>\n",
    "plain": "JavaScript Arrays const nums = [3, 1, 4, 1, 5]; nums.length; // 5 nums.push(9); // add to end nums.pop(); // remove from end nums.slice(1, 3); // copy, no mutation nums.splice(1, 2); // removes items, mutates nums.includes(4); // true nums.join(\", \"); // \"3, 1, 4, 1, 5\" push and pop change the array. slice copies. splice edits in place and returns the removed items."
  },
  {
    "id": "javascript-array-methods",
    "lang": "JavaScript",
    "title": "Array methods",
    "html": "<pre><code class=\"language-js\">const rooms = [{ name: &quot;A&quot;, price: 80, free: true }, { name: &quot;B&quot;, price: 120, free: false }, { name: &quot;C&quot;, price: 60, free: true }];\nrooms.map((r) =&gt; r.name);                   // [&quot;A&quot;, &quot;B&quot;, &quot;C&quot;]\nrooms.filter((r) =&gt; r.free);                // A and C\nrooms.reduce((sum, r) =&gt; sum + r.price, 0); // 260\nrooms.find((r) =&gt; r.price &lt; 100);           // A\nrooms.sort((a, b) =&gt; a.price - b.price);    // cheapest first\nrooms.some((r) =&gt; !r.free);                 // true\nrooms.every((r) =&gt; r.price &gt; 50);           // true\n</code></pre>\n<p><code>map</code>, <code>filter</code> and <code>slice</code> return new arrays. <code>sort</code> and <code>reverse</code> mutate. Without a compare function, <code>sort</code> compares strings and puts <code>100</code> before <code>20</code>.</p>\n",
    "plain": "JavaScript Array methods const rooms = [{ name: \"A\", price: 80, free: true }, { name: \"B\", price: 120, free: false }, { name: \"C\", price: 60, free: true }]; rooms.map((r) => r.name); // [\"A\", \"B\", \"C\"] rooms.filter((r) => r.free); // A and C rooms.reduce((sum, r) => sum + r.price, 0); // 260 rooms.find((r) => r.price < 100); // A rooms.sort((a, b) => a.price - b.price); // cheapest first rooms.some((r) => !r.free); // true rooms.every((r) => r.price > 50); // true map , filter and slice return new arrays. sort and reverse mutate. Without a compare function, sort compares strings and puts 100 before 20 ."
  },
  {
    "id": "javascript-objects",
    "lang": "JavaScript",
    "title": "Objects",
    "html": "<pre><code class=\"language-js\">const user = { name: &quot;Anna&quot;, age: 30, greet() { return `Hi ${this.name}`; } };\nuser.name;          // dot access\nuser[&quot;name&quot;];       // bracket access, for dynamic keys\nuser.city = &quot;Budapest&quot;;\ndelete user.age;\nObject.keys(user);     // [&quot;name&quot;, &quot;city&quot;, &quot;greet&quot;]\nObject.entries(user);  // [[&quot;name&quot;,&quot;Anna&quot;], ...]\n&quot;name&quot; in user;        // true\n</code></pre>\n",
    "plain": "JavaScript Objects const user = { name: \"Anna\", age: 30, greet() { return `Hi ${this.name}`; } }; user.name; // dot access user[\"name\"]; // bracket access, for dynamic keys user.city = \"Budapest\"; delete user.age; Object.keys(user); // [\"name\", \"city\", \"greet\"] Object.entries(user); // [[\"name\",\"Anna\"], ...] \"name\" in user; // true"
  },
  {
    "id": "javascript-destructuring",
    "lang": "JavaScript",
    "title": "Destructuring",
    "html": "<pre><code class=\"language-js\">const { name, age = 18 } = user;\nconst { name: userName } = user;        // rename\nconst [first, second, ...rest] = [1, 2, 3, 4];\nfunction show({ name, price }) { return `${name}: ${price}`; }\n</code></pre>\n<p>Defaults apply only when the value is <code>undefined</code>, not when it is <code>null</code>.</p>\n",
    "plain": "JavaScript Destructuring const { name, age = 18 } = user; const { name: userName } = user; // rename const [first, second, ...rest] = [1, 2, 3, 4]; function show({ name, price }) { return `${name}: ${price}`; } Defaults apply only when the value is undefined , not when it is null ."
  },
  {
    "id": "javascript-spread",
    "lang": "JavaScript",
    "title": "Spread",
    "html": "<pre><code class=\"language-js\">const a = [1, 2];\nconst b = [...a, 3];                 // [1, 2, 3]\nconst merged = { ...user, age: 31 }; // shallow copy plus override\nMath.max(...a);                      // spread into arguments\n</code></pre>\n<p>Spread copies one level. Nested objects still share references.</p>\n",
    "plain": "JavaScript Spread const a = [1, 2]; const b = [...a, 3]; // [1, 2, 3] const merged = { ...user, age: 31 }; // shallow copy plus override Math.max(...a); // spread into arguments Spread copies one level. Nested objects still share references."
  },
  {
    "id": "javascript-strings",
    "lang": "JavaScript",
    "title": "Strings",
    "html": "<pre><code class=\"language-js\">const s = &quot;  Hotel Room  &quot;;\ns.trim();             // &quot;Hotel Room&quot;\ns.includes(&quot;Room&quot;);   // true\ns.replace(&quot;Room&quot;, &quot;Suite&quot;);\ns.split(&quot; &quot;);         // array of words\n&quot;abc&quot;.padStart(5, &quot;-&quot;); // &quot;--abc&quot;\n`${user.name} is ${user.age}`;\n</code></pre>\n<p>Strings are immutable. Every method returns a new string.</p>\n",
    "plain": "JavaScript Strings const s = \" Hotel Room \"; s.trim(); // \"Hotel Room\" s.includes(\"Room\"); // true s.replace(\"Room\", \"Suite\"); s.split(\" \"); // array of words \"abc\".padStart(5, \"-\"); // \"--abc\" `${user.name} is ${user.age}`; Strings are immutable. Every method returns a new string."
  },
  {
    "id": "javascript-dates",
    "lang": "JavaScript",
    "title": "Dates",
    "html": "<pre><code class=\"language-js\">const d = new Date(&quot;2026-11-10T14:00:00&quot;);\nd.getFullYear();\nd.getMonth();      // 0 based, January is 0\nd.getDate();       // day of month\nd.toISOString();   // &quot;2026-11-10T13:00:00.000Z&quot;\nDate.now();        // milliseconds since 1970\n</code></pre>\n<p>Month is zero based, which causes most date bugs. Compare with <code>getTime()</code>. <code>new Date(&quot;2026-11-10&quot;)</code> is UTC midnight; <code>new Date(2026, 10, 10)</code> is local.</p>\n",
    "plain": "JavaScript Dates const d = new Date(\"2026-11-10T14:00:00\"); d.getFullYear(); d.getMonth(); // 0 based, January is 0 d.getDate(); // day of month d.toISOString(); // \"2026-11-10T13:00:00.000Z\" Date.now(); // milliseconds since 1970 Month is zero based, which causes most date bugs. Compare with getTime() . new Date(\"2026-11-10\") is UTC midnight; new Date(2026, 10, 10) is local."
  },
  {
    "id": "javascript-json",
    "lang": "JavaScript",
    "title": "JSON",
    "html": "<pre><code class=\"language-js\">const text = JSON.stringify({ id: 1, name: &quot;Anna&quot; });\nconst obj = JSON.parse(&#39;{&quot;id&quot;:1,&quot;name&quot;:&quot;Anna&quot;}&#39;);\nJSON.stringify(obj, null, 2); // pretty print\n</code></pre>\n<p><code>JSON.parse</code> throws on bad input. Functions and <code>undefined</code> vanish during stringify.</p>\n",
    "plain": "JavaScript JSON const text = JSON.stringify({ id: 1, name: \"Anna\" }); const obj = JSON.parse('{\"id\":1,\"name\":\"Anna\"}'); JSON.stringify(obj, null, 2); // pretty print JSON.parse throws on bad input. Functions and undefined vanish during stringify."
  },
  {
    "id": "javascript-localstorage",
    "lang": "JavaScript",
    "title": "localStorage",
    "html": "<pre><code class=\"language-js\">localStorage.setItem(&quot;token&quot;, &quot;abc123&quot;);\nlocalStorage.getItem(&quot;token&quot;);   // string or null\nlocalStorage.setItem(&quot;user&quot;, JSON.stringify(user));\nconst saved = JSON.parse(localStorage.getItem(&quot;user&quot;) || &quot;null&quot;);\n</code></pre>\n<p>Only strings are stored. Never store secrets; any script on the page can read them.</p>\n",
    "plain": "JavaScript localStorage localStorage.setItem(\"token\", \"abc123\"); localStorage.getItem(\"token\"); // string or null localStorage.setItem(\"user\", JSON.stringify(user)); const saved = JSON.parse(localStorage.getItem(\"user\") || \"null\"); Only strings are stored. Never store secrets; any script on the page can read them."
  },
  {
    "id": "javascript-dom-selection-and-creation",
    "lang": "JavaScript",
    "title": "DOM selection and creation",
    "html": "<pre><code class=\"language-js\">const one = document.querySelector(&quot;.card&quot;);\nconst all = document.querySelectorAll(&quot;.card&quot;); // static list\none.textContent = &quot;New text&quot;;\none.classList.add(&quot;active&quot;);\none.dataset.id;   // reads data-id\nconst li = document.createElement(&quot;li&quot;);\nli.textContent = &quot;New room&quot;;\none.append(li);\nli.remove();\n</code></pre>\n<p><code>innerHTML +=</code> re-parses the block and drops listeners. Build nodes instead.</p>\n",
    "plain": "JavaScript DOM selection and creation const one = document.querySelector(\".card\"); const all = document.querySelectorAll(\".card\"); // static list one.textContent = \"New text\"; one.classList.add(\"active\"); one.dataset.id; // reads data-id const li = document.createElement(\"li\"); li.textContent = \"New room\"; one.append(li); li.remove(); innerHTML += re-parses the block and drops listeners. Build nodes instead."
  },
  {
    "id": "javascript-events",
    "lang": "JavaScript",
    "title": "Events",
    "html": "<pre><code class=\"language-js\">document.querySelector(&quot;#book&quot;).addEventListener(&quot;click&quot;, (event) =&gt; {\n  event.preventDefault();\n  console.log(event.target);\n});\ndocument.querySelector(&quot;form&quot;).addEventListener(&quot;submit&quot;, (e) =&gt; {\n  e.preventDefault();\n  console.log(Object.fromEntries(new FormData(e.target)));\n});\ndocument.addEventListener(&quot;keydown&quot;, (e) =&gt; { if (e.key === &quot;Escape&quot;) closeModal(); });\n</code></pre>\n<p><code>preventDefault</code> stops the browser action. <code>stopPropagation</code> stops bubbling. Delegate on a parent and check <code>event.target</code> for re-rendered children.</p>\n",
    "plain": "JavaScript Events document.querySelector(\"#book\").addEventListener(\"click\", (event) => { event.preventDefault(); console.log(event.target); }); document.querySelector(\"form\").addEventListener(\"submit\", (e) => { e.preventDefault(); console.log(Object.fromEntries(new FormData(e.target))); }); document.addEventListener(\"keydown\", (e) => { if (e.key === \"Escape\") closeModal(); }); preventDefault stops the browser action. stopPropagation stops bubbling. Delegate on a parent and check event.target for re-rendered children."
  },
  {
    "id": "javascript-forms",
    "lang": "JavaScript",
    "title": "Forms",
    "html": "<pre><code class=\"language-js\">const input = document.querySelector(&quot;#email&quot;);\ninput.value;      // current text\ninput.checked;    // checkbox state\ninput.focus();\ninput.setCustomValidity(&quot;&quot;); // clear a custom error\n</code></pre>\n<p>Read on <code>input</code> for live feedback, on <code>change</code> for selects. Validate on submit and blur, not every keystroke.</p>\n",
    "plain": "JavaScript Forms const input = document.querySelector(\"#email\"); input.value; // current text input.checked; // checkbox state input.focus(); input.setCustomValidity(\"\"); // clear a custom error Read on input for live feedback, on change for selects. Validate on submit and blur, not every keystroke."
  },
  {
    "id": "javascript-fetch-with-async-await",
    "lang": "JavaScript",
    "title": "fetch with async/await",
    "html": "<pre><code class=\"language-js\">async function loadRooms() {\n  const res = await fetch(&quot;/api/rooms&quot;);\n  if (!res.ok) throw new Error(`HTTP ${res.status}`);\n  return res.json();\n}\nasync function sendBooking(payload) {\n  const res = await fetch(&quot;/api/bookings&quot;, {\n    method: &quot;POST&quot;,\n    headers: { &quot;Content-Type&quot;: &quot;application/json&quot; },\n    body: JSON.stringify(payload),\n  });\n  if (!res.ok) throw new Error(&quot;Booking failed&quot;);\n  return res.json();\n}\n</code></pre>\n<p><code>fetch</code> rejects only on network failure. A 404 resolves, so check <code>res.ok</code>. <code>res.json()</code> returns a promise, hence the second <code>await</code>.</p>\n",
    "plain": "JavaScript fetch with async/await async function loadRooms() { const res = await fetch(\"/api/rooms\"); if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); } async function sendBooking(payload) { const res = await fetch(\"/api/bookings\", { method: \"POST\", headers: { \"Content-Type\": \"application/json\" }, body: JSON.stringify(payload), }); if (!res.ok) throw new Error(\"Booking failed\"); return res.json(); } fetch rejects only on network failure. A 404 resolves, so check res.ok . res.json() returns a promise, hence the second await ."
  },
  {
    "id": "javascript-error-handling",
    "lang": "JavaScript",
    "title": "Error handling",
    "html": "<pre><code class=\"language-js\">try {\n  const data = JSON.parse(text);\n  save(data);\n} catch (err) {\n  console.error(&quot;Bad JSON:&quot;, err.message);\n} finally {\n  spinner.hidden = true;\n}\n</code></pre>\n<p><code>finally</code> always runs. Rethrow when the caller must know: <code>throw new Error(&quot;context&quot;, { cause: err })</code>. Custom errors extend <code>Error</code>.</p>\n",
    "plain": "JavaScript Error handling try { const data = JSON.parse(text); save(data); } catch (err) { console.error(\"Bad JSON:\", err.message); } finally { spinner.hidden = true; } finally always runs. Rethrow when the caller must know: throw new Error(\"context\", { cause: err }) . Custom errors extend Error ."
  },
  {
    "id": "javascript-classes",
    "lang": "JavaScript",
    "title": "Classes",
    "html": "<pre><code class=\"language-js\">class Room {\n    #price; // private field\n\n    constructor(name, price) {\n        this.name = name;\n        this.#price = price;\n    }\n\n    get price() {\n        return this.#price;\n    }\n\n    label() {\n        return `${this.name}: ${this.#price} EUR`;\n    }\n\n    static from(row) {\n        return new Room(row.name, row.price);\n    }\n}\n\nconst room = new Room(&quot;Double&quot;, 80);\nconsole.log(room.label());\nconsole.log(Room.from({ name: &quot;Single&quot;, price: 50 }).price);\n</code></pre>\n<p>A class groups data and behaviour. <code>constructor</code> runs on <code>new</code>. A <code>get</code> accessor is read like a property. <code>static</code> belongs to the class, not an instance. <code>#field</code> is truly private.</p>\n",
    "plain": "JavaScript Classes class Room { #price; // private field constructor(name, price) { this.name = name; this.#price = price; } get price() { return this.#price; } label() { return `${this.name}: ${this.#price} EUR`; } static from(row) { return new Room(row.name, row.price); } } const room = new Room(\"Double\", 80); console.log(room.label()); console.log(Room.from({ name: \"Single\", price: 50 }).price); A class groups data and behaviour. constructor runs on new . A get accessor is read like a property. static belongs to the class, not an instance. #field is truly private."
  },
  {
    "id": "javascript-promises",
    "lang": "JavaScript",
    "title": "Promises",
    "html": "<pre><code class=\"language-js\">function loadRooms() {\n    return new Promise((resolve, reject) =&gt; {\n        setTimeout(() =&gt; {\n            const ok = true;\n            if (ok) resolve([{ name: &quot;A&quot; }]);\n            else reject(new Error(&quot;Network down&quot;));\n        }, 500);\n    });\n}\n\nloadRooms()\n    .then((rooms) =&gt; console.log(rooms))\n    .catch((err) =&gt; console.error(err.message))\n    .finally(() =&gt; console.log(&quot;done&quot;));\n\nconst [rooms, guests] = await Promise.all([loadRooms(), loadGuests()]);\n</code></pre>\n<p>A promise is a future value. <code>then</code> handles success, <code>catch</code> failure, <code>finally</code> always runs. <code>await</code> pauses the async function until the promise settles. <code>Promise.all</code> waits for all and rejects on the first failure.</p>\n",
    "plain": "JavaScript Promises function loadRooms() { return new Promise((resolve, reject) => { setTimeout(() => { const ok = true; if (ok) resolve([{ name: \"A\" }]); else reject(new Error(\"Network down\")); }, 500); }); } loadRooms() .then((rooms) => console.log(rooms)) .catch((err) => console.error(err.message)) .finally(() => console.log(\"done\")); const [rooms, guests] = await Promise.all([loadRooms(), loadGuests()]); A promise is a future value. then handles success, catch failure, finally always runs. await pauses the async function until the promise settles. Promise.all waits for all and rejects on the first failure."
  },
  {
    "id": "javascript-map-and-set",
    "lang": "JavaScript",
    "title": "Map and Set",
    "html": "<pre><code class=\"language-js\">const counts = new Map();\ncounts.set(&quot;Anna&quot;, 2);\ncounts.set(&quot;Ben&quot;, 1);\ncounts.set(&quot;Anna&quot;, counts.get(&quot;Anna&quot;) + 1);\nconsole.log(counts.get(&quot;Anna&quot;)); // 3\nconsole.log(counts.has(&quot;Ben&quot;));  // true\nconsole.log(counts.size);        // 2\n\nfor (const [name, count] of counts) {\n    console.log(name, count);\n}\n\nconst unique = new Set([&quot;A&quot;, &quot;B&quot;, &quot;A&quot;]);\nconsole.log(unique.size);     // 2\nconsole.log(unique.has(&quot;B&quot;)); // true\nconst list = [...unique];     // back to an array\n</code></pre>\n<p>A <code>Map</code> keeps key order and accepts any key type. A plain object only has string and symbol keys. A <code>Set</code> stores unique values. Both are iterable with <code>for...of</code>.</p>\n",
    "plain": "JavaScript Map and Set const counts = new Map(); counts.set(\"Anna\", 2); counts.set(\"Ben\", 1); counts.set(\"Anna\", counts.get(\"Anna\") + 1); console.log(counts.get(\"Anna\")); // 3 console.log(counts.has(\"Ben\")); // true console.log(counts.size); // 2 for (const [name, count] of counts) { console.log(name, count); } const unique = new Set([\"A\", \"B\", \"A\"]); console.log(unique.size); // 2 console.log(unique.has(\"B\")); // true const list = [...unique]; // back to an array A Map keeps key order and accepts any key type. A plain object only has string and symbol keys. A Set stores unique values. Both are iterable with for...of ."
  },
  {
    "id": "javascript-regular-expressions",
    "lang": "JavaScript",
    "title": "Regular expressions",
    "html": "<pre><code class=\"language-js\">const email = &quot;book@example.com&quot;;\nconst pattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n\nconsole.log(pattern.test(email));        // true\nconsole.log(email.match(/@(.+)$/)[1]);   // example.com\nconsole.log(&quot;a-b-c&quot;.replace(/-/g, &quot;_&quot;)); // a_b_c\nconsole.log(&quot;2026-11-10&quot;.split(/-/));    // [&quot;2026&quot;, &quot;11&quot;, &quot;10&quot;]\n</code></pre>\n<p><code>test</code> returns a boolean, <code>match</code> returns the match array, <code>replace</code> swaps text, <code>split</code> cuts a string. Flags: <code>g</code> all matches, <code>i</code> ignore case, <code>m</code> multiline. Escape a literal dot as <code>\\.</code>.</p>\n",
    "plain": "JavaScript Regular expressions const email = \"book@example.com\"; const pattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/; console.log(pattern.test(email)); // true console.log(email.match(/@(.+)$/)[1]); // example.com console.log(\"a-b-c\".replace(/-/g, \"_\")); // a_b_c console.log(\"2026-11-10\".split(/-/)); // [\"2026\", \"11\", \"10\"] test returns a boolean, match returns the match array, replace swaps text, split cuts a string. Flags: g all matches, i ignore case, m multiline. Escape a literal dot as \\. ."
  },
  {
    "id": "javascript-timers",
    "lang": "JavaScript",
    "title": "Timers",
    "html": "<pre><code class=\"language-js\">const timeout = setTimeout(() =&gt; {\n    console.log(&quot;runs once&quot;);\n}, 1000);\n\nconst interval = setInterval(() =&gt; {\n    console.log(&quot;every second&quot;);\n}, 1000);\n\nclearTimeout(timeout);\nclearInterval(interval);\n</code></pre>\n<p><code>setTimeout</code> runs once after a delay; <code>setInterval</code> repeats. The delay is milliseconds, not seconds. Store the id so you can cancel it, especially in a React cleanup function.</p>\n",
    "plain": "JavaScript Timers const timeout = setTimeout(() => { console.log(\"runs once\"); }, 1000); const interval = setInterval(() => { console.log(\"every second\"); }, 1000); clearTimeout(timeout); clearInterval(interval); setTimeout runs once after a delay; setInterval repeats. The delay is milliseconds, not seconds. Store the id so you can cancel it, especially in a React cleanup function."
  },
  {
    "id": "javascript-dom-traversal",
    "lang": "JavaScript",
    "title": "DOM traversal",
    "html": "<pre><code class=\"language-js\">const card = document.querySelector(&quot;.card&quot;);\n\ncard.parentElement;          // the container\ncard.children;               // element children\ncard.firstElementChild;      // first element child\ncard.lastElementChild;       // last element child\ncard.nextElementSibling;     // next element\ncard.previousElementSibling; // previous element\ncard.closest(&quot;.grid&quot;);       // nearest ancestor matching a selector\ncard.matches(&quot;.card.active&quot;); // true or false\n</code></pre>\n<p><code>children</code> contains elements only. <code>childNodes</code> also contains text and comments. <code>closest</code> walks up the tree and is useful for event delegation.</p>\n",
    "plain": "JavaScript DOM traversal const card = document.querySelector(\".card\"); card.parentElement; // the container card.children; // element children card.firstElementChild; // first element child card.lastElementChild; // last element child card.nextElementSibling; // next element card.previousElementSibling; // previous element card.closest(\".grid\"); // nearest ancestor matching a selector card.matches(\".card.active\"); // true or false children contains elements only. childNodes also contains text and comments. closest walks up the tree and is useful for event delegation."
  },
  {
    "id": "javascript-math-and-random",
    "lang": "JavaScript",
    "title": "Math and random",
    "html": "<pre><code class=\"language-js\">Math.round(4.6);   // 5\nMath.floor(4.9);   // 4\nMath.ceil(4.1);    // 5\nMath.min(3, 1, 2); // 1\nMath.max(3, 1, 2); // 3\nMath.abs(-5);      // 5\nMath.random();     // 0 up to, not including, 1\n\nconst dice = Math.floor(Math.random() * 6) + 1; // 1 to 6\nconst pick = list[Math.floor(Math.random() * list.length)];\n</code></pre>\n<p><code>Math.random</code> never returns 1, so <code>Math.floor(Math.random() * n)</code> gives 0 to n-1. Add 1 for a dice. For a random array item, multiply by <code>list.length</code>.</p>\n",
    "plain": "JavaScript Math and random Math.round(4.6); // 5 Math.floor(4.9); // 4 Math.ceil(4.1); // 5 Math.min(3, 1, 2); // 1 Math.max(3, 1, 2); // 3 Math.abs(-5); // 5 Math.random(); // 0 up to, not including, 1 const dice = Math.floor(Math.random() * 6) + 1; // 1 to 6 const pick = list[Math.floor(Math.random() * list.length)]; Math.random never returns 1, so Math.floor(Math.random() * n) gives 0 to n-1. Add 1 for a dice. For a random array item, multiply by list.length ."
  },
  {
    "id": "javascript-modules",
    "lang": "JavaScript",
    "title": "Modules",
    "html": "<pre><code class=\"language-js\">// math.js\nexport const add = (a, b) =&gt; a + b;\nexport default function multiply(a, b) { return a * b; }\n// app.js\nimport multiply, { add } from &quot;./math.js&quot;;\n</code></pre>\n<p>Named exports need braces on import, the default does not. In the browser the tag needs <code>type=&quot;module&quot;</code>. In Node use <code>.mjs</code> or <code>&quot;type&quot;: &quot;module&quot;</code> in <code>package.json</code>.</p>\n",
    "plain": "JavaScript Modules // math.js export const add = (a, b) => a + b; export default function multiply(a, b) { return a * b; } // app.js import multiply, { add } from \"./math.js\"; Named exports need braces on import, the default does not. In the browser the tag needs type=\"module\" . In Node use .mjs or \"type\": \"module\" in package.json ."
  },
  {
    "id": "react-create-the-project",
    "lang": "React",
    "title": "Create the project",
    "html": "<pre><code class=\"language-bash\">npm create vite@latest my-app -- --template react\ncd my-app\nnpm install\nnpm install axios react-router-dom react-icons\nnpm run dev\n</code></pre>\n<p>Vite serves the app on <code>http://localhost:5173</code> and reloads on save.</p>\n",
    "plain": "React Create the project npm create vite@latest my-app -- --template react cd my-app npm install npm install axios react-router-dom react-icons npm run dev Vite serves the app on http://localhost:5173 and reloads on save."
  },
  {
    "id": "react-jsx-rules",
    "lang": "React",
    "title": "JSX rules",
    "html": "<pre><code class=\"language-jsx\">function Card() {\n    const name = &#39;Danube View&#39;;\n    return (\n        &lt;article className=&quot;card&quot;&gt;\n            &lt;h2&gt;{name}&lt;/h2&gt;\n            &lt;p&gt;{2 + 3}&lt;/p&gt;\n        &lt;/article&gt;\n    );\n}\n</code></pre>\n<ul>\n<li>Return one parent element, or a fragment <code>&lt;&gt;...&lt;/&gt;</code>.</li>\n<li>Close every tag, including <code>&lt;img /&gt;</code> and <code>&lt;input /&gt;</code>.</li>\n<li>Use <code>className</code>, not <code>class</code>.</li>\n<li>Use <code>{expression}</code> for JavaScript.</li>\n<li>JavaScript comments inside JSX need <code>{/* ... */}</code>.</li>\n<li>A component name starts with a capital letter.</li>\n</ul>\n",
    "plain": "React JSX rules function Card() { const name = 'Danube View'; return ( <article className=\"card\"> <h2>{name}</h2> <p>{2 + 3}</p> </article> ); } Return one parent element, or a fragment <>...</> . Close every tag, including <img /> and <input /> . Use className , not class . Use {expression} for JavaScript. JavaScript comments inside JSX need {/* ... */} . A component name starts with a capital letter."
  },
  {
    "id": "react-components-and-props",
    "lang": "React",
    "title": "Components and props",
    "html": "<pre><code class=\"language-jsx\">function Badge({ text, tone = &#39;blue&#39; }) {\n    return &lt;span className={`badge badge-${tone}`}&gt;{text}&lt;/span&gt;;\n}\n\nfunction App() {\n    return &lt;Badge text=&quot;New&quot; tone=&quot;green&quot; /&gt;;\n}\n</code></pre>\n<p>Props are read only. A default value belongs in the destructuring pattern. Pass functions as props when a child needs to notify a parent:</p>\n<pre><code class=\"language-jsx\">function Button({ onClick, children }) {\n    return &lt;button onClick={onClick}&gt;{children}&lt;/button&gt;;\n}\n</code></pre>\n",
    "plain": "React Components and props function Badge({ text, tone = 'blue' }) { return <span className={`badge badge-${tone}`}>{text}</span>; } function App() { return <Badge text=\"New\" tone=\"green\" />; } Props are read only. A default value belongs in the destructuring pattern. Pass functions as props when a child needs to notify a parent: function Button({ onClick, children }) { return <button onClick={onClick}>{children}</button>; }"
  },
  {
    "id": "react-state",
    "lang": "React",
    "title": "State",
    "html": "<pre><code class=\"language-jsx\">import { useState } from &#39;react&#39;;\n\nfunction Counter() {\n    const [count, setCount] = useState(0);\n\n    return (\n        &lt;button onClick={() =&gt; setCount(count + 1)}&gt;\n            Clicked {count} times\n        &lt;/button&gt;\n    );\n}\n</code></pre>\n<p>For the next value based on the previous one, use the updater form:</p>\n<pre><code class=\"language-jsx\">setCount(current =&gt; current + 1);\n</code></pre>\n<p>Never mutate state directly. Replace objects and arrays:</p>\n<pre><code class=\"language-jsx\">setUser({ ...user, name: &#39;Anna&#39; });\nsetItems([...items, newItem]);\nsetItems(items.filter(item =&gt; item.id !== id));\n</code></pre>\n",
    "plain": "React State import { useState } from 'react'; function Counter() { const [count, setCount] = useState(0); return ( <button onClick={() => setCount(count + 1)}> Clicked {count} times </button> ); } For the next value based on the previous one, use the updater form: setCount(current => current + 1); Never mutate state directly. Replace objects and arrays: setUser({ ...user, name: 'Anna' }); setItems([...items, newItem]); setItems(items.filter(item => item.id !== id));"
  },
  {
    "id": "react-events",
    "lang": "React",
    "title": "Events",
    "html": "<pre><code class=\"language-jsx\">function Form() {\n    function handleSubmit(event) {\n        event.preventDefault();\n        console.log(&#39;sent&#39;);\n    }\n\n    return (\n        &lt;form onSubmit={handleSubmit}&gt;\n            &lt;button type=&quot;submit&quot;&gt;Send&lt;/button&gt;\n        &lt;/form&gt;\n    );\n}\n</code></pre>\n<p><code>event.preventDefault()</code> stops the browser from reloading the page on a form submit. Use an arrow function when you need to pass an argument:</p>\n<pre><code class=\"language-jsx\">&lt;button onClick={() =&gt; remove(item.id)}&gt;Delete&lt;/button&gt;\n</code></pre>\n<p>Do not call the function while rendering: <code>onClick={remove(item.id)}</code> runs immediately. Wrap it.</p>\n",
    "plain": "React Events function Form() { function handleSubmit(event) { event.preventDefault(); console.log('sent'); } return ( <form onSubmit={handleSubmit}> <button type=\"submit\">Send</button> </form> ); } event.preventDefault() stops the browser from reloading the page on a form submit. Use an arrow function when you need to pass an argument: <button onClick={() => remove(item.id)}>Delete</button> Do not call the function while rendering: onClick={remove(item.id)} runs immediately. Wrap it."
  },
  {
    "id": "react-lists-and-keys",
    "lang": "React",
    "title": "Lists and keys",
    "html": "<pre><code class=\"language-jsx\">&lt;ul&gt;\n    {hotels.map(hotel =&gt; (\n        &lt;li key={hotel.id}&gt;{hotel.name}&lt;/li&gt;\n    ))}\n&lt;/ul&gt;\n</code></pre>\n<p>The key must be stable and unique among siblings. Use a database id. Use the array index only when the list never reorders and never changes length.</p>\n",
    "plain": "React Lists and keys <ul> {hotels.map(hotel => ( <li key={hotel.id}>{hotel.name}</li> ))} </ul> The key must be stable and unique among siblings. Use a database id. Use the array index only when the list never reorders and never changes length."
  },
  {
    "id": "react-conditional-rendering",
    "lang": "React",
    "title": "Conditional rendering",
    "html": "<pre><code class=\"language-jsx\">{loading &amp;&amp; &lt;p&gt;Loading...&lt;/p&gt;}\n{error &amp;&amp; &lt;p className=&quot;error&quot;&gt;{error}&lt;/p&gt;}\n{!loading &amp;&amp; !error &amp;&amp; items.length === 0 &amp;&amp; &lt;p&gt;No data.&lt;/p&gt;}\n\n{user ? &lt;Dashboard user={user} /&gt; : &lt;Login /&gt;}\n</code></pre>\n<p><code>&amp;&amp;</code> returns the left side when it is falsy. A <code>0</code> would render as <code>0</code>, so use <code>items.length &gt; 0 &amp;&amp; ...</code> when the left side can be a number.</p>\n",
    "plain": "React Conditional rendering {loading && <p>Loading...</p>} {error && <p className=\"error\">{error}</p>} {!loading && !error && items.length === 0 && <p>No data.</p>} {user ? <Dashboard user={user} /> : <Login />} && returns the left side when it is falsy. A 0 would render as 0 , so use items.length > 0 && ... when the left side can be a number."
  },
  {
    "id": "react-forms",
    "lang": "React",
    "title": "Forms",
    "html": "<pre><code class=\"language-jsx\">function Search() {\n    const [word, setWord] = useState(&#39;&#39;);\n\n    function handleSubmit(event) {\n        event.preventDefault();\n        const trimmed = word.trim();\n        if (trimmed.length &lt; 3) {\n            return;\n        }\n        console.log(trimmed);\n    }\n\n    return (\n        &lt;form onSubmit={handleSubmit}&gt;\n            &lt;input\n                value={word}\n                onChange={event =&gt; setWord(event.target.value)}\n                placeholder=&quot;Search&quot;\n            /&gt;\n            &lt;button type=&quot;submit&quot;&gt;Search&lt;/button&gt;\n        &lt;/form&gt;\n    );\n}\n</code></pre>\n<p>A controlled input has <code>value</code> and <code>onChange</code>. An uncontrolled input uses <code>defaultValue</code> and a ref. The exam usually wants controlled.</p>\n",
    "plain": "React Forms function Search() { const [word, setWord] = useState(''); function handleSubmit(event) { event.preventDefault(); const trimmed = word.trim(); if (trimmed.length < 3) { return; } console.log(trimmed); } return ( <form onSubmit={handleSubmit}> <input value={word} onChange={event => setWord(event.target.value)} placeholder=\"Search\" /> <button type=\"submit\">Search</button> </form> ); } A controlled input has value and onChange . An uncontrolled input uses defaultValue and a ref. The exam usually wants controlled."
  },
  {
    "id": "react-useeffect",
    "lang": "React",
    "title": "useEffect",
    "html": "<pre><code class=\"language-jsx\">import { useEffect, useState } from &#39;react&#39;;\n\nfunction Hotels() {\n    const [hotels, setHotels] = useState([]);\n\n    useEffect(() =&gt; {\n        let active = true;\n\n        fetch(&#39;/api/hotels&#39;)\n            .then(response =&gt; response.json())\n            .then(data =&gt; {\n                if (active) {\n                    setHotels(data);\n                }\n            });\n\n        return () =&gt; {\n            active = false;\n        };\n    }, []);\n\n    return &lt;ul&gt;{hotels.map(h =&gt; &lt;li key={h.id}&gt;{h.name}&lt;/li&gt;)}&lt;/ul&gt;;\n}\n</code></pre>\n<p>The dependency array controls when the effect runs:</p>\n<table>\n<thead>\n<tr>\n<th>Array</th>\n<th>When</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>[]</code></td>\n<td>Once after the first render</td>\n</tr>\n<tr>\n<td><code>[id]</code></td>\n<td>After the first render and whenever <code>id</code> changes</td>\n</tr>\n<tr>\n<td>no array</td>\n<td>After every render, usually a bug</td>\n</tr>\n</tbody></table>\n<p>React StrictMode runs effects twice in development. The cleanup function and the <code>active</code> flag keep the second run from setting state after the first one is gone. This is normal, not a production bug.</p>\n<p>Do not use an effect for a value you can calculate during render. Derive it instead.</p>\n",
    "plain": "React useEffect import { useEffect, useState } from 'react'; function Hotels() { const [hotels, setHotels] = useState([]); useEffect(() => { let active = true; fetch('/api/hotels') .then(response => response.json()) .then(data => { if (active) { setHotels(data); } }); return () => { active = false; }; }, []); return <ul>{hotels.map(h => <li key={h.id}>{h.name}</li>)}</ul>; } The dependency array controls when the effect runs: Array When [] Once after the first render [id] After the first render and whenever id changes no array After every render, usually a bug React StrictMode runs effects twice in development. The cleanup function and the active flag keep the second run from setting state after the first one is gone. This is normal, not a production bug. Do not use an effect for a value you can calculate during render. Derive it instead."
  },
  {
    "id": "react-fetch-with-loading-and-error-states",
    "lang": "React",
    "title": "Fetch with loading and error states",
    "html": "<pre><code class=\"language-jsx\">const [data, setData] = useState([]);\nconst [loading, setLoading] = useState(true);\nconst [error, setError] = useState(&#39;&#39;);\n\nuseEffect(() =&gt; {\n    let active = true;\n    setLoading(true);\n    setError(&#39;&#39;);\n\n    getHotels()\n        .then(result =&gt; {\n            if (active) {\n                setData(result);\n            }\n        })\n        .catch(() =&gt; {\n            if (active) {\n                setError(&#39;Could not load data.&#39;);\n            }\n        })\n        .finally(() =&gt; {\n            if (active) {\n                setLoading(false);\n            }\n        });\n\n    return () =&gt; {\n        active = false;\n    };\n}, []);\n</code></pre>\n<p>Always render all three states. A blank screen during a slow request looks like a broken app.</p>\n",
    "plain": "React Fetch with loading and error states const [data, setData] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); useEffect(() => { let active = true; setLoading(true); setError(''); getHotels() .then(result => { if (active) { setData(result); } }) .catch(() => { if (active) { setError('Could not load data.'); } }) .finally(() => { if (active) { setLoading(false); } }); return () => { active = false; }; }, []); Always render all three states. A blank screen during a slow request looks like a broken app."
  },
  {
    "id": "react-axios-instance",
    "lang": "React",
    "title": "Axios instance",
    "html": "<pre><code class=\"language-js\">import axios from &#39;axios&#39;;\n\nconst api = axios.create({\n    baseURL: import.meta.env.VITE_API_URL || &#39;/api&#39;,\n    timeout: 10000,\n});\n\nexport async function getHotels() {\n    const { data } = await api.get(&#39;/hotels&#39;);\n    return data;\n}\n</code></pre>\n<p>Axios throws on 4xx and 5xx, so a <code>catch</code> catches both network errors and error responses. <code>fetch</code> does not throw on 404, which is a common source of confusion.</p>\n",
    "plain": "React Axios instance import axios from 'axios'; const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', timeout: 10000, }); export async function getHotels() { const { data } = await api.get('/hotels'); return data; } Axios throws on 4xx and 5xx, so a catch catches both network errors and error responses. fetch does not throw on 404, which is a common source of confusion."
  },
  {
    "id": "react-react-router",
    "lang": "React",
    "title": "React Router",
    "html": "<pre><code class=\"language-jsx\">import { BrowserRouter, Routes, Route } from &#39;react-router-dom&#39;;\n\nfunction App() {\n    return (\n        &lt;BrowserRouter&gt;\n            &lt;Routes&gt;\n                &lt;Route path=&quot;/&quot; element={&lt;Home /&gt;} /&gt;\n                &lt;Route path=&quot;/hotels/:id&quot; element={&lt;Bookings /&gt;} /&gt;\n                &lt;Route path=&quot;/search/:searchedWord&quot; element={&lt;SearchResult /&gt;} /&gt;\n                &lt;Route path=&quot;*&quot; element={&lt;NotFound /&gt;} /&gt;\n            &lt;/Routes&gt;\n        &lt;/BrowserRouter&gt;\n    );\n}\n</code></pre>\n<p><code>main.jsx</code> usually holds the <code>BrowserRouter</code> and <code>App</code> holds the <code>Routes</code>. Either split works, but keep one router.</p>\n",
    "plain": "React React Router import { BrowserRouter, Routes, Route } from 'react-router-dom'; function App() { return ( <BrowserRouter> <Routes> <Route path=\"/\" element={<Home />} /> <Route path=\"/hotels/:id\" element={<Bookings />} /> <Route path=\"/search/:searchedWord\" element={<SearchResult />} /> <Route path=\"*\" element={<NotFound />} /> </Routes> </BrowserRouter> ); } main.jsx usually holds the BrowserRouter and App holds the Routes . Either split works, but keep one router."
  },
  {
    "id": "react-route-parameters-and-navigation",
    "lang": "React",
    "title": "Route parameters and navigation",
    "html": "<pre><code class=\"language-jsx\">import { Link, useNavigate, useParams } from &#39;react-router-dom&#39;;\n\nfunction Bookings() {\n    const { id } = useParams();\n    const navigate = useNavigate();\n\n    return (\n        &lt;&gt;\n            &lt;Link to=&quot;/&quot;&gt;Back&lt;/Link&gt;\n            &lt;button onClick={() =&gt; navigate(`/hotels/${id}`)}&gt;Open&lt;/button&gt;\n        &lt;/&gt;\n    );\n}\n</code></pre>\n<p><code>useParams</code> returns strings. Convert with <code>Number(id)</code> when the API needs a number.</p>\n<p>The effect must depend on the route parameter:</p>\n<pre><code class=\"language-jsx\">useEffect(() =&gt; {\n    getBookingsByHotel(id);\n}, [id]);\n</code></pre>\n<p>Without <code>[id]</code>, navigating from hotel 1 to hotel 2 keeps the old data.</p>\n",
    "plain": "React Route parameters and navigation import { Link, useNavigate, useParams } from 'react-router-dom'; function Bookings() { const { id } = useParams(); const navigate = useNavigate(); return ( <> <Link to=\"/\">Back</Link> <button onClick={() => navigate(`/hotels/${id}`)}>Open</button> </> ); } useParams returns strings. Convert with Number(id) when the API needs a number. The effect must depend on the route parameter: useEffect(() => { getBookingsByHotel(id); }, [id]); Without [id] , navigating from hotel 1 to hotel 2 keeps the old data."
  },
  {
    "id": "react-encode-a-search-word",
    "lang": "React",
    "title": "Encode a search word",
    "html": "<pre><code class=\"language-jsx\">const word = &#39;Budapest center&#39;;\nnavigate(`/search/${encodeURIComponent(word)}`);\n</code></pre>\n<p><code>useParams</code> decodes the value automatically. Without <code>encodeURIComponent</code>, a slash or a question mark breaks the route.</p>\n",
    "plain": "React Encode a search word const word = 'Budapest center'; navigate(`/search/${encodeURIComponent(word)}`); useParams decodes the value automatically. Without encodeURIComponent , a slash or a question mark breaks the route."
  },
  {
    "id": "react-custom-hook",
    "lang": "React",
    "title": "Custom hook",
    "html": "<pre><code class=\"language-jsx\">function useHotels() {\n    const [hotels, setHotels] = useState([]);\n    const [loading, setLoading] = useState(true);\n    const [error, setError] = useState(&#39;&#39;);\n\n    useEffect(() =&gt; {\n        let active = true;\n        getHotels()\n            .then(data =&gt; active &amp;&amp; setHotels(data))\n            .catch(() =&gt; active &amp;&amp; setError(&#39;Could not load hotels.&#39;))\n            .finally(() =&gt; active &amp;&amp; setLoading(false));\n        return () =&gt; {\n            active = false;\n        };\n    }, []);\n\n    return { hotels, loading, error };\n}\n</code></pre>\n<p>A custom hook is a function whose name starts with <code>use</code> and that calls other hooks. It shares logic, not state. Two components that call <code>useHotels</code> get two separate states.</p>\n",
    "plain": "React Custom hook function useHotels() { const [hotels, setHotels] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); useEffect(() => { let active = true; getHotels() .then(data => active && setHotels(data)) .catch(() => active && setError('Could not load hotels.')) .finally(() => active && setLoading(false)); return () => { active = false; }; }, []); return { hotels, loading, error }; } A custom hook is a function whose name starts with use and that calls other hooks. It shares logic, not state. Two components that call useHotels get two separate states."
  },
  {
    "id": "react-context",
    "lang": "React",
    "title": "Context",
    "html": "<pre><code class=\"language-jsx\">import { createContext, useContext, useState } from &#39;react&#39;;\n\nconst ThemeContext = createContext(null);\n\nfunction ThemeProvider({ children }) {\n    const [dark, setDark] = useState(false);\n    return (\n        &lt;ThemeContext.Provider value={{ dark, setDark }}&gt;\n            {children}\n        &lt;/ThemeContext.Provider&gt;\n    );\n}\n\nfunction Toggle() {\n    const { dark, setDark } = useContext(ThemeContext);\n    return &lt;button onClick={() =&gt; setDark(!dark)}&gt;Toggle&lt;/button&gt;;\n}\n</code></pre>\n<p>Use context for a value that many components need. Do not put every piece of state in a global store for a three-page exam app.</p>\n",
    "plain": "React Context import { createContext, useContext, useState } from 'react'; const ThemeContext = createContext(null); function ThemeProvider({ children }) { const [dark, setDark] = useState(false); return ( <ThemeContext.Provider value={{ dark, setDark }}> {children} </ThemeContext.Provider> ); } function Toggle() { const { dark, setDark } = useContext(ThemeContext); return <button onClick={() => setDark(!dark)}>Toggle</button>; } Use context for a value that many components need. Do not put every piece of state in a global store for a three-page exam app."
  },
  {
    "id": "react-css-in-vite",
    "lang": "React",
    "title": "CSS in Vite",
    "html": "<pre><code class=\"language-jsx\">import &#39;./styles.css&#39;;\n</code></pre>\n<p>A plain CSS import applies to the whole app. Keep class names specific enough to avoid collisions. For a quick layout:</p>\n<pre><code class=\"language-css\">.page {\n    min-height: 100vh;\n    padding: 96px 20px 40px;\n    background: url(&#39;/backgroundImage.jpg&#39;) center / cover no-repeat;\n}\n\n.card-grid {\n    display: grid;\n    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));\n    gap: 20px;\n}\n</code></pre>\n<p>Vite serves files in <code>public/</code> from <code>/</code>. <code>url(&#39;/backgroundImage.jpg&#39;)</code> works when the file is <code>public/backgroundImage.jpg</code>.</p>\n",
    "plain": "React CSS in Vite import './styles.css'; A plain CSS import applies to the whole app. Keep class names specific enough to avoid collisions. For a quick layout: .page { min-height: 100vh; padding: 96px 20px 40px; background: url('/backgroundImage.jpg') center / cover no-repeat; } .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; } Vite serves files in public/ from / . url('/backgroundImage.jpg') works when the file is public/backgroundImage.jpg ."
  },
  {
    "id": "react-rules-of-hooks",
    "lang": "React",
    "title": "Rules of hooks",
    "html": "<ul>\n<li>Call hooks at the top level of a component or another hook.</li>\n<li>Do not call hooks inside a loop, a condition, or a nested function.</li>\n<li>The order must be the same on every render.</li>\n<li><code>useState</code>, <code>useEffect</code>, <code>useContext</code>, <code>useRef</code>, <code>useMemo</code>, <code>useCallback</code> all follow this rule.</li>\n</ul>\n",
    "plain": "React Rules of hooks Call hooks at the top level of a component or another hook. Do not call hooks inside a loop, a condition, or a nested function. The order must be the same on every render. useState , useEffect , useContext , useRef , useMemo , useCallback all follow this rule."
  },
  {
    "id": "react-useref",
    "lang": "React",
    "title": "useRef",
    "html": "<pre><code class=\"language-jsx\">import { useEffect, useRef } from &quot;react&quot;;\n\nfunction SearchBox() {\n    const inputRef = useRef(null);\n    const renders = useRef(0);\n\n    useEffect(() =&gt; {\n        inputRef.current.focus();\n    }, []);\n\n    renders.current += 1;\n\n    return &lt;input ref={inputRef} placeholder=&quot;Search&quot; /&gt;;\n}\n</code></pre>\n<p><code>useRef</code> returns an object with a <code>current</code> field. Changing <code>current</code> does not re-render. Use it for a DOM node or a value that must survive renders, such as a timer id.</p>\n",
    "plain": "React useRef import { useEffect, useRef } from \"react\"; function SearchBox() { const inputRef = useRef(null); const renders = useRef(0); useEffect(() => { inputRef.current.focus(); }, []); renders.current += 1; return <input ref={inputRef} placeholder=\"Search\" />; } useRef returns an object with a current field. Changing current does not re-render. Use it for a DOM node or a value that must survive renders, such as a timer id."
  },
  {
    "id": "react-usereducer",
    "lang": "React",
    "title": "useReducer",
    "html": "<pre><code class=\"language-jsx\">import { useReducer } from &quot;react&quot;;\n\nfunction reducer(state, action) {\n    switch (action.type) {\n        case &quot;add&quot;:\n            return { count: state.count + 1 };\n        case &quot;reset&quot;:\n            return { count: 0 };\n        default:\n            throw new Error(&quot;Unknown action&quot;);\n    }\n}\n\nfunction Counter() {\n    const [state, dispatch] = useReducer(reducer, { count: 0 });\n\n    return (\n        &lt;&gt;\n            &lt;p&gt;{state.count}&lt;/p&gt;\n            &lt;button onClick={() =&gt; dispatch({ type: &quot;add&quot; })}&gt;Add&lt;/button&gt;\n            &lt;button onClick={() =&gt; dispatch({ type: &quot;reset&quot; })}&gt;Reset&lt;/button&gt;\n        &lt;/&gt;\n    );\n}\n</code></pre>\n<p>Use <code>useReducer</code> when several actions change one state object, or when the next state depends on the previous one. <code>dispatch</code> sends an action; the reducer returns the new state. Keep the reducer pure.</p>\n",
    "plain": "React useReducer import { useReducer } from \"react\"; function reducer(state, action) { switch (action.type) { case \"add\": return { count: state.count + 1 }; case \"reset\": return { count: 0 }; default: throw new Error(\"Unknown action\"); } } function Counter() { const [state, dispatch] = useReducer(reducer, { count: 0 }); return ( <> <p>{state.count}</p> <button onClick={() => dispatch({ type: \"add\" })}>Add</button> <button onClick={() => dispatch({ type: \"reset\" })}>Reset</button> </> ); } Use useReducer when several actions change one state object, or when the next state depends on the previous one. dispatch sends an action; the reducer returns the new state. Keep the reducer pure."
  },
  {
    "id": "react-usecontext",
    "lang": "React",
    "title": "useContext",
    "html": "<pre><code class=\"language-jsx\">import { createContext, useContext } from &quot;react&quot;;\n\nconst ThemeContext = createContext(&quot;light&quot;);\n\nfunction Toolbar() {\n    const theme = useContext(ThemeContext);\n    return &lt;button className={theme}&gt;Menu&lt;/button&gt;;\n}\n\nfunction App() {\n    return (\n        &lt;ThemeContext.Provider value=&quot;dark&quot;&gt;\n            &lt;Toolbar /&gt;\n        &lt;/ThemeContext.Provider&gt;\n    );\n}\n</code></pre>\n<p><code>createContext</code> makes the channel, <code>Provider</code> supplies the value, and <code>useContext</code> reads the nearest provider. A component that reads the context re-renders when the value changes. Do not put a new object in the value on every render unless you memoize it.</p>\n",
    "plain": "React useContext import { createContext, useContext } from \"react\"; const ThemeContext = createContext(\"light\"); function Toolbar() { const theme = useContext(ThemeContext); return <button className={theme}>Menu</button>; } function App() { return ( <ThemeContext.Provider value=\"dark\"> <Toolbar /> </ThemeContext.Provider> ); } createContext makes the channel, Provider supplies the value, and useContext reads the nearest provider. A component that reads the context re-renders when the value changes. Do not put a new object in the value on every render unless you memoize it."
  },
  {
    "id": "react-usememo-and-usecallback",
    "lang": "React",
    "title": "useMemo and useCallback",
    "html": "<pre><code class=\"language-jsx\">import { useCallback, useMemo } from &quot;react&quot;;\n\nfunction RoomList({ rooms, onPick }) {\n    const sorted = useMemo(\n        () =&gt; [...rooms].sort((a, b) =&gt; a.price - b.price),\n        [rooms]\n    );\n\n    const handlePick = useCallback((id) =&gt; onPick(id), [onPick]);\n\n    return sorted.map((room) =&gt; (\n        &lt;button key={room.id} onClick={() =&gt; handlePick(room.id)}&gt;\n            {room.name}\n        &lt;/button&gt;\n    ));\n}\n</code></pre>\n<p><code>useMemo</code> caches a calculated value; <code>useCallback</code> caches a function. Both only help when the result is passed to a memoized child or used in a dependency array. Do not wrap every value; the dependency check has a cost.</p>\n",
    "plain": "React useMemo and useCallback import { useCallback, useMemo } from \"react\"; function RoomList({ rooms, onPick }) { const sorted = useMemo( () => [...rooms].sort((a, b) => a.price - b.price), [rooms] ); const handlePick = useCallback((id) => onPick(id), [onPick]); return sorted.map((room) => ( <button key={room.id} onClick={() => handlePick(room.id)}> {room.name} </button> )); } useMemo caches a calculated value; useCallback caches a function. Both only help when the result is passed to a memoized child or used in a dependency array. Do not wrap every value; the dependency check has a cost."
  },
  {
    "id": "react-class-components",
    "lang": "React",
    "title": "Class components",
    "html": "<pre><code class=\"language-jsx\">import { Component } from &quot;react&quot;;\n\nclass Counter extends Component {\n    state = { count: 0 };\n\n    add = () =&gt; {\n        this.setState({ count: this.state.count + 1 });\n    };\n\n    render() {\n        return &lt;button onClick={this.add}&gt;{this.state.count}&lt;/button&gt;;\n    }\n}\n</code></pre>\n<p>Older React code uses classes. <code>state</code> is an object, <code>setState</code> merges a partial update, and <code>this</code> must be bound or use an arrow method. New code uses function components and hooks; read a class only when the exam or an existing file uses one.</p>\n",
    "plain": "React Class components import { Component } from \"react\"; class Counter extends Component { state = { count: 0 }; add = () => { this.setState({ count: this.state.count + 1 }); }; render() { return <button onClick={this.add}>{this.state.count}</button>; } } Older React code uses classes. state is an object, setState merges a partial update, and this must be bound or use an arrow method. New code uses function components and hooks; read a class only when the exam or an existing file uses one."
  },
  {
    "id": "react-portals-and-suspense",
    "lang": "React",
    "title": "Portals and Suspense",
    "html": "<pre><code class=\"language-jsx\">import { createPortal } from &quot;react-dom&quot;;\nimport { lazy, Suspense } from &quot;react&quot;;\n\nconst HeavyPage = lazy(() =&gt; import(&quot;./HeavyPage.jsx&quot;));\n\nfunction Modal({ children }) {\n    return createPortal(children, document.getElementById(&quot;modal-root&quot;));\n}\n\nfunction App() {\n    return (\n        &lt;Suspense fallback={&lt;p&gt;Loading...&lt;/p&gt;}&gt;\n            &lt;HeavyPage /&gt;\n        &lt;/Suspense&gt;\n    );\n}\n</code></pre>\n<p>A portal renders a child into another DOM node, which is useful for modals and tooltips. <code>lazy</code> splits a component into a separate chunk; <code>Suspense</code> shows a fallback while it loads. The target node must exist in <code>index.html</code>.</p>\n",
    "plain": "React Portals and Suspense import { createPortal } from \"react-dom\"; import { lazy, Suspense } from \"react\"; const HeavyPage = lazy(() => import(\"./HeavyPage.jsx\")); function Modal({ children }) { return createPortal(children, document.getElementById(\"modal-root\")); } function App() { return ( <Suspense fallback={<p>Loading...</p>}> <HeavyPage /> </Suspense> ); } A portal renders a child into another DOM node, which is useful for modals and tooltips. lazy splits a component into a separate chunk; Suspense shows a fallback while it loads. The target node must exist in index.html ."
  },
  {
    "id": "react-error-boundaries",
    "lang": "React",
    "title": "Error boundaries",
    "html": "<pre><code class=\"language-jsx\">import { Component } from &quot;react&quot;;\n\nclass ErrorBoundary extends Component {\n    state = { error: null };\n\n    static getDerivedStateFromError(error) {\n        return { error };\n    }\n\n    componentDidCatch(error, info) {\n        console.error(error, info);\n    }\n\n    render() {\n        if (this.state.error) {\n            return &lt;p&gt;Something went wrong.&lt;/p&gt;;\n        }\n        return this.props.children;\n    }\n}\n</code></pre>\n<p>An error boundary catches render errors in its children. It does not catch event handler errors, async errors, or errors in itself. Wrap a route or a risky panel, not the whole app.</p>\n",
    "plain": "React Error boundaries import { Component } from \"react\"; class ErrorBoundary extends Component { state = { error: null }; static getDerivedStateFromError(error) { return { error }; } componentDidCatch(error, info) { console.error(error, info); } render() { if (this.state.error) { return <p>Something went wrong.</p>; } return this.props.children; } } An error boundary catches render errors in its children. It does not catch event handler errors, async errors, or errors in itself. Wrap a route or a risky panel, not the whole app."
  },
  {
    "id": "react-react-memo-forwardref-hoc",
    "lang": "React",
    "title": "React.memo, forwardRef, HOC",
    "html": "<pre><code class=\"language-jsx\">import { forwardRef, memo } from &quot;react&quot;;\n\nconst Input = forwardRef(function Input(props, ref) {\n    return &lt;input ref={ref} {...props} /&gt;;\n});\n\nconst Row = memo(function Row({ room }) {\n    return &lt;li&gt;{room.name}&lt;/li&gt;;\n});\n\nfunction withTitle(Component) {\n    return function Wrapped(props) {\n        return (\n            &lt;&gt;\n                &lt;h2&gt;Rooms&lt;/h2&gt;\n                &lt;Component {...props} /&gt;\n            &lt;/&gt;\n        );\n    };\n}\n</code></pre>\n<p><code>memo</code> skips a re-render when props are equal. <code>forwardRef</code> passes a ref through to a DOM node. A higher order component takes a component and returns a new one. Use these only when a profiler shows a problem.</p>\n",
    "plain": "React React.memo, forwardRef, HOC import { forwardRef, memo } from \"react\"; const Input = forwardRef(function Input(props, ref) { return <input ref={ref} {...props} />; }); const Row = memo(function Row({ room }) { return <li>{room.name}</li>; }); function withTitle(Component) { return function Wrapped(props) { return ( <> <h2>Rooms</h2> <Component {...props} /> </> ); }; } memo skips a re-render when props are equal. forwardRef passes a ref through to a DOM node. A higher order component takes a component and returns a new one. Use these only when a profiler shows a problem."
  },
  {
    "id": "react-common-errors",
    "lang": "React",
    "title": "Common errors",
    "html": "<table>\n<thead>\n<tr>\n<th>Error</th>\n<th>Cause</th>\n<th>Fix</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>Objects are not valid as a React child</code></td>\n<td>Rendering an object or an array of objects</td>\n<td>Render a string or map to elements</td>\n</tr>\n<tr>\n<td><code>Each child in a list should have a unique key</code></td>\n<td>Missing key</td>\n<td>Add <code>key={item.id}</code></td>\n</tr>\n<tr>\n<td><code>Too many re-renders</code></td>\n<td>State set during render</td>\n<td>Move the call into an event or an effect</td>\n</tr>\n<tr>\n<td><code>Cannot read properties of undefined</code></td>\n<td>Data is not loaded yet</td>\n<td>Guard with <code>data?.name</code> or an early return</td>\n</tr>\n<tr>\n<td><code>useEffect</code> runs forever</td>\n<td>Dependency changes every render</td>\n<td>Use a stable dependency or an empty array</td>\n</tr>\n<tr>\n<td><code>useParams</code> is empty</td>\n<td>Component is outside the route</td>\n<td>Put it inside the route element</td>\n</tr>\n<tr>\n<td>Page is blank after refresh</td>\n<td>Server has no SPA fallback</td>\n<td>Rewrite to <code>index.html</code></td>\n</tr>\n<tr>\n<td>CORS error</td>\n<td>Direct call to another origin</td>\n<td>Use the Vite proxy or enable CORS</td>\n</tr>\n</tbody></table>\n",
    "plain": "React Common errors Error Cause Fix Objects are not valid as a React child Rendering an object or an array of objects Render a string or map to elements Each child in a list should have a unique key Missing key Add key={item.id} Too many re-renders State set during render Move the call into an event or an effect Cannot read properties of undefined Data is not loaded yet Guard with data?.name or an early return useEffect runs forever Dependency changes every render Use a stable dependency or an empty array useParams is empty Component is outside the route Put it inside the route element Page is blank after refresh Server has no SPA fallback Rewrite to index.html CORS error Direct call to another origin Use the Vite proxy or enable CORS"
  },
  {
    "id": "react-exam-checklist",
    "lang": "React",
    "title": "Exam checklist",
    "html": "<ol>\n<li>Confirm the API returns an array with the fields you expect.</li>\n<li>Build the list page with loading, error, and empty states.</li>\n<li>Add the detail route and the <code>useEffect</code> dependency on <code>id</code>.</li>\n<li>Add the search route and the three-character check.</li>\n<li>Add the owner popup and stop its click from bubbling to the card.</li>\n<li>Add the fixed navbar and the page top padding.</li>\n<li>Test at 375px wide.</li>\n<li>Run <code>npm run build</code>.</li>\n</ol>\n",
    "plain": "React Exam checklist Confirm the API returns an array with the fields you expect. Build the list page with loading, error, and empty states. Add the detail route and the useEffect dependency on id . Add the search route and the three-character check. Add the owner popup and stop its click from bubbling to the card. Add the fixed navbar and the page top padding. Test at 375px wide. Run npm run build ."
  },
  {
    "id": "java-compile-and-run",
    "lang": "Java",
    "title": "Compile and run",
    "html": "<pre><code class=\"language-bash\">javac BookingsCli.java\njava BookingsCli bookings.csv\n</code></pre>\n<p>If the program uses a database driver, add the jar to the classpath:</p>\n<pre><code class=\"language-bash\">java -cp .:mysql-connector-j-8.4.0.jar BookingsCli\n</code></pre>\n<p>On Windows the separator is <code>;</code> instead of <code>:</code>.</p>\n",
    "plain": "Java Compile and run javac BookingsCli.java java BookingsCli bookings.csv If the program uses a database driver, add the jar to the classpath: java -cp .:mysql-connector-j-8.4.0.jar BookingsCli On Windows the separator is ; instead of : ."
  },
  {
    "id": "java-skeleton",
    "lang": "Java",
    "title": "Skeleton",
    "html": "<pre><code class=\"language-java\">import java.io.IOException;\nimport java.nio.file.Files;\nimport java.nio.file.Path;\nimport java.util.List;\n\npublic class BookingsCli {\n\n    public static void main(String[] args) throws IOException {\n        if (args.length == 0) {\n            System.out.println(&quot;Usage: java BookingsCli bookings.csv&quot;);\n            return;\n        }\n\n        List&lt;String&gt; lines = Files.readAllLines(Path.of(args[0]));\n        System.out.println(&quot;Rows: &quot; + lines.size());\n    }\n}\n</code></pre>\n<p><code>throws IOException</code> on <code>main</code> is fine for an exam. The JVM prints the stack trace, which tells you the missing file or the permission problem.</p>\n",
    "plain": "Java Skeleton import java.io.IOException; import java.nio.file.Files; import java.nio.file.Path; import java.util.List; public class BookingsCli { public static void main(String[] args) throws IOException { if (args.length == 0) { System.out.println(\"Usage: java BookingsCli bookings.csv\"); return; } List<String> lines = Files.readAllLines(Path.of(args[0])); System.out.println(\"Rows: \" + lines.size()); } } throws IOException on main is fine for an exam. The JVM prints the stack trace, which tells you the missing file or the permission problem."
  },
  {
    "id": "java-read-a-file",
    "lang": "Java",
    "title": "Read a file",
    "html": "<pre><code class=\"language-java\">// Whole file into memory. Fine for exam sized CSV files.\nList&lt;String&gt; lines = Files.readAllLines(Path.of(&quot;bookings.csv&quot;));\n\n// Line by line. Use this when the file may be large.\ntry (var reader = Files.newBufferedReader(Path.of(&quot;bookings.csv&quot;))) {\n    String line;\n    while ((line = reader.readLine()) != null) {\n        System.out.println(line);\n    }\n}\n</code></pre>\n<p><code>Files.readAllLines</code> uses UTF-8 by default in Java 18 and later. On older versions, pass <code>StandardCharsets.UTF_8</code>.</p>\n",
    "plain": "Java Read a file // Whole file into memory. Fine for exam sized CSV files. List<String> lines = Files.readAllLines(Path.of(\"bookings.csv\")); // Line by line. Use this when the file may be large. try (var reader = Files.newBufferedReader(Path.of(\"bookings.csv\"))) { String line; while ((line = reader.readLine()) != null) { System.out.println(line); } } Files.readAllLines uses UTF-8 by default in Java 18 and later. On older versions, pass StandardCharsets.UTF_8 ."
  },
  {
    "id": "java-csv-parsing",
    "lang": "Java",
    "title": "CSV parsing",
    "html": "<p>Most exam CSV files are simple: comma separated, no quoted commas. <code>split(&quot;,&quot;, -1)</code> keeps empty trailing fields, which matters when the last column is empty.</p>\n<pre><code class=\"language-java\">static String[] parseCsvLine(String line) {\n    return line.split(&quot;,&quot;, -1);\n}\n\nstatic String get(String[] fields, int index) {\n    return index &lt; fields.length ? fields[index].trim() : &quot;&quot;;\n}\n</code></pre>\n<p>If a field can contain a comma inside quotes, use the full parser from <code>java/BookingsCli.java</code>. Do not write a new one under time pressure.</p>\n<p>The header row may be present. Detect it by looking at the first field:</p>\n<pre><code class=\"language-java\">int start = lines.isEmpty() ? 0 : 1;\n\nString first = lines.get(0).split(&quot;,&quot;, -1)[0].trim();\nif (!first.equals(&quot;customer_email&quot;)) {\n    start = 0;\n}\n</code></pre>\n",
    "plain": "Java CSV parsing Most exam CSV files are simple: comma separated, no quoted commas. split(\",\", -1) keeps empty trailing fields, which matters when the last column is empty. static String[] parseCsvLine(String line) { return line.split(\",\", -1); } static String get(String[] fields, int index) { return index < fields.length ? fields[index].trim() : \"\"; } If a field can contain a comma inside quotes, use the full parser from java/BookingsCli.java . Do not write a new one under time pressure. The header row may be present. Detect it by looking at the first field: int start = lines.isEmpty() ? 0 : 1; String first = lines.get(0).split(\",\", -1)[0].trim(); if (!first.equals(\"customer_email\")) { start = 0; }"
  },
  {
    "id": "java-numbers-and-dates",
    "lang": "Java",
    "title": "Numbers and dates",
    "html": "<pre><code class=\"language-java\">int adults = Integer.parseInt(get(fields, 9));\nint children = Integer.parseInt(get(fields, 10));\n\n// Empty numeric field: use a default instead of throwing.\nint count = get(fields, 10).isEmpty() ? 0 : Integer.parseInt(get(fields, 10));\n\nLocalDate start = LocalDate.parse(get(fields, 12)); // yyyy-MM-dd\nLocalDate end = LocalDate.parse(get(fields, 13));\nlong nights = ChronoUnit.DAYS.between(start, end);\n</code></pre>\n<p><code>LocalDate.parse</code> throws <code>DateTimeParseException</code> on a bad value. For an exam, let it throw and fix the data, or wrap it:</p>\n<pre><code class=\"language-java\">static LocalDate dateOrNull(String text) {\n    try {\n        return LocalDate.parse(text.trim());\n    } catch (DateTimeParseException e) {\n        return null;\n    }\n}\n</code></pre>\n",
    "plain": "Java Numbers and dates int adults = Integer.parseInt(get(fields, 9)); int children = Integer.parseInt(get(fields, 10)); // Empty numeric field: use a default instead of throwing. int count = get(fields, 10).isEmpty() ? 0 : Integer.parseInt(get(fields, 10)); LocalDate start = LocalDate.parse(get(fields, 12)); // yyyy-MM-dd LocalDate end = LocalDate.parse(get(fields, 13)); long nights = ChronoUnit.DAYS.between(start, end); LocalDate.parse throws DateTimeParseException on a bad value. For an exam, let it throw and fix the data, or wrap it: static LocalDate dateOrNull(String text) { try { return LocalDate.parse(text.trim()); } catch (DateTimeParseException e) { return null; } }"
  },
  {
    "id": "java-record-for-one-row",
    "lang": "Java",
    "title": "Record for one row",
    "html": "<pre><code class=\"language-java\">record Booking(\n    String customerEmail,\n    int hotelId,\n    LocalDate startDate,\n    LocalDate endDate,\n    int adults,\n    int children,\n    int boylovers\n) {\n    long nights() {\n        return ChronoUnit.DAYS.between(startDate, endDate);\n    }\n\n    int guests() {\n        return adults + children + boylovers;\n    }\n}\n</code></pre>\n<p>Records give you the constructor, accessors, <code>equals</code>, <code>hashCode</code>, and <code>toString</code> for free. Accessors are <code>b.startDate()</code>, not <code>b.getStartDate()</code>.</p>\n",
    "plain": "Java Record for one row record Booking( String customerEmail, int hotelId, LocalDate startDate, LocalDate endDate, int adults, int children, int boylovers ) { long nights() { return ChronoUnit.DAYS.between(startDate, endDate); } int guests() { return adults + children + boylovers; } } Records give you the constructor, accessors, equals , hashCode , and toString for free. Accessors are b.startDate() , not b.getStartDate() ."
  },
  {
    "id": "java-lists",
    "lang": "Java",
    "title": "Lists",
    "html": "<pre><code class=\"language-java\">List&lt;Booking&gt; bookings = new ArrayList&lt;&gt;();\n\nfor (String line : lines) {\n    String[] f = parseCsvLine(line);\n    bookings.add(new Booking(\n        get(f, 0),\n        Integer.parseInt(get(f, 6)),\n        LocalDate.parse(get(f, 12)),\n        LocalDate.parse(get(f, 13)),\n        Integer.parseInt(get(f, 14)),\n        Integer.parseInt(get(f, 15)),\n        Integer.parseInt(get(f, 16))\n    ));\n}\n\nSystem.out.println(&quot;Bookings: &quot; + bookings.size());\n</code></pre>\n<p>Use <code>List.of(...)</code> only for a fixed list. It is immutable, so <code>add</code> throws <code>UnsupportedOperationException</code>.</p>\n",
    "plain": "Java Lists List<Booking> bookings = new ArrayList<>(); for (String line : lines) { String[] f = parseCsvLine(line); bookings.add(new Booking( get(f, 0), Integer.parseInt(get(f, 6)), LocalDate.parse(get(f, 12)), LocalDate.parse(get(f, 13)), Integer.parseInt(get(f, 14)), Integer.parseInt(get(f, 15)), Integer.parseInt(get(f, 16)) )); } System.out.println(\"Bookings: \" + bookings.size()); Use List.of(...) only for a fixed list. It is immutable, so add throws UnsupportedOperationException ."
  },
  {
    "id": "java-filter-sort-max",
    "lang": "Java",
    "title": "Filter, sort, max",
    "html": "<pre><code class=\"language-java\">// Filter\nList&lt;Booking&gt; in2024 = bookings.stream()\n    .filter(b -&gt; b.startDate().getYear() == 2024)\n    .toList();\n\n// Sort by nights, longest first\nList&lt;Booking&gt; byNights = new ArrayList&lt;&gt;(bookings);\nbyNights.sort(Comparator.comparingLong(Booking::nights).reversed());\n\n// Longest booking\nBooking longest = bookings.stream()\n    .max(Comparator.comparingLong(Booking::nights))\n    .orElse(null);\n\nif (longest != null) {\n    System.out.println(longest.customerEmail() + &quot; &quot; + longest.nights());\n}\n\n// Sort by two fields\nbookings.sort(\n    Comparator.comparing(Booking::startDate)\n        .thenComparing(Booking::customerEmail)\n);\n</code></pre>\n<p><code>Comparator.comparingLong</code> avoids boxing. For a <code>String</code> key, use <code>Comparator.comparing(Booking::customerEmail)</code>.</p>\n",
    "plain": "Java Filter, sort, max // Filter List<Booking> in2024 = bookings.stream() .filter(b -> b.startDate().getYear() == 2024) .toList(); // Sort by nights, longest first List<Booking> byNights = new ArrayList<>(bookings); byNights.sort(Comparator.comparingLong(Booking::nights).reversed()); // Longest booking Booking longest = bookings.stream() .max(Comparator.comparingLong(Booking::nights)) .orElse(null); if (longest != null) { System.out.println(longest.customerEmail() + \" \" + longest.nights()); } // Sort by two fields bookings.sort( Comparator.comparing(Booking::startDate) .thenComparing(Booking::customerEmail) ); Comparator.comparingLong avoids boxing. For a String key, use Comparator.comparing(Booking::customerEmail) ."
  },
  {
    "id": "java-distinct-values-and-random-pick",
    "lang": "Java",
    "title": "Distinct values and random pick",
    "html": "<pre><code class=\"language-java\">List&lt;String&gt; emails = bookings.stream()\n    .map(Booking::customerEmail)\n    .distinct()\n    .sorted()\n    .toList();\n\nRandom random = new Random();\nString picked = emails.get(random.nextInt(emails.size()));\n</code></pre>\n<p>Guard the empty list before calling <code>random.nextInt(0)</code>.</p>\n",
    "plain": "Java Distinct values and random pick List<String> emails = bookings.stream() .map(Booking::customerEmail) .distinct() .sorted() .toList(); Random random = new Random(); String picked = emails.get(random.nextInt(emails.size())); Guard the empty list before calling random.nextInt(0) ."
  },
  {
    "id": "java-group-and-count",
    "lang": "Java",
    "title": "Group and count",
    "html": "<pre><code class=\"language-java\">Map&lt;Integer, Long&gt; perYear = bookings.stream()\n    .collect(Collectors.groupingBy(\n        b -&gt; b.startDate().getYear(),\n        TreeMap::new,\n        Collectors.counting()\n    ));\n\nfor (Map.Entry&lt;Integer, Long&gt; entry : perYear.entrySet()) {\n    System.out.println(entry.getKey() + &quot;: &quot; + entry.getValue());\n}\n</code></pre>\n<p><code>TreeMap</code> keeps the years sorted. For a <code>HashMap</code>, sort the keys before printing:</p>\n<pre><code class=\"language-java\">perYear.keySet().stream().sorted().forEach(year -&gt;\n    System.out.println(year + &quot;: &quot; + perYear.get(year))\n);\n</code></pre>\n<p>Count with a plain map when you do not want streams:</p>\n<pre><code class=\"language-java\">Map&lt;String, Integer&gt; counts = new HashMap&lt;&gt;();\nfor (Booking b : bookings) {\n    counts.merge(b.customerEmail(), 1, Integer::sum);\n}\n</code></pre>\n",
    "plain": "Java Group and count Map<Integer, Long> perYear = bookings.stream() .collect(Collectors.groupingBy( b -> b.startDate().getYear(), TreeMap::new, Collectors.counting() )); for (Map.Entry<Integer, Long> entry : perYear.entrySet()) { System.out.println(entry.getKey() + \": \" + entry.getValue()); } TreeMap keeps the years sorted. For a HashMap , sort the keys before printing: perYear.keySet().stream().sorted().forEach(year -> System.out.println(year + \": \" + perYear.get(year)) ); Count with a plain map when you do not want streams: Map<String, Integer> counts = new HashMap<>(); for (Booking b : bookings) { counts.merge(b.customerEmail(), 1, Integer::sum); }"
  },
  {
    "id": "java-sum-and-average",
    "lang": "Java",
    "title": "Sum and average",
    "html": "<pre><code class=\"language-java\">int totalGuests = bookings.stream().mapToInt(Booking::guests).sum();\n\ndouble averageNights = bookings.stream()\n    .mapToLong(Booking::nights)\n    .average()\n    .orElse(0);\n\nSystem.out.printf(Locale.US, &quot;Average: %.2f%n&quot;, averageNights);\n</code></pre>\n<p>Use <code>Locale.US</code> when the expected output uses a dot. Hungarian locale prints a comma.</p>\n",
    "plain": "Java Sum and average int totalGuests = bookings.stream().mapToInt(Booking::guests).sum(); double averageNights = bookings.stream() .mapToLong(Booking::nights) .average() .orElse(0); System.out.printf(Locale.US, \"Average: %.2f%n\", averageNights); Use Locale.US when the expected output uses a dot. Hungarian locale prints a comma."
  },
  {
    "id": "java-word-count",
    "lang": "Java",
    "title": "Word count",
    "html": "<pre><code class=\"language-java\">static int wordCount(String text) {\n    String trimmed = text == null ? &quot;&quot; : text.trim();\n    if (trimmed.isEmpty()) {\n        return 0;\n    }\n    return trimmed.split(&quot;\\\\s+&quot;).length;\n}\n</code></pre>\n<p>This counts whitespace separated words. Punctuation stays attached, which is usually what the exam expects.</p>\n",
    "plain": "Java Word count static int wordCount(String text) { String trimmed = text == null ? \"\" : text.trim(); if (trimmed.isEmpty()) { return 0; } return trimmed.split(\"\\\\s+\").length; } This counts whitespace separated words. Punctuation stays attached, which is usually what the exam expects."
  },
  {
    "id": "java-write-a-file",
    "lang": "Java",
    "title": "Write a file",
    "html": "<pre><code class=\"language-java\">List&lt;String&gt; output = bookings.stream()\n    .filter(b -&gt; b.nights() &lt; 3)\n    .map(b -&gt; b.customerEmail() + &quot;,&quot; + b.hotelId() + &quot;,&quot; + b.nights())\n    .toList();\n\nFiles.write(Path.of(&quot;rovidek.txt&quot;), output);\n</code></pre>\n<p><code>Files.write</code> creates or overwrites the file. Add <code>StandardOpenOption.APPEND</code> to append:</p>\n<pre><code class=\"language-java\">Files.write(path, output, StandardOpenOption.CREATE, StandardOpenOption.APPEND);\n</code></pre>\n<p>Build lines with <code>StringBuilder</code> when the format is more complex:</p>\n<pre><code class=\"language-java\">StringBuilder sb = new StringBuilder();\nfor (Booking b : bookings) {\n    sb.append(b.customerEmail())\n      .append(&quot;;&quot;)\n      .append(b.nights())\n      .append(System.lineSeparator());\n}\nFiles.writeString(Path.of(&quot;out.txt&quot;), sb.toString());\n</code></pre>\n",
    "plain": "Java Write a file List<String> output = bookings.stream() .filter(b -> b.nights() < 3) .map(b -> b.customerEmail() + \",\" + b.hotelId() + \",\" + b.nights()) .toList(); Files.write(Path.of(\"rovidek.txt\"), output); Files.write creates or overwrites the file. Add StandardOpenOption.APPEND to append: Files.write(path, output, StandardOpenOption.CREATE, StandardOpenOption.APPEND); Build lines with StringBuilder when the format is more complex: StringBuilder sb = new StringBuilder(); for (Booking b : bookings) { sb.append(b.customerEmail()) .append(\";\") .append(b.nights()) .append(System.lineSeparator()); } Files.writeString(Path.of(\"out.txt\"), sb.toString());"
  },
  {
    "id": "java-string-helpers",
    "lang": "Java",
    "title": "String helpers",
    "html": "<pre><code class=\"language-java\">String text = &quot;  Hotel Danube  &quot;;\ntext.trim();                 // &quot;Hotel Danube&quot;\ntext.strip();                // Unicode aware trim, Java 11+\ntext.isBlank();              // true for spaces only\ntext.toLowerCase();          // locale sensitive\ntext.toUpperCase(Locale.ROOT);\ntext.contains(&quot;Danube&quot;);\ntext.startsWith(&quot;Hotel&quot;);\ntext.substring(0, 5);\ntext.replace(&quot;a&quot;, &quot;b&quot;);\nString.join(&quot;, &quot;, List.of(&quot;a&quot;, &quot;b&quot;));\n</code></pre>\n<p>Use <code>Locale.ROOT</code> for case changes that must not depend on the machine language.</p>\n",
    "plain": "Java String helpers String text = \" Hotel Danube \"; text.trim(); // \"Hotel Danube\" text.strip(); // Unicode aware trim, Java 11+ text.isBlank(); // true for spaces only text.toLowerCase(); // locale sensitive text.toUpperCase(Locale.ROOT); text.contains(\"Danube\"); text.startsWith(\"Hotel\"); text.substring(0, 5); text.replace(\"a\", \"b\"); String.join(\", \", List.of(\"a\", \"b\")); Use Locale.ROOT for case changes that must not depend on the machine language."
  },
  {
    "id": "java-scanner-input",
    "lang": "Java",
    "title": "Scanner input",
    "html": "<pre><code class=\"language-java\">Scanner scanner = new Scanner(System.in);\nSystem.out.print(&quot;Hotel id: &quot;);\nint id = Integer.parseInt(scanner.nextLine().trim());\n</code></pre>\n<p>Read the whole line with <code>nextLine</code>, then parse. Mixing <code>nextInt</code> and <code>nextLine</code> leaves the newline in the buffer, which causes the next read to return an empty string.</p>\n",
    "plain": "Java Scanner input Scanner scanner = new Scanner(System.in); System.out.print(\"Hotel id: \"); int id = Integer.parseInt(scanner.nextLine().trim()); Read the whole line with nextLine , then parse. Mixing nextInt and nextLine leaves the newline in the buffer, which causes the next read to return an empty string."
  },
  {
    "id": "java-exceptions",
    "lang": "Java",
    "title": "Exceptions",
    "html": "<pre><code class=\"language-java\">try {\n    int value = Integer.parseInt(text);\n    System.out.println(value);\n} catch (NumberFormatException e) {\n    System.out.println(&quot;Not a number: &quot; + text);\n}\n</code></pre>\n<p>For file work, try with resources closes the reader even when an exception is thrown:</p>\n<pre><code class=\"language-java\">try (BufferedReader reader = Files.newBufferedReader(path)) {\n    String line;\n    while ((line = reader.readLine()) != null) {\n        // ...\n    }\n} catch (IOException e) {\n    System.out.println(&quot;Could not read &quot; + path + &quot;: &quot; + e.getMessage());\n}\n</code></pre>\n",
    "plain": "Java Exceptions try { int value = Integer.parseInt(text); System.out.println(value); } catch (NumberFormatException e) { System.out.println(\"Not a number: \" + text); } For file work, try with resources closes the reader even when an exception is thrown: try (BufferedReader reader = Files.newBufferedReader(path)) { String line; while ((line = reader.readLine()) != null) { // ... } } catch (IOException e) { System.out.println(\"Could not read \" + path + \": \" + e.getMessage()); }"
  },
  {
    "id": "java-jdbc-quick-start",
    "lang": "Java",
    "title": "JDBC quick start",
    "html": "<pre><code class=\"language-java\">String url = &quot;jdbc:mysql://localhost:3306/bookings?useSSL=false&amp;serverTimezone=UTC&quot;;\ntry (Connection conn = DriverManager.getConnection(url, &quot;root&quot;, &quot;password&quot;);\n     PreparedStatement ps = conn.prepareStatement(\n         &quot;SELECT name, stars FROM hotels WHERE city = ? ORDER BY name&quot;)) {\n\n    ps.setString(1, &quot;Budapest&quot;);\n\n    try (ResultSet rs = ps.executeQuery()) {\n        while (rs.next()) {\n            System.out.println(rs.getString(&quot;name&quot;) + &quot; &quot; + rs.getInt(&quot;stars&quot;));\n        }\n    }\n}\n</code></pre>\n<p>Always use <code>?</code> placeholders for user input. String concatenation opens SQL injection.</p>\n",
    "plain": "Java JDBC quick start String url = \"jdbc:mysql://localhost:3306/bookings?useSSL=false&serverTimezone=UTC\"; try (Connection conn = DriverManager.getConnection(url, \"root\", \"password\"); PreparedStatement ps = conn.prepareStatement( \"SELECT name, stars FROM hotels WHERE city = ? ORDER BY name\")) { ps.setString(1, \"Budapest\"); try (ResultSet rs = ps.executeQuery()) { while (rs.next()) { System.out.println(rs.getString(\"name\") + \" \" + rs.getInt(\"stars\")); } } } Always use ? placeholders for user input. String concatenation opens SQL injection."
  },
  {
    "id": "java-classes-and-objects",
    "lang": "Java",
    "title": "Classes and objects",
    "html": "<pre><code class=\"language-java\">class Hotel {\n    private String name;\n    private int stars;\n\n    Hotel(String name, int stars) {\n        this.name = name;\n        this.stars = stars;\n    }\n\n    String label() {\n        return name + &quot; (&quot; + stars + &quot; stars)&quot;;\n    }\n}\n\nHotel h = new Hotel(&quot;Danube View&quot;, 4);\nSystem.out.println(h.label());\n</code></pre>\n<p>A class is the blueprint, an object is one instance. <code>private</code> hides the field, the constructor sets it, and a method exposes behaviour. Use <code>this.field</code> when a parameter has the same name.</p>\n",
    "plain": "Java Classes and objects class Hotel { private String name; private int stars; Hotel(String name, int stars) { this.name = name; this.stars = stars; } String label() { return name + \" (\" + stars + \" stars)\"; } } Hotel h = new Hotel(\"Danube View\", 4); System.out.println(h.label()); A class is the blueprint, an object is one instance. private hides the field, the constructor sets it, and a method exposes behaviour. Use this.field when a parameter has the same name."
  },
  {
    "id": "java-inheritance-and-interfaces",
    "lang": "Java",
    "title": "Inheritance and interfaces",
    "html": "<pre><code class=\"language-java\">interface Payable {\n    double amount();\n}\n\nabstract class BookingBase {\n    abstract double price();\n}\n\nclass RoomBooking extends BookingBase implements Payable {\n    private final double nightly;\n    private final int nights;\n\n    RoomBooking(double nightly, int nights) {\n        this.nightly = nightly;\n        this.nights = nights;\n    }\n\n    @Override\n    double price() {\n        return nightly * nights;\n    }\n\n    @Override\n    public double amount() {\n        return price();\n    }\n}\n</code></pre>\n<p><code>extends</code> shares code, <code>implements</code> promises a contract. <code>@Override</code> catches a wrong signature. An abstract class can hold shared state; an interface is the public contract. Polymorphism means a <code>Payable</code> variable can hold any implementation.</p>\n",
    "plain": "Java Inheritance and interfaces interface Payable { double amount(); } abstract class BookingBase { abstract double price(); } class RoomBooking extends BookingBase implements Payable { private final double nightly; private final int nights; RoomBooking(double nightly, int nights) { this.nightly = nightly; this.nights = nights; } @Override double price() { return nightly * nights; } @Override public double amount() { return price(); } } extends shares code, implements promises a contract. @Override catches a wrong signature. An abstract class can hold shared state; an interface is the public contract. Polymorphism means a Payable variable can hold any implementation."
  },
  {
    "id": "java-arraylist-and-hashmap",
    "lang": "Java",
    "title": "ArrayList and HashMap",
    "html": "<pre><code class=\"language-java\">import java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.List;\nimport java.util.Map;\n\nList&lt;String&gt; names = new ArrayList&lt;&gt;();\nnames.add(&quot;Anna&quot;);\nnames.add(&quot;Ben&quot;);\nnames.set(0, &quot;Cara&quot;);\nnames.remove(&quot;Ben&quot;);\nSystem.out.println(names.size());             // 1\nSystem.out.println(names.get(0));             // Cara\nSystem.out.println(names.contains(&quot;Cara&quot;));   // true\n\nMap&lt;String, Integer&gt; nights = new HashMap&lt;&gt;();\nnights.put(&quot;Anna&quot;, 3);\nnights.put(&quot;Ben&quot;, 5);\nnights.put(&quot;Anna&quot;, 4);                        // overwrites\nSystem.out.println(nights.get(&quot;Anna&quot;));        // 4\nSystem.out.println(nights.getOrDefault(&quot;Cara&quot;, 0)); // 0\nSystem.out.println(nights.containsKey(&quot;Ben&quot;)); // true\n\nfor (Map.Entry&lt;String, Integer&gt; entry : nights.entrySet()) {\n    System.out.println(entry.getKey() + &quot;: &quot; + entry.getValue());\n}\n</code></pre>\n<p><code>ArrayList</code> keeps insertion order and allows duplicates. <code>HashMap</code> maps a key to a value, has no order, and overwrites on a duplicate key. <code>get</code> returns <code>null</code> for a missing key, so use <code>getOrDefault</code> or <code>containsKey</code>.</p>\n",
    "plain": "Java ArrayList and HashMap import java.util.ArrayList; import java.util.HashMap; import java.util.List; import java.util.Map; List<String> names = new ArrayList<>(); names.add(\"Anna\"); names.add(\"Ben\"); names.set(0, \"Cara\"); names.remove(\"Ben\"); System.out.println(names.size()); // 1 System.out.println(names.get(0)); // Cara System.out.println(names.contains(\"Cara\")); // true Map<String, Integer> nights = new HashMap<>(); nights.put(\"Anna\", 3); nights.put(\"Ben\", 5); nights.put(\"Anna\", 4); // overwrites System.out.println(nights.get(\"Anna\")); // 4 System.out.println(nights.getOrDefault(\"Cara\", 0)); // 0 System.out.println(nights.containsKey(\"Ben\")); // true for (Map.Entry<String, Integer> entry : nights.entrySet()) { System.out.println(entry.getKey() + \": \" + entry.getValue()); } ArrayList keeps insertion order and allows duplicates. HashMap maps a key to a value, has no order, and overwrites on a duplicate key. get returns null for a missing key, so use getOrDefault or containsKey ."
  },
  {
    "id": "java-hashset-and-treeset",
    "lang": "Java",
    "title": "HashSet and TreeSet",
    "html": "<pre><code class=\"language-java\">import java.util.HashSet;\nimport java.util.List;\nimport java.util.Set;\nimport java.util.TreeSet;\n\nSet&lt;String&gt; cities = new HashSet&lt;&gt;();\ncities.add(&quot;Budapest&quot;);\ncities.add(&quot;Debrecen&quot;);\ncities.add(&quot;Budapest&quot;); // ignored\nSystem.out.println(cities.size());          // 2\nSystem.out.println(cities.contains(&quot;Debrecen&quot;)); // true\n\nSet&lt;Integer&gt; sorted = new TreeSet&lt;&gt;(List.of(3, 1, 2, 1));\nSystem.out.println(sorted); // [1, 2, 3]\n</code></pre>\n<p>A <code>Set</code> stores unique values. <code>HashSet</code> is fast and unordered. <code>TreeSet</code> keeps natural order and is slower. Use a <code>Set</code> when duplicates are a bug.</p>\n",
    "plain": "Java HashSet and TreeSet import java.util.HashSet; import java.util.List; import java.util.Set; import java.util.TreeSet; Set<String> cities = new HashSet<>(); cities.add(\"Budapest\"); cities.add(\"Debrecen\"); cities.add(\"Budapest\"); // ignored System.out.println(cities.size()); // 2 System.out.println(cities.contains(\"Debrecen\")); // true Set<Integer> sorted = new TreeSet<>(List.of(3, 1, 2, 1)); System.out.println(sorted); // [1, 2, 3] A Set stores unique values. HashSet is fast and unordered. TreeSet keeps natural order and is slower. Use a Set when duplicates are a bug."
  },
  {
    "id": "java-lambda-and-streams",
    "lang": "Java",
    "title": "Lambda and streams",
    "html": "<pre><code class=\"language-java\">List&lt;String&gt; names = List.of(&quot;Anna&quot;, &quot;Ben&quot;, &quot;Cara&quot;);\n\nnames.forEach(name -&gt; System.out.println(name));\n\nList&lt;String&gt; shortNames = names.stream()\n    .filter(name -&gt; name.length() &lt;= 3)\n    .map(String::toUpperCase)\n    .sorted()\n    .toList();\n\nlong count = names.stream().filter(name -&gt; name.startsWith(&quot;A&quot;)).count();\n</code></pre>\n<p>A lambda is a short implementation of a functional interface. A stream chains filter, map, sort, and collect without writing a loop. <code>toList()</code> returns an immutable list. Use a normal loop when you need an index or early exit.</p>\n",
    "plain": "Java Lambda and streams List<String> names = List.of(\"Anna\", \"Ben\", \"Cara\"); names.forEach(name -> System.out.println(name)); List<String> shortNames = names.stream() .filter(name -> name.length() <= 3) .map(String::toUpperCase) .sorted() .toList(); long count = names.stream().filter(name -> name.startsWith(\"A\")).count(); A lambda is a short implementation of a functional interface. A stream chains filter, map, sort, and collect without writing a loop. toList() returns an immutable list. Use a normal loop when you need an index or early exit."
  },
  {
    "id": "java-enum",
    "lang": "Java",
    "title": "Enum",
    "html": "<pre><code class=\"language-java\">enum Status {\n    PENDING, PAID, CANCELLED\n}\n\nStatus status = Status.PAID;\nif (status == Status.PAID) {\n    System.out.println(&quot;Paid&quot;);\n}\nSystem.out.println(status.name());   // PAID\nSystem.out.println(status.ordinal()); // 1\n</code></pre>\n<p>An enum is a fixed set of constants. Compare with <code>==</code>. Use <code>name()</code> for the label, <code>values()</code> to loop, and <code>valueOf(&quot;PAID&quot;)</code> to parse.</p>\n",
    "plain": "Java Enum enum Status { PENDING, PAID, CANCELLED } Status status = Status.PAID; if (status == Status.PAID) { System.out.println(\"Paid\"); } System.out.println(status.name()); // PAID System.out.println(status.ordinal()); // 1 An enum is a fixed set of constants. Compare with == . Use name() for the label, values() to loop, and valueOf(\"PAID\") to parse."
  },
  {
    "id": "java-generics",
    "lang": "Java",
    "title": "Generics",
    "html": "<pre><code class=\"language-java\">class Box&lt;T&gt; {\n    private T value;\n\n    void set(T value) { this.value = value; }\n    T get() { return value; }\n}\n\nBox&lt;String&gt; box = new Box&lt;&gt;();\nbox.set(&quot;hello&quot;);\nString text = box.get();\n</code></pre>\n<p><code>&lt;T&gt;</code> is a type parameter. Generics catch a wrong type at compile time and avoid casts. Use <code>List&lt;String&gt;</code> instead of a raw <code>List</code>.</p>\n",
    "plain": "Java Generics class Box<T> { private T value; void set(T value) { this.value = value; } T get() { return value; } } Box<String> box = new Box<>(); box.set(\"hello\"); String text = box.get(); <T> is a type parameter. Generics catch a wrong type at compile time and avoid casts. Use List<String> instead of a raw List ."
  },
  {
    "id": "java-threads",
    "lang": "Java",
    "title": "Threads",
    "html": "<pre><code class=\"language-java\">Thread worker = new Thread(() -&gt; {\n    for (int i = 0; i &lt; 3; i++) {\n        System.out.println(&quot;worker &quot; + i);\n    }\n});\nworker.start();\nworker.join(); // wait for it\n</code></pre>\n<p><code>start()</code> runs the task on a new thread. <code>join()</code> waits for it to finish. Do not call <code>run()</code> directly; that runs on the current thread. Shared mutable state needs synchronization.</p>\n",
    "plain": "Java Threads Thread worker = new Thread(() -> { for (int i = 0; i < 3; i++) { System.out.println(\"worker \" + i); } }); worker.start(); worker.join(); // wait for it start() runs the task on a new thread. join() waits for it to finish. Do not call run() directly; that runs on the current thread. Shared mutable state needs synchronization."
  },
  {
    "id": "java-try-with-resources",
    "lang": "Java",
    "title": "try-with-resources",
    "html": "<pre><code class=\"language-java\">try (BufferedReader reader = Files.newBufferedReader(Path.of(&quot;bookings.csv&quot;))) {\n    String line;\n    while ((line = reader.readLine()) != null) {\n        System.out.println(line);\n    }\n} catch (IOException e) {\n    System.out.println(&quot;Read failed: &quot; + e.getMessage());\n}\n</code></pre>\n<p>A resource declared in the parentheses closes automatically, even when an exception is thrown. The resource must implement <code>AutoCloseable</code>. Use it for files, streams, and JDBC objects instead of a <code>finally</code> block.</p>\n",
    "plain": "Java try-with-resources try (BufferedReader reader = Files.newBufferedReader(Path.of(\"bookings.csv\"))) { String line; while ((line = reader.readLine()) != null) { System.out.println(line); } } catch (IOException e) { System.out.println(\"Read failed: \" + e.getMessage()); } A resource declared in the parentheses closes automatically, even when an exception is thrown. The resource must implement AutoCloseable . Use it for files, streams, and JDBC objects instead of a finally block."
  },
  {
    "id": "java-common-errors",
    "lang": "Java",
    "title": "Common errors",
    "html": "<table>\n<thead>\n<tr>\n<th>Error</th>\n<th>Cause</th>\n<th>Fix</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>ArrayIndexOutOfBoundsException</code></td>\n<td>A row has fewer columns than expected</td>\n<td>Use <code>get(fields, index)</code> with a bounds check</td>\n</tr>\n<tr>\n<td><code>NumberFormatException</code></td>\n<td>Empty or quoted numeric field</td>\n<td>Trim, check <code>isEmpty</code>, strip quotes</td>\n</tr>\n<tr>\n<td><code>DateTimeParseException</code></td>\n<td>Date is not <code>yyyy-MM-dd</code></td>\n<td>Print the bad value before parsing</td>\n</tr>\n<tr>\n<td><code>NullPointerException</code></td>\n<td>A missing field or a null result</td>\n<td>Guard with <code>isEmpty</code> or <code>Optional</code></td>\n</tr>\n<tr>\n<td><code>UnsupportedOperationException</code></td>\n<td><code>List.of</code> was modified</td>\n<td>Copy into <code>new ArrayList&lt;&gt;(...)</code></td>\n</tr>\n<tr>\n<td><code>NoSuchFileException</code></td>\n<td>Wrong relative path</td>\n<td>Print <code>Path.of(...).toAbsolutePath()</code></td>\n</tr>\n<tr>\n<td><code>ClassNotFoundException</code></td>\n<td>JDBC driver missing from classpath</td>\n<td>Add the connector jar</td>\n</tr>\n<tr>\n<td>Output has a trailing comma</td>\n<td>Join logic adds a separator after every item</td>\n<td>Join with <code>String.join</code> or skip the last separator</td>\n</tr>\n</tbody></table>\n",
    "plain": "Java Common errors Error Cause Fix ArrayIndexOutOfBoundsException A row has fewer columns than expected Use get(fields, index) with a bounds check NumberFormatException Empty or quoted numeric field Trim, check isEmpty , strip quotes DateTimeParseException Date is not yyyy-MM-dd Print the bad value before parsing NullPointerException A missing field or a null result Guard with isEmpty or Optional UnsupportedOperationException List.of was modified Copy into new ArrayList<>(...) NoSuchFileException Wrong relative path Print Path.of(...).toAbsolutePath() ClassNotFoundException JDBC driver missing from classpath Add the connector jar Output has a trailing comma Join logic adds a separator after every item Join with String.join or skip the last separator"
  },
  {
    "id": "java-exam-checklist",
    "lang": "Java",
    "title": "Exam checklist",
    "html": "<ol>\n<li>Read the whole task before typing.</li>\n<li>Print the row count first. If that is wrong, nothing else matters.</li>\n<li>Parse one row and print it. Then loop.</li>\n<li>Handle the header and empty fields.</li>\n<li>Finish the easy points before the hard ones.</li>\n<li>Write the output file last, and print its path.</li>\n<li>Run the program after every task, not at the end.</li>\n</ol>\n",
    "plain": "Java Exam checklist Read the whole task before typing. Print the row count first. If that is wrong, nothing else matters. Parse one row and print it. Then loop. Handle the header and empty fields. Finish the easy points before the hard ones. Write the output file last, and print its path. Run the program after every task, not at the end."
  }
];
