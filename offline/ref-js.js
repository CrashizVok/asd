(function () {
    const lang = 'JavaScript';

    const entries = [
        {
            id: 'js-let-const-var',
            group: 'Basics',
            name: 'let, const, var',
            syntax: 'const name = "Anna";\nlet count = 0;',
            desc: 'Declares a variable. Use const by default, let when the value changes, and avoid var because it has function scope and hoisting surprises.',
            example: 'const hotel = "Danube View";\nlet nights = 3;\nnights = nights + 1;\nconsole.log(hotel, nights);'
        },
        {
            id: 'js-types',
            group: 'Basics',
            name: 'typeof',
            syntax: 'typeof value',
            desc: 'Returns the type as a string: string, number, boolean, undefined, object, function, symbol, or bigint. null reports object, a known quirk.',
            example: 'typeof "text";      // "string"\ntypeof 42;          // "number"\ntypeof true;        // "boolean"\ntypeof undefined;   // "undefined"\ntypeof null;        // "object"\ntypeof [];          // "object"\ntypeof function(){}; // "function"'
        },
        {
            id: 'js-template-literals',
            group: 'Basics',
            name: 'template literals',
            syntax: '`Hello ${name}`',
            desc: 'Backtick strings can contain expressions and span multiple lines.',
            example: 'const guest = "Anna";\nconst nights = 3;\nconsole.log(`${guest} stays ${nights} nights.`);'
        },
        {
            id: 'js-operators',
            group: 'Operators',
            name: 'arithmetic and comparison operators',
            syntax: '+ - * / % ** === !== > < >= <=',
            desc: 'Arithmetic works as expected. Use === and !== to compare without type conversion. == and != convert types and cause bugs.',
            example: 'const total = 2 * 3 + 1; // 7\nconst rest = 10 % 3;      // 1\nconst power = 2 ** 8;     // 256\n\nconsole.log(5 === "5"); // false\nconsole.log(5 == "5");  // true, avoid'
        },
        {
            id: 'js-logical',
            group: 'Operators',
            name: '&&, ||, !, ??',
            syntax: 'a && b\na || b\n!a\na ?? b',
            desc: 'Logical AND, OR, NOT, and nullish coalescing. ?? returns the right side only when the left is null or undefined.',
            example: 'const name = "";\nconst display = name || "Guest"; // "Guest"\nconst count = 0;\nconst safe = count ?? 10;        // 0\nconst total = count || 10;       // 10'
        },
        {
            id: 'js-if',
            group: 'Control flow',
            name: 'if, else if, else',
            syntax: 'if (condition) { ... } else { ... }',
            desc: 'Runs a block when a condition is truthy. Use else if for more branches.',
            example: 'const stars = 4;\n\nif (stars >= 5) {\n  console.log("Luxury");\n} else if (stars >= 3) {\n  console.log("Comfortable");\n} else {\n  console.log("Basic");\n}'
        },
        {
            id: 'js-switch',
            group: 'Control flow',
            name: 'switch',
            syntax: 'switch (value) { case 1: ... break; default: ... }',
            desc: 'Compares one value with several cases. break stops fall-through.',
            example: 'const day = "sat";\n\nswitch (day) {\n  case "sat":\n  case "sun":\n    console.log("Weekend");\n    break;\n  default:\n    console.log("Weekday");\n}'
        },
        {
            id: 'js-ternary',
            group: 'Control flow',
            name: 'ternary operator',
            syntax: 'condition ? valueIfTrue : valueIfFalse',
            desc: 'A short if/else expression. Use it for simple choices, not nested logic.',
            example: 'const nights = 1;\nconst label = nights === 1 ? "night" : "nights";\nconsole.log(`${nights} ${label}`);'
        },
        {
            id: 'js-for',
            group: 'Control flow',
            name: 'for loop',
            syntax: 'for (let i = 0; i < 5; i++) { ... }',
            desc: 'Runs a block a fixed number of times. The three parts are start, condition, and step.',
            example: 'for (let i = 1; i <= 3; i++) {\n  console.log(`Room ${i}`);\n}'
        },
        {
            id: 'js-for-of',
            group: 'Control flow',
            name: 'for...of',
            syntax: 'for (const item of array) { ... }',
            desc: 'Iterates over the values of an array, string, Map, or Set. Prefer it when you need the values.',
            example: 'const guests = ["Anna", "Ben", "Cara"];\n\nfor (const guest of guests) {\n  console.log(guest);\n}'
        },
        {
            id: 'js-for-in',
            group: 'Control flow',
            name: 'for...in',
            syntax: 'for (const key in object) { ... }',
            desc: 'Iterates over enumerable property names. Use it for objects, not arrays.',
            example: 'const hotel = { name: "Danube View", stars: 4 };\n\nfor (const key in hotel) {\n  console.log(key, hotel[key]);\n}'
        },
        {
            id: 'js-while',
            group: 'Control flow',
            name: 'while and do...while',
            syntax: 'while (condition) { ... }\ndo { ... } while (condition);',
            desc: 'while checks before each run. do...while runs at least once.',
            example: 'let tries = 0;\n\nwhile (tries < 3) {\n  tries++;\n}\n\nlet again;\ndo {\n  again = false;\n} while (again);'
        },
        {
            id: 'js-function',
            group: 'Functions',
            name: 'function declaration',
            syntax: 'function name(param) { return value; }',
            desc: 'A reusable block. It is hoisted, so it can be called before its definition in the same scope.',
            example: 'function nightsBetween(start, end) {\n  const day = 1000 * 60 * 60 * 24;\n  return Math.round((new Date(end) - new Date(start)) / day);\n}\n\nconsole.log(nightsBetween("2026-07-01", "2026-07-04")); // 3'
        },
        {
            id: 'js-arrow-function',
            group: 'Functions',
            name: 'arrow function',
            syntax: 'const fn = (a, b) => a + b;',
            desc: 'A shorter function. It does not have its own this, arguments, or super. Use it for callbacks and short helpers.',
            example: 'const double = (n) => n * 2;\nconst greet = (name) => {\n  console.log(`Hello ${name}`);\n};\n\nconsole.log(double(4)); // 8'
        },
        {
            id: 'js-default-params',
            group: 'Functions',
            name: 'default parameters',
            syntax: 'function greet(name = "Guest") { ... }',
            desc: 'Gives a parameter a value when the caller passes undefined.',
            example: 'function greet(name = "Guest", stars = 3) {\n  return `${name}, ${stars} stars`;\n}\n\nconsole.log(greet()); // Guest, 3 stars'
        },
        {
            id: 'js-rest-spread',
            group: 'Functions',
            name: 'rest and spread',
            syntax: 'function sum(...numbers) {}\nconst copy = [...items];',
            desc: '... collects remaining arguments into an array, or spreads an iterable into values.',
            example: 'function sum(...numbers) {\n  return numbers.reduce((total, n) => total + n, 0);\n}\n\nconst first = [1, 2];\nconst all = [...first, 3, 4];\nconsole.log(sum(...all)); // 10'
        },
        {
            id: 'js-array',
            group: 'Arrays',
            name: 'array creation and indexing',
            syntax: 'const list = [1, 2, 3];\nlist[0]',
            desc: 'Arrays hold ordered values. Indexes start at 0. length is the number of items.',
            example: 'const hotels = ["Danube View", "Lake Garden", "City Loft"];\n\nconsole.log(hotels[0]);      // Danube View\nconsole.log(hotels.length);   // 3\nconsole.log(hotels.at(-1));   // City Loft'
        },
        {
            id: 'js-array-push-pop',
            group: 'Arrays',
            name: 'push, pop, shift, unshift',
            syntax: 'list.push(value)\nlist.pop()',
            desc: 'push adds to the end, pop removes from the end, unshift adds to the start, shift removes from the start. They change the array.',
            example: 'const list = ["a", "b"];\nlist.push("c");    // ["a", "b", "c"]\nlist.pop();        // ["a", "b"]\nlist.unshift("z"); // ["z", "a", "b"]\nlist.shift();      // ["a", "b"]'
        },
        {
            id: 'js-array-map',
            group: 'Arrays',
            name: 'map',
            syntax: 'array.map(item => newValue)',
            desc: 'Creates a new array by transforming every item. The original array is not changed.',
            example: 'const prices = [80, 120, 95];\nconst withTax = prices.map((price) => Math.round(price * 1.18));\n\nconsole.log(withTax); // [94, 142, 112]'
        },
        {
            id: 'js-array-filter',
            group: 'Arrays',
            name: 'filter',
            syntax: 'array.filter(item => condition)',
            desc: 'Creates a new array with only the items that pass the test.',
            example: 'const hotels = [\n  { name: "Danube View", stars: 4 },\n  { name: "City Loft", stars: 5 },\n  { name: "Lake Garden", stars: 3 }\n];\n\nconst top = hotels.filter((hotel) => hotel.stars >= 4);\nconsole.log(top.length); // 2'
        },
        {
            id: 'js-array-reduce',
            group: 'Arrays',
            name: 'reduce',
            syntax: 'array.reduce((total, item) => total + item, 0)',
            desc: 'Reduces the array to one value. The second argument is the starting value.',
            example: 'const bookings = [2, 3, 1, 4];\nconst guests = bookings.reduce((total, n) => total + n, 0);\n\nconsole.log(guests); // 10'
        },
        {
            id: 'js-array-find',
            group: 'Arrays',
            name: 'find and findIndex',
            syntax: 'array.find(item => condition)',
            desc: 'Returns the first matching item, or undefined. findIndex returns its index, or -1.',
            example: 'const hotels = [\n  { id: 1, name: "Danube View" },\n  { id: 2, name: "City Loft" }\n];\n\nconst hotel = hotels.find((item) => item.id === 2);\nconsole.log(hotel.name); // City Loft\nconsole.log(hotels.findIndex((item) => item.id === 2)); // 1'
        },
        {
            id: 'js-array-some-every',
            group: 'Arrays',
            name: 'some and every',
            syntax: 'array.some(test)\narray.every(test)',
            desc: 'some is true when at least one item passes. every is true when all items pass.',
            example: 'const stars = [4, 5, 3];\n\nconsole.log(stars.some((n) => n === 5));  // true\nconsole.log(stars.every((n) => n >= 3)); // true'
        },
        {
            id: 'js-array-sort',
            group: 'Arrays',
            name: 'sort',
            syntax: 'array.sort((a, b) => a - b)',
            desc: 'Sorts in place. Without a compare function, values are converted to strings. Copy first if you need the original order.',
            example: 'const names = ["Cara", "Anna", "Ben"];\nconst sorted = [...names].sort((a, b) => a.localeCompare(b));\n\nconst numbers = [10, 2, 30];\nnumbers.sort((a, b) => a - b); // [2, 10, 30]'
        },
        {
            id: 'js-array-includes-join',
            group: 'Arrays',
            name: 'includes and join',
            syntax: 'array.includes(value)\narray.join(", ")',
            desc: 'includes checks for a value. join turns the array into a string with a separator.',
            example: 'const tags = ["pool", "wifi", "parking"];\n\nconsole.log(tags.includes("wifi")); // true\nconsole.log(tags.join(" / "));     // pool / wifi / parking'
        },
        {
            id: 'js-array-slice-splice',
            group: 'Arrays',
            name: 'slice and splice',
            syntax: 'array.slice(start, end)\narray.splice(start, deleteCount, ...items)',
            desc: 'slice copies a part without changing the original. splice changes the original by removing or adding items.',
            example: 'const list = ["a", "b", "c", "d"];\n\nconsole.log(list.slice(1, 3)); // ["b", "c"]\n\nconst copy = [...list];\ncopy.splice(1, 1, "B");\nconsole.log(copy); // ["a", "B", "c", "d"]'
        },
        {
            id: 'js-array-flat',
            group: 'Arrays',
            name: 'flat and flatMap',
            syntax: 'array.flat()\narray.flatMap(item => [values])',
            desc: 'flat removes nested array levels. flatMap maps and flattens one level.',
            example: 'const nested = [[1, 2], [3], [4, 5]];\nconsole.log(nested.flat()); // [1, 2, 3, 4, 5]\n\nconst words = ["a b", "c d"];\nconsole.log(words.flatMap((text) => text.split(" "))); // ["a", "b", "c", "d"]'
        },
        {
            id: 'js-object',
            group: 'Objects',
            name: 'object literal',
            syntax: 'const obj = { key: value };',
            desc: 'Groups related values under named keys. Read with dot or bracket notation.',
            example: 'const hotel = {\n  name: "Danube View",\n  stars: 4,\n  city: "Budapest"\n};\n\nconsole.log(hotel.name);\nconsole.log(hotel["stars"]);'
        },
        {
            id: 'js-object-keys-values-entries',
            group: 'Objects',
            name: 'Object.keys, values, entries',
            syntax: 'Object.keys(obj)\nObject.values(obj)\nObject.entries(obj)',
            desc: 'Returns an array of keys, values, or [key, value] pairs.',
            example: 'const hotel = { name: "Danube View", stars: 4 };\n\nconsole.log(Object.keys(hotel));    // ["name", "stars"]\nconsole.log(Object.values(hotel));  // ["Danube View", 4]\nconsole.log(Object.entries(hotel)); // [["name", "Danube View"], ["stars", 4]]'
        },
        {
            id: 'js-destructuring',
            group: 'Objects',
            name: 'destructuring',
            syntax: 'const { name, stars } = hotel;',
            desc: 'Extracts values from objects or arrays into variables. Use a colon to rename, and = for a default.',
            example: 'const hotel = { name: "Danube View", stars: 4, city: "Budapest" };\nconst { name, stars, city: town = "Unknown" } = hotel;\n\nconst [first, second] = ["a", "b"];\nconsole.log(name, stars, town, first, second);'
        },
        {
            id: 'js-optional-chaining',
            group: 'Objects',
            name: 'optional chaining ?.',
            syntax: 'obj?.prop?.method?.()',
            desc: 'Stops and returns undefined when a value is null or undefined, instead of throwing.',
            example: 'const hotel = { owner: { name: "Anna" } };\n\nconsole.log(hotel.owner?.name);    // Anna\nconsole.log(hotel.contact?.email); // undefined'
        },
        {
            id: 'js-string',
            group: 'Strings',
            name: 'string basics',
            syntax: 'const text = "hello";',
            desc: 'Strings are immutable text values. Use single, double, or backtick quotes.',
            example: 'const first = "Anna";\nconst last = "Kovacs";\nconst full = `${first} ${last}`;\n\nconsole.log(full.length); // 10\nconsole.log(full.toUpperCase()); // ANNA KOVACS'
        },
        {
            id: 'js-string-methods',
            group: 'Strings',
            name: 'includes, startsWith, endsWith',
            syntax: 'text.includes("word")',
            desc: 'Checks whether a string contains, starts with, or ends with another string. They are case sensitive.',
            example: 'const email = "anna@example.com";\n\nconsole.log(email.includes("@"));       // true\nconsole.log(email.startsWith("anna"));  // true\nconsole.log(email.endsWith(".com"));    // true'
        },
        {
            id: 'js-string-slice',
            group: 'Strings',
            name: 'slice, substring, substr',
            syntax: 'text.slice(start, end)',
            desc: 'Returns part of a string. slice accepts negative indexes. substring swaps start and end if needed. Prefer slice.',
            example: 'const date = "2026-07-01";\n\nconsole.log(date.slice(0, 4));  // 2026\nconsole.log(date.slice(5, 7));  // 07\nconsole.log(date.slice(-2));    // 01'
        },
        {
            id: 'js-string-split-replace',
            group: 'Strings',
            name: 'split, replace, replaceAll',
            syntax: 'text.split(",")\ntext.replace("a", "b")',
            desc: 'split turns a string into an array. replace changes the first match; replaceAll changes every match.',
            example: 'const line = "Anna,Budapest,4";\nconst parts = line.split(",");\nconsole.log(parts); // ["Anna", "Budapest", "4"]\n\nconst text = "a-b-c";\nconsole.log(text.replace("-", "+"));    // a+b-c\nconsole.log(text.replaceAll("-", "+")); // a+b+c'
        },
        {
            id: 'js-string-trim',
            group: 'Strings',
            name: 'trim, trimStart, trimEnd',
            syntax: 'text.trim()',
            desc: 'Removes whitespace from both ends, or one end. Useful for form input.',
            example: 'const input = "  Anna  ";\nconsole.log(input.trim());      // "Anna"\nconsole.log(input.trimStart()); // "Anna  "\nconsole.log(input.trimEnd());   // "  Anna"'
        },
        {
            id: 'js-string-pad',
            group: 'Strings',
            name: 'padStart and padEnd',
            syntax: 'text.padStart(5, "0")',
            desc: 'Pads a string to a length with a fill character. Useful for numbers and IDs.',
            example: 'const id = "42";\nconsole.log(id.padStart(4, "0")); // 0042\nconsole.log("7".padEnd(3, "."));  // 7..'
        },
        {
            id: 'js-number',
            group: 'Numbers and Math',
            name: 'Number and parseInt',
            syntax: 'Number(value)\nparseInt(value, 10)',
            desc: 'Number converts a value to a number and returns NaN when it cannot. parseInt reads an integer and stops at the first non-digit.',
            example: 'console.log(Number("42"));      // 42\nconsole.log(Number("42px"));    // NaN\nconsole.log(parseInt("42px", 10)); // 42\nconsole.log(Number(""));        // 0'
        },
        {
            id: 'js-number-methods',
            group: 'Numbers and Math',
            name: 'toFixed, isNaN, Number.isFinite',
            syntax: 'value.toFixed(2)\nNumber.isNaN(value)',
            desc: 'toFixed formats with decimals and returns a string. Number.isNaN checks specifically for NaN.',
            example: 'const price = 12.345;\nconsole.log(price.toFixed(2)); // "12.35"\n\nconsole.log(Number.isNaN(NaN));    // true\nconsole.log(Number.isFinite(42));  // true\nconsole.log(Number.isFinite(Infinity)); // false'
        },
        {
            id: 'js-math',
            group: 'Numbers and Math',
            name: 'Math',
            syntax: 'Math.round(x)\nMath.max(...values)',
            desc: 'Math holds number helpers: round, floor, ceil, abs, min, max, random, pow, sqrt.',
            example: 'console.log(Math.round(4.6)); // 5\nconsole.log(Math.floor(4.9)); // 4\nconsole.log(Math.ceil(4.1));  // 5\nconsole.log(Math.max(3, 9, 2)); // 9\nconsole.log(Math.random());    // 0 to below 1'
        },
        {
            id: 'js-random-int',
            group: 'Numbers and Math',
            name: 'random integer',
            syntax: 'Math.floor(Math.random() * max)',
            desc: 'Returns a random integer from 0 to max - 1. Add min and a range for a custom range.',
            example: 'function randomInt(min, max) {\n  return Math.floor(Math.random() * (max - min + 1)) + min;\n}\n\nconsole.log(randomInt(1, 6)); // 1 to 6'
        },
        {
            id: 'js-date',
            group: 'Dates and JSON',
            name: 'Date',
            syntax: 'new Date()\nnew Date("2026-07-01")',
            desc: 'Creates a date object. Use ISO strings (yyyy-mm-dd) for predictable parsing.',
            example: 'const start = new Date("2026-07-01");\nconst end = new Date("2026-07-04");\nconst day = 1000 * 60 * 60 * 24;\n\nconsole.log((end - start) / day); // 3'
        },
        {
            id: 'js-date-parts',
            group: 'Dates and JSON',
            name: 'getFullYear, getMonth, getDate',
            syntax: 'date.getFullYear()\ndate.getMonth()',
            desc: 'Reads date parts. getMonth is 0-based: January is 0, December is 11.',
            example: 'const date = new Date("2026-07-01");\n\nconsole.log(date.getFullYear()); // 2026\nconsole.log(date.getMonth() + 1); // 7\nconsole.log(date.getDate());      // 1'
        },
        {
            id: 'js-date-format',
            group: 'Dates and JSON',
            name: 'toISOString and toLocaleDateString',
            syntax: 'date.toISOString().slice(0, 10)',
            desc: 'toISOString gives a UTC string. slice(0, 10) keeps yyyy-mm-dd. toLocaleDateString formats for a locale.',
            example: 'const date = new Date("2026-07-01T12:00:00");\n\nconsole.log(date.toISOString().slice(0, 10)); // 2026-07-01\nconsole.log(date.toLocaleDateString("hu-HU")); // 2026. 07. 01.'
        },
        {
            id: 'js-json',
            group: 'Dates and JSON',
            name: 'JSON.stringify and JSON.parse',
            syntax: 'JSON.stringify(value)\nJSON.parse(text)',
            desc: 'Converts a value to JSON text, or parses JSON text into a value. Functions and undefined are dropped by stringify.',
            example: 'const hotel = { name: "Danube View", stars: 4 };\nconst text = JSON.stringify(hotel);\nconsole.log(text); // {"name":"Danube View","stars":4}\n\nconst copy = JSON.parse(text);\nconsole.log(copy.name); // Danube View'
        },
        {
            id: 'js-dom-queryselector',
            group: 'DOM',
            name: 'querySelector and querySelectorAll',
            syntax: 'document.querySelector(".card")',
            desc: 'Finds the first element that matches a CSS selector. querySelectorAll returns a NodeList of all matches.',
            example: 'const title = document.querySelector("h1");\nconst cards = document.querySelectorAll(".card");\n\nconsole.log(title.textContent);\nconsole.log(cards.length);'
        },
        {
            id: 'js-dom-getelementbyid',
            group: 'DOM',
            name: 'getElementById',
            syntax: 'document.getElementById("content")',
            desc: 'Finds one element by id. It is fast and clear when the id is known.',
            example: 'const content = document.getElementById("content");\ncontent.textContent = "Loaded";'
        },
        {
            id: 'js-dom-textcontent-innerhtml',
            group: 'DOM',
            name: 'textContent and innerHTML',
            syntax: 'element.textContent = "text"\nelement.innerHTML = "<b>text</b>"',
            desc: 'textContent sets plain text safely. innerHTML parses HTML; never insert untrusted input with it.',
            example: 'const box = document.querySelector("#box");\nbox.textContent = "Hello";\nbox.innerHTML = "<strong>Hello</strong>";'
        },
        {
            id: 'js-dom-classlist',
            group: 'DOM',
            name: 'classList',
            syntax: 'element.classList.add("active")',
            desc: 'Adds, removes, toggles, and checks classes without editing the class string.',
            example: 'const card = document.querySelector(".card");\ncard.classList.add("is-open");\ncard.classList.toggle("is-open");\nconsole.log(card.classList.contains("is-open")); // false'
        },
        {
            id: 'js-dom-style-attribute',
            group: 'DOM',
            name: 'style and setAttribute',
            syntax: 'element.style.color = "red"\nelement.setAttribute("aria-hidden", "true")',
            desc: 'style changes inline CSS. setAttribute changes any HTML attribute; removeAttribute removes it.',
            example: 'const panel = document.querySelector(".panel");\npanel.style.display = "none";\npanel.setAttribute("aria-hidden", "true");\npanel.removeAttribute("aria-hidden");'
        },
        {
            id: 'js-dom-create-append',
            group: 'DOM',
            name: 'createElement and append',
            syntax: 'const el = document.createElement("li")\nparent.append(el)',
            desc: 'Creates a new element and inserts it. append accepts nodes and strings; appendChild accepts nodes only.',
            example: 'const list = document.querySelector("ul");\nconst item = document.createElement("li");\nitem.textContent = "New booking";\nlist.append(item);'
        },
        {
            id: 'js-dom-remove',
            group: 'DOM',
            name: 'remove',
            syntax: 'element.remove()',
            desc: 'Removes the element from the document.',
            example: 'const row = document.querySelector("tr.selected");\nif (row) row.remove();'
        },
        {
            id: 'js-event-addeventlistener',
            group: 'Events',
            name: 'addEventListener',
            syntax: 'element.addEventListener("click", handler)',
            desc: 'Runs a function when an event happens. Use named functions when you need to remove the listener later.',
            example: 'const button = document.querySelector("button");\n\nbutton.addEventListener("click", () => {\n  console.log("clicked");\n});'
        },
        {
            id: 'js-event-object',
            group: 'Events',
            name: 'event object',
            syntax: 'event.target\nevent.preventDefault()',
            desc: 'The handler receives an event. target is the element that fired it. preventDefault stops the browser default action.',
            example: 'const form = document.querySelector("form");\n\nform.addEventListener("submit", (event) => {\n  event.preventDefault();\n  const data = new FormData(form);\n  console.log(data.get("email"));\n});'
        },
        {
            id: 'js-event-delegation',
            group: 'Events',
            name: 'event delegation',
            syntax: 'parent.addEventListener("click", e => e.target.closest(...))',
            desc: 'One listener on a parent handles clicks on many children, including future ones.',
            example: 'const list = document.querySelector(".card-grid");\n\nlist.addEventListener("click", (event) => {\n  const card = event.target.closest(".card");\n  if (!card) return;\n  console.log(card.dataset.id);\n});'
        },
        {
            id: 'js-event-stop-propagation',
            group: 'Events',
            name: 'stopPropagation',
            syntax: 'event.stopPropagation()',
            desc: 'Stops the event from bubbling to parent elements. Use it when a child click should not trigger the parent card click.',
            example: 'const ownerButton = document.querySelector(".owner-button");\n\nownerButton.addEventListener("click", (event) => {\n  event.stopPropagation();\n  openOwner();\n});'
        },
        {
            id: 'js-formdata',
            group: 'Events',
            name: 'FormData',
            syntax: 'const data = new FormData(form)',
            desc: 'Collects form fields as key/value pairs. Use get, getAll, and entries.',
            example: 'const form = document.querySelector("form");\nconst data = new FormData(form);\n\nconsole.log(data.get("email"));\nfor (const [key, value] of data.entries()) {\n  console.log(key, value);\n}'
        },
        {
            id: 'js-input-value',
            group: 'Events',
            name: 'input value and checked',
            syntax: 'input.value\ncheckbox.checked',
            desc: 'Reads or sets a form control. value is a string; convert it with Number when needed.',
            example: 'const email = document.querySelector("#email");\nconst adults = document.querySelector("#adults");\nconst agree = document.querySelector("#agree");\n\nconsole.log(email.value);\nconsole.log(Number(adults.value));\nconsole.log(agree.checked);'
        },
        {
            id: 'js-fetch',
            group: 'Async',
            name: 'fetch',
            syntax: 'fetch(url).then(response => response.json())',
            desc: 'Sends an HTTP request. fetch does not reject on 404 or 500; check response.ok.',
            example: 'async function loadHotels() {\n  const response = await fetch("/api/hotels");\n  if (!response.ok) throw new Error(`HTTP ${response.status}`);\n  return response.json();\n}'
        },
        {
            id: 'js-async-await',
            group: 'Async',
            name: 'async and await',
            syntax: 'async function load() { const data = await fetch(url); }',
            desc: 'async makes a function return a Promise. await pauses inside it until the Promise settles. Use try/catch for errors.',
            example: 'async function loadBookings() {\n  try {\n    const response = await fetch("/api/bookings");\n    if (!response.ok) throw new Error("Request failed");\n    const data = await response.json();\n    console.log(data);\n  } catch (error) {\n    console.error(error.message);\n  }\n}'
        },
        {
            id: 'js-promise',
            group: 'Async',
            name: 'Promise',
            syntax: 'new Promise((resolve, reject) => { ... })',
            desc: 'Represents a value that will arrive later. Use then, catch, and finally, or async/await.',
            example: 'const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));\n\nwait(500).then(() => {\n  console.log("half a second later");\n});'
        },
        {
            id: 'js-promise-all',
            group: 'Async',
            name: 'Promise.all',
            syntax: 'await Promise.all([p1, p2])',
            desc: 'Waits for all promises and returns their results in order. It rejects if any promise rejects.',
            example: 'const [hotels, bookings] = await Promise.all([\n  fetch("/api/hotels").then((r) => r.json()),\n  fetch("/api/bookings").then((r) => r.json())\n]);'
        },
        {
            id: 'js-try-catch',
            group: 'Errors',
            name: 'try, catch, finally, throw',
            syntax: 'try { ... } catch (error) { ... } finally { ... }',
            desc: 'Handles errors. throw raises one. finally runs whether or not an error happened.',
            example: 'try {\n  const data = JSON.parse(text);\n  console.log(data);\n} catch (error) {\n  console.error("Bad JSON:", error.message);\n} finally {\n  console.log("done");\n}'
        },
        {
            id: 'js-class',
            group: 'Classes',
            name: 'class',
            syntax: 'class Name { constructor() {} method() {} }',
            desc: 'A template for objects. The constructor runs on new. Methods live on the prototype.',
            example: 'class Booking {\n  constructor(guest, nights) {\n    this.guest = guest;\n    this.nights = nights;\n  }\n\n  get total() {\n    return this.nights * 80;\n  }\n}\n\nconst booking = new Booking("Anna", 3);\nconsole.log(booking.total); // 240'
        },
        {
            id: 'js-class-inheritance',
            group: 'Classes',
            name: 'extends and super',
            syntax: 'class Child extends Parent { constructor() { super(); } }',
            desc: 'Creates a subclass. super calls the parent constructor or method.',
            example: 'class Room {\n  constructor(number) {\n    this.number = number;\n  }\n}\n\nclass Suite extends Room {\n  constructor(number) {\n    super(number);\n    this.kitchen = true;\n  }\n}'
        },
        {
            id: 'js-map',
            group: 'Collections',
            name: 'Map',
            syntax: 'const map = new Map()\nmap.set(key, value)',
            desc: 'A key/value collection that allows any key type and keeps insertion order. Use it over an object when keys are dynamic.',
            example: 'const counts = new Map();\ncounts.set("Anna", 2);\ncounts.set("Ben", 1);\n\nconsole.log(counts.get("Anna")); // 2\nconsole.log(counts.has("Cara")); // false\nfor (const [name, total] of counts) {\n  console.log(name, total);\n}'
        },
        {
            id: 'js-set',
            group: 'Collections',
            name: 'Set',
            syntax: 'const set = new Set(array)',
            desc: 'A collection of unique values. It removes duplicates when built from an array.',
            example: 'const guests = ["Anna", "Ben", "Anna"];\nconst unique = [...new Set(guests)];\nconsole.log(unique); // ["Anna", "Ben"]'
        },
        {
            id: 'js-regex',
            group: 'Collections',
            name: 'regular expressions',
            syntax: '/pattern/flags\nnew RegExp("pattern", "g")',
            desc: 'Matches text patterns. Common flags: g global, i case-insensitive, m multiline.',
            example: 'const email = "anna@example.com";\nconst pattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n\nconsole.log(pattern.test(email)); // true\nconsole.log("2026-07-01".replace(/-/g, "/")); // 2026/07/01'
        },
        {
            id: 'js-localstorage',
            group: 'Storage',
            name: 'localStorage',
            syntax: 'localStorage.setItem("key", "value")\nlocalStorage.getItem("key")',
            desc: 'Stores strings in the browser across reloads. Use JSON.stringify and JSON.parse for objects.',
            example: 'localStorage.setItem("theme", "dark");\nconsole.log(localStorage.getItem("theme")); // dark\n\nconst user = { name: "Anna" };\nlocalStorage.setItem("user", JSON.stringify(user));\nconst saved = JSON.parse(localStorage.getItem("user"));'
        },
        {
            id: 'js-sessionstorage',
            group: 'Storage',
            name: 'sessionStorage',
            syntax: 'sessionStorage.setItem("key", "value")',
            desc: 'Like localStorage, but the data is cleared when the tab closes.',
            example: 'sessionStorage.setItem("step", "2");\nconsole.log(sessionStorage.getItem("step")); // 2'
        },
        {
            id: 'js-settimeout',
            group: 'Timers',
            name: 'setTimeout and clearTimeout',
            syntax: 'const id = setTimeout(fn, 500)\nclearTimeout(id)',
            desc: 'Runs a function once after a delay in milliseconds. clearTimeout cancels it.',
            example: 'const id = setTimeout(() => {\n  console.log("500 ms later");\n}, 500);\n\n// clearTimeout(id); // cancel if needed'
        },
        {
            id: 'js-setinterval',
            group: 'Timers',
            name: 'setInterval and clearInterval',
            syntax: 'const id = setInterval(fn, 1000)\nclearInterval(id)',
            desc: 'Runs a function repeatedly. Always store the id and clear it when the component or page no longer needs it.',
            example: 'let seconds = 0;\nconst id = setInterval(() => {\n  seconds++;\n  console.log(seconds);\n  if (seconds === 3) clearInterval(id);\n}, 1000);'
        },
        {
            id: 'js-modules',
            group: 'Modules',
            name: 'import and export',
            syntax: 'export function fn() {}\nimport { fn } from "./file.js";',
            desc: 'Splits code into modules. Use export to expose values and import to use them. In the browser, the script needs type="module".',
            example: '// math.js\nexport function add(a, b) {\n  return a + b;\n}\n\n// app.js\nimport { add } from "./math.js";\nconsole.log(add(2, 3)); // 5'
        },
        {
            id: 'js-console',
            group: 'Basics',
            name: 'console',
            syntax: 'console.log(value)',
            desc: 'Prints values for debugging. Also console.error, warn, table, and time.',
            example: 'console.log("text", 42, { name: "Anna" });\nconsole.error("Something failed");\nconsole.table([{ name: "Anna" }, { name: "Ben" }]);'
        }
    ];

    window.WIKI_REFERENCE = (window.WIKI_REFERENCE || []).concat(
        entries.map((entry) => ({ lang, ...entry }))
    );
})();
