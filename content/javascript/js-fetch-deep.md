---
id: js-fetch-deep
lang: JavaScript
title: fetch and async/await
---

# fetch and async/await

## Simplest form

```js
// Data shape: fetch resolves with a Response, not with your data.
// Response has ok, status, statusText, headers, and body readers: json(), text(), blob().
const response = await fetch("/api/hotels");
const hotels = await response.json(); // array of { hotel_id, name, city, stars }
```

Two awaits, not one. The first waits for the response headers. The second waits for the body and parses it. Skipping the second await leaves you with a `Response` object, and `hotels` is then not an array.

## What fetch gives you

`fetch(input, init)` returns a promise for a `Response`. It rejects only when the request could not be made: no network, DNS failure, blocked by CORS, or the request was aborted. An HTTP error such as 404 or 500 is a successful fetch. The server answered, so the promise fulfils, and `response.ok` is `false`.

That single rule explains most fetch bugs in student code. The `catch` block never runs for a 500, so the page shows an empty list and a console that looks clean.

```js
// The correct shape of every request: check ok before reading the body.
async function loadHotels() {
  const response = await fetch("/api/hotels");
  if (!response.ok) {
    throw new Error(`hotels: HTTP ${response.status}`);
  }
  return response.json();
}
```

`response.ok` is true for status codes 200 to 299. Check it on every request, including DELETE and PUT, where the body is often empty.

## Reading the body once

The body is a stream. You can read it once. Calling `json()` and then `text()` throws `TypeError: body used already`. If you need both, clone before reading, or read text and parse it yourself.

```js
// Data shape: clone() gives a second independent stream.
const response = await fetch("/api/hotels");
const copy = response.clone();

const data = await response.json();
const raw = await copy.text(); // useful in a log or an error report
```

`response.json()` rejects when the body is not valid JSON, for example an HTML error page from a proxy. That rejection is a `SyntaxError`, and it looks the same as a programming error unless you catch it near the call.

`response.text()` is the right reader for endpoints that return plain text, CSV, or an empty body. `response.blob()` is for images and downloads.

## GET with a query string

Never glue user input into a URL by hand. `URLSearchParams` encodes spaces, ampersands, and non Latin characters for you.

```js
// Data shape: URLSearchParams turns an object into city=Zurich&stars=4.
const params = new URLSearchParams({
  city: "Zurich",
  stars: "4",
  adults: "2"
});

const response = await fetch(`/api/hotels?${params}`);
const hotels = await response.json();
```

For a relative URL, construct it against the current page so the path is unambiguous:

```js
const url = new URL("/api/hotels", window.location.origin);
url.searchParams.set("city", "Zurich");
const response = await fetch(url);
```

`fetch` sends `GET` by default. It also sends no credentials to other origins unless you ask: set `credentials: "include"` when the API needs cookies, and the server must allow it with `Access-Control-Allow-Credentials`.

## POST with JSON

A JSON POST needs three things: the method, a `Content-Type` header, and a string body. Sending an object without `JSON.stringify` produces `[object Object]`, and the server sees garbage. The `Content-Type` header is what tells the server how to parse the body.

```js
// Data shape: request body { first_name, last_name, adults, children, hotel_id }.
async function createBooking(booking) {
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking)
  });

  if (!response.ok) {
    throw new Error(`booking failed: HTTP ${response.status}`);
  }

  return response.json(); // usually the created row, with its new id
}
```

Do not set `Content-Type` for `FormData`. The browser adds the multipart boundary itself, and a manual header without the boundary breaks the upload.

## PUT, PATCH, DELETE

`PUT` replaces a resource, so send the whole object. `PATCH` sends only the changed fields. `DELETE` usually sends nothing and often answers with 204 No Content, which has no body to parse.

```js
// PUT: replace a hotel row
async function replaceHotel(hotelId, hotel) {
  const response = await fetch(`/api/hotels/${hotelId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hotel)
  });
  if (!response.ok) throw new Error(`replace failed: HTTP ${response.status}`);
  return response.json();
}

// PATCH: change one field
async function renameHotel(hotelId, name) {
  const response = await fetch(`/api/hotels/${hotelId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });
  if (!response.ok) throw new Error(`rename failed: HTTP ${response.status}`);
  return response.json();
}

// DELETE: no body in, usually no body out
async function deleteHotel(hotelId) {
  const response = await fetch(`/api/hotels/${hotelId}`, { method: "DELETE" });
  if (!response.ok) throw new Error(`delete failed: HTTP ${response.status}`);
  return response.status === 204 ? null : response.json();
}
```

The last line handles both servers that answer 204 and servers that return the deleted row. Reading `json()` on a 204 rejects, which is a confusing error for a successful delete.

## Headers you will meet

`headers` accepts a plain object or a `Headers` instance. Names are case insensitive.

- `Content-Type: application/json` on every JSON request body.
- `Accept: application/json` when the server can answer in several formats.
- `Authorization: Bearer <token>` for protected routes. Never hardcode a real token in a file you commit.
- `Accept-Language` when the response text depends on locale.

Reading response headers is limited by CORS. On a cross origin response you only see a few simple headers unless the server lists the others in `Access-Control-Expose-Headers`.

```js
const response = await fetch("/api/bookings", {
  headers: { Accept: "application/json", Authorization: `Bearer ${token}` }
});

console.log(response.headers.get("content-type"));
console.log(response.headers.get("x-total-count"));
```

## Errors: three different failures

1. Network or CORS failure. The promise rejects with `TypeError: Failed to fetch`. There is no status code to show, because nothing came back.
2. HTTP failure. The promise fulfils, `ok` is false, `status` holds the code. This is your job to detect.
3. Body failure. `json()` rejects on malformed JSON, even when `ok` was true.

A helper that makes all three look the same keeps callers simple:

```js
// Data shape: returns parsed JSON or throws an Error with a readable message.
async function requestJson(url, options = {}) {
  let response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    if (error.name === "AbortError") throw error; // let the caller ignore it
    throw new Error(`network error: ${error.message}`);
  }

  if (!response.ok) {
    // try to read a server message, fall back to the status
    let detail = "";
    try {
      const body = await response.json();
      detail = body.message ? `: ${body.message}` : "";
    } catch {
      detail = "";
    }
    throw new Error(`HTTP ${response.status}${detail}`);
  }

  if (response.status === 204) return null;
  return response.json();
}
```

The inner `try` around the error body is deliberate. A failed request often returns HTML, so parsing it as JSON would replace a useful HTTP error with a syntax error.

## AbortController and timeouts

`AbortController` cancels an in flight request. The fetch promise rejects with an error whose `name` is `"AbortError"`, and the server may never see the request complete.

```js
// Data shape: controller.signal goes into fetch options; controller.abort() cancels.
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch("/api/hotels", { signal: controller.signal });
  const hotels = await response.json();
  render(hotels);
} catch (error) {
  if (error.name === "AbortError") console.warn("request cancelled");
  else renderError(error.message);
} finally {
  clearTimeout(timeout); // never leave a timer behind
}
```

Modern browsers also accept `AbortSignal.timeout(5000)`, and `AbortSignal.any([a, b])` to combine a user cancel with a timeout. Check the target browser before relying on them in an exam project.

The abort error is not a failure worth showing. Filter it out of the error path, or the user sees "aborted" every time they click a second tab quickly.

## Race conditions: the stale response problem

`fetch` promises settle in whatever order the network decides. Two requests from one search box can return out of order, and the older answer can overwrite the newer one. The cure has two parts: a token that identifies the newest request, and an abort that stops the older one.

```js
// Data shape: latest is a counter, controller is the current request's cancel handle.
let latest = 0;
let controller = null;

async function loadCity(city) {
  const token = ++latest;
  controller?.abort();
  controller = new AbortController();

  setStatus("loading");

  try {
    const response = await fetch(
      `/api/hotels?city=${encodeURIComponent(city)}`,
      { signal: controller.signal }
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const hotels = await response.json();

    if (token !== latest) return; // an older request, drop it
    setStatus("success", hotels);
  } catch (error) {
    if (error.name === "AbortError") return;
    if (token !== latest) return;
    setStatus("error", error.message);
  }
}
```

The token check is still needed after the abort. An answer can already be in the queue when `abort()` is called, and aborting after the body arrived does not help. Two cheap checks beat one clever one.

## Loading and error states

A request has four screen states, not two. Write them down once and render from the state, not from scattered booleans.

```js
// Data shape: { status, data, message } where status is idle | loading | success | error.
const state = { status: "idle", data: [], message: "" };

function setStatus(status, dataOrMessage) {
  state.status = status;
  if (status === "success") state.data = dataOrMessage;
  if (status === "error") state.message = dataOrMessage;
  render();
}
```

`render` reads `state.status` and shows a spinner, a table, or a message. It never starts a request. Keeping the two apart makes the app testable by hand: set the state, look at the screen.

## Examples

### Example 1: GET a list and render it

```js
// Data shape: GET /api/hotels answers [{ hotel_id, name, city, stars, owner_email }].

async function loadHotels() {
  const response = await fetch("/api/hotels");
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function showHotels() {
  const list = document.querySelector("#hotels");
  if (!list) return;

  list.textContent = "Loading...";

  try {
    const hotels = await loadHotels();
    list.innerHTML = "";
    for (const hotel of hotels) {
      const item = document.createElement("li");
      item.textContent = `${hotel.name}, ${hotel.city}, ${hotel.stars} stars`;
      item.dataset.id = hotel.hotel_id;
      list.append(item);
    }
  } catch (error) {
    list.textContent = `Could not load hotels: ${error.message}`;
  }
}

showHotels();
```

### Example 2: POST a booking and read the created row

```js
// Data shape: sent { first_name, last_name, email, adults, children, hotel_id }.
// Returned: the same fields plus booking_id and start_date.

async function submitBooking(form) {
  const data = new FormData(form);
  const payload = {
    first_name: data.get("first_name"),
    last_name: data.get("last_name"),
    email: data.get("email"),
    adults: Number(data.get("adults")),
    children: Number(data.get("children")),
    hotel_id: Number(data.get("hotel_id"))
  };

  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (response.status === 422) {
    const problem = await response.json();
    throw new Error(problem.message || "Some fields are not valid");
  }

  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  return response.json();
}

document.querySelector("#booking-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const output = document.querySelector("#booking-result");
  output.textContent = "Saving...";

  try {
    const saved = await submitBooking(event.target);
    output.textContent = `Saved booking #${saved.booking_id}`;
  } catch (error) {
    output.textContent = `Not saved: ${error.message}`;
  }
});
```

### Example 3: DELETE with a confirmation and a refresh

```js
// Data shape: DELETE /api/hotels/7 answers 204, or 404 when the row is gone.
async function removeHotel(hotelId) {
  if (!confirm("Delete this hotel?")) return false;

  const response = await fetch(`/api/hotels/${hotelId}`, { method: "DELETE" });

  if (response.status === 404) {
    console.warn("already deleted");
    return true; // the goal is met either way
  }

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return true;
}

async function onDeleteClick(event) {
  const button = event.target.closest("[data-delete]");
  if (!button) return;

  button.disabled = true;
  try {
    const removed = await removeHotel(button.dataset.delete);
    if (removed) button.closest("tr")?.remove();
  } catch (error) {
    alert(`Delete failed: ${error.message}`);
    button.disabled = false;
  }
}

document.querySelector("#hotel-table")?.addEventListener("click", onDeleteClick);
```

The button stays disabled on success because its row is gone. On failure it comes back, so the user can retry. Treating 404 as success is a judgement call: the row the user wanted gone is gone, and a red error box would be noise.

### Example 4: a hotel admin page with full CRUD

```js
// One page, one state object, four operations. Read it top to bottom.
// The API is described but not implemented here. Replace the paths with your own.

// 1. State. Every render reads this and nothing else.
const state = {
  status: "idle", // idle | loading | success | error
  hotels: [],
  message: "",
  editingId: null
};

// 2. Element lookup once, at the top.
const table = document.querySelector("#hotels");
const form = document.querySelector("#hotel-form");
const messageBox = document.querySelector("#message");

// 3. One request helper. Every call goes through it, so error handling lives once.
async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    ...options
  });

  if (!response.ok) {
    let detail = "";
    try {
      detail = (await response.json()).message || "";
    } catch {
      detail = "";
    }
    throw new Error(`HTTP ${response.status}${detail ? `: ${detail}` : ""}`);
  }

  return response.status === 204 ? null : response.json();
}

// 4. Render. No fetch, no await, no side effects beyond the DOM.
function render() {
  if (messageBox) {
    messageBox.textContent = state.message;
    messageBox.dataset.kind = state.status;
  }

  if (!table) return;

  if (state.status === "loading" && !state.hotels.length) {
    table.innerHTML = "<tr><td colspan=\"4\">Loading...</td></tr>";
    return;
  }

  if (state.status === "error") {
    table.innerHTML = `<tr><td colspan="4">${state.message}</td></tr>`;
    return;
  }

  table.innerHTML = "";

  for (const hotel of state.hotels) {
    const row = document.createElement("tr");
    row.dataset.id = hotel.hotel_id;

    row.innerHTML = `
      <td>${hotel.name}</td>
      <td>${hotel.city}</td>
      <td>${hotel.stars}</td>
      <td>
        <button data-action="edit">Edit</button>
        <button data-action="delete">Delete</button>
      </td>
    `;

    table.append(row);
  }
}

// 5. Load. The token guards against a slow answer from an earlier refresh.
let loadToken = 0;

async function load() {
  const token = ++loadToken;
  state.status = "loading";
  state.message = "Loading hotels...";
  render();

  try {
    const hotels = await api("/api/hotels");
    if (token !== loadToken) return; // stale
    state.hotels = hotels;
    state.status = "success";
    state.message = `${hotels.length} hotels`;
  } catch (error) {
    if (token !== loadToken) return;
    state.status = "error";
    state.message = `Load failed: ${error.message}`;
  } finally {
    if (token === loadToken) render();
  }
}

// 6. Create or update, decided by the hidden id field.
form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const hotel = {
    name: data.get("name"),
    city: data.get("city"),
    stars: Number(data.get("stars")),
    owner_email: data.get("owner_email")
  };

  const id = data.get("hotel_id");
  const isEdit = Boolean(id);

  state.status = "loading";
  state.message = isEdit ? "Saving changes..." : "Creating hotel...";
  render();

  try {
    if (isEdit) {
      await api(`/api/hotels/${id}`, { method: "PUT", body: JSON.stringify(hotel) });
    } else {
      await api("/api/hotels", { method: "POST", body: JSON.stringify(hotel) });
    }

    form.reset();
    form.elements.hotel_id.value = "";
    state.status = "success";
    state.message = isEdit ? "Changes saved" : "Hotel created";
    await load(); // refresh from the server, do not guess the new row
  } catch (error) {
    state.status = "error";
    state.message = `Not saved: ${error.message}`;
    render();
  }
});

// 7. Row buttons. One listener on the table handles every row, including new ones.
table?.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const row = button.closest("tr");
  const id = row?.dataset.id;
  if (!id) return;

  if (button.dataset.action === "edit") {
    const hotel = state.hotels.find((item) => String(item.hotel_id) === id);
    if (!hotel) return;
    form.elements.hotel_id.value = hotel.hotel_id;
    form.elements.name.value = hotel.name;
    form.elements.city.value = hotel.city;
    form.elements.stars.value = hotel.stars;
    form.elements.owner_email.value = hotel.owner_email;
    return;
  }

  if (button.dataset.action === "delete") {
    if (!confirm("Delete this hotel?")) return;
    button.disabled = true;

    try {
      await api(`/api/hotels/${id}`, { method: "DELETE" });
      state.status = "success";
      state.message = "Hotel deleted";
      await load();
    } catch (error) {
      button.disabled = false;
      state.status = "error";
      state.message = `Delete failed: ${error.message}`;
      render();
    }
  }
});

// 8. Start.
load();
```

The parts that matter for the exam: one `api` helper so `response.ok` is checked in one place, one state object so the screen cannot show two contradictory things, a token because refresh can overlap with a create, and a reload after every write so the table mirrors the server instead of the client's guess.

## Common mistakes

- Assuming `catch` runs for 404 or 500. It does not. Check `response.ok`.
- Forgetting the second `await` before `.json()`.
- Calling `json()` twice on the same response. Clone it first.
- Sending a JSON body with no `Content-Type`, or sending an object without `JSON.stringify`.
- Setting `Content-Type` by hand for `FormData`, which removes the boundary the browser needs.
- Reading `json()` on a 204 response and treating the parse error as a failed delete.
- Building a query string with template literals and raw user input, which breaks on `&`, `#`, and spaces.
- Leaving the timeout armed after a successful fetch. Clear it in `finally`.
- Showing `AbortError` to the user, which turns a normal cancel into a scary red box.
- Letting the last response win instead of the newest request. Use a token, and abort too.
- Assuming `fetch` sends cookies cross origin. It does not by default.
- Rendering from two booleans, `loading` and `error`, which can both be true.

## Exam checklist

- Write a GET request with `await fetch`, an `ok` check, and a parsed body.
- Explain why a 404 does not reject the promise.
- Name the three failure kinds and how each is detected.
- Write a POST with `method`, `Content-Type`, and `JSON.stringify`.
- Explain the difference between PUT and PATCH in one sentence each.
- Handle a DELETE that answers 204 without a parse error.
- Build a query string with `URLSearchParams` and say why it is safer than concatenation.
- Cancel a request with `AbortController`, clear its timer, and recognise `AbortError`.
- Describe a stale response race, then fix it with a token and an abort.
- Name the four UI states and the fields of the state object that holds them.
- Explain why `response.headers` may look incomplete on a cross origin request.
