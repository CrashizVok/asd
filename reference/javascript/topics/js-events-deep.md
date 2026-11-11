# Events

JavaScript topic · Exam Wiki

## Simplest form

```js
// Data shape: { event: Event, target: Element }
document.querySelector('#save').addEventListener('click', (event) => {
  console.log(event.type, event.target);
});
```

A listener is a function registered on a node for one event type. When the browser dispatches that event at the node, it calls the function with an event object that describes what happened.

## What an event is

Something happens: a click, a key press, a form submission, an image that finished loading, a timer callback that calls `dispatchEvent`. The browser creates an event object, sets its type and target, builds the path from `window` down to the target, and walks that path calling the listeners registered at each node.

The event object is created fresh for each dispatch. It is not shared between handlers, and the old Internet Explorer practice of storing it on `window` does not apply. Holding the event object also holds its target node, so drop it when the handler returns if that node may be removed.

Listeners can be attached in three ways. Inline attributes such as `onclick="save()"` mix markup with behavior and run code from a string. Assigning `element.onclick = fn` allows exactly one handler and is silently overwritten. `addEventListener` allows many handlers, works with options, and is the only form worth using.

Inside a normal function handler, `this` is the node the listener is attached to, which is `event.currentTarget`. Arrow functions keep the `this` of the surrounding scope, so use the event object rather than `this` when you write arrows.

## addEventListener in full

```js
// Data shape: { options: { capture, once, passive, signal } }
button.addEventListener('click', onClick);
button.addEventListener('click', onClick, { once: true });
window.addEventListener('scroll', onScroll, { passive: true });

// The third argument can also be the capture flag alone.
form.addEventListener('submit', onSubmit, true);

// Removing needs the same function and the same capture flag.
button.removeEventListener('click', onClick);
```

The options object has four fields:

- `capture`: listen during the capture phase, before the event reaches its target.
- `once`: remove the listener after its first call.
- `passive`: promise not to call `preventDefault`. The browser can then scroll without waiting. A `preventDefault` call inside a passive listener is ignored and may log a warning.
- `signal`: an `AbortSignal`. Aborting it removes the listener, which is the clean way to clean up a group of handlers.

Registering the same function for the same type on the same node with the same capture flag twice does nothing. The second call is ignored, not queued. If the flags differ in `once` or `passive`, the duplicate check still compares only type, function, and capture, so the new options are ignored too.

Removal compares the function reference and the capture flag. Passing a new arrow function that looks the same removes nothing. Passing `true` when the listener was added with `{ capture: true }` works; passing `true` when it was added without capture does not.

```js
// Data shape: { controller: AbortController }
const controller = new AbortController();
const { signal } = controller;

window.addEventListener('resize', onResize, { signal });
document.addEventListener('keydown', onKey, { signal });

// One call removes both listeners.
controller.abort();
```

Listeners on the same node and type run in registration order. A listener added during dispatch to the node currently being processed does not run for that event. One added to a node later in the path can still run, which is a subtle source of surprise; register listeners outside dispatch when order matters.

## The event object

```js
// Data shape: { target: Element, currentTarget: Element, type: string }
list.addEventListener('click', (event) => {
  event.type;          // "click"
  event.target;        // the element that was clicked, innermost
  event.currentTarget; // the element with this listener, here list
  event.timeStamp;     // milliseconds since the page started loading
  event.isTrusted;     // false when dispatched by script
  event.defaultPrevented; // true after preventDefault
  event.cancelable;    // whether preventDefault has an effect
});
```

`target` stays the same for the whole dispatch. `currentTarget` changes as the event moves from node to node, which is why a delegated listener uses `target` to find what the user touched. After dispatch finishes, `currentTarget` is set to `null`, so do not read it later in a timeout.

Cancelable events carry a default action. A click on a link navigates, a submit event sends the form, a keydown leads to text insertion. `preventDefault()` cancels that action and sets `defaultPrevented`. It must run during dispatch; calling it afterwards changes nothing. A non-cancelable event ignores the call.

The event interface adds fields by type. Mouse events have `clientX`, `clientY`, `button`, and `altKey`. Keyboard events have `key`, `code`, `repeat`, and the four modifier booleans. Input events have `data` and `inputType`. A submit event has `submitter`, and its target is the form.

## Bubbling, capturing, and the path

An event travels in three phases. Capture goes from `window` down through ancestors to the target. The target phase runs listeners on the target itself. Bubble goes back up through the ancestors to `window`.

Most listeners are registered without `capture`, so they run in the bubble phase, after the target. That is why a click on a button inside a card also triggers a click listener on the card. The event is not sent twice; it passes through the card on its way up.

```js
// Capture runs before the target listener, bubble after it.
document.addEventListener('click', () => console.log('capture'), true);
button.addEventListener('click', () => console.log('target'));
document.addEventListener('click', () => console.log('bubble'));
```

Some events do not bubble: `focus`, `blur`, `mouseenter`, `mouseleave`, `load`, `error` on resources, and `scroll` on an element (the document scroll event still reaches `window`). For focus delegation use `focusin` and `focusout`, which do bubble. For a capturing listener, `true` as the third argument catches `focus` and `blur` on the way down.

`stopPropagation()` stops the event from reaching the next node in the path. Listeners already running on the current node still finish, and other events are unaffected. `stopImmediatePropagation()` also cancels the remaining listeners on the current node. Neither one cancels the browser default action; a link still navigates after `stopPropagation`.

Reach for `preventDefault` when the browser behavior is wrong for your page, such as a form posting to the server. Reach for `stopPropagation` only when a parent handler must not see a child interaction, such as a delete button inside a clickable row. A handler that always stops propagation makes the page harder to extend, because later features cannot observe the event.

## Delegation

Delegation puts one listener on a stable ancestor and works out which child was involved. It survives re-rendering, costs one registration instead of hundreds, and keeps the handler next to the data that owns the list.

```js
// Data shape: { id: string } stored in each row's data-id
const list = document.querySelector('#results');

list.addEventListener('click', (event) => {
  const row = event.target.closest('[data-id]');
  if (!row) return; // click on the container or its padding

  console.log(row.dataset.id);
});
```

`closest` walks from the real target up to the nearest element matching the selector, so a click on a `<strong>` inside the row still finds the row. The guard matters: `event.target` can be the container itself or a padding area, and those clicks should not count as a row.

Delegation has limits. Events that do not bubble cannot be delegated without `capture: true`. `focus` and `blur` fall in that group, so listen for `focusin` and `focusout` instead. Delegation also only works while the parent is in the document, because no event reaches a detached tree.

For a list of three items, direct listeners are clearer. Delegation pays off when items are created and destroyed at runtime, or when the markup is rendered from data.

## Forms and keyboard

```js
// Data shape: { fields: FormData, key: string }
form.addEventListener('submit', (event) => {
  event.preventDefault(); // stop navigation
  const data = new FormData(form, event.submitter);
  console.log(data.get('customer_email'));
});

input.addEventListener('input', (event) => {
  console.log(event.target.value); // every keystroke, paste, and drop
});

select.addEventListener('change', (event) => {
  console.log(event.target.value); // after the user commits a choice
});
```

The `submit` event fires on the form, not on the button. Pressing Enter in a single-line text field submits the form when the form has a submit button, and a button without a `type` inside a form defaults to `type="submit"`. A listener on the button's click misses both cases, so listen on the form. If the form is invalid, the browser blocks `submit` entirely, which means a handler with its own validation only runs when the form has `novalidate` or the constraints pass.

`input` fires on every change to the value, including paste and drag, and it bubbles. `change` fires when the user commits: for a text field that is usually blur, for a checkbox, radio, select, or date field it is immediately. Use `input` for live feedback and `change` for a choice that should trigger an action once.

Keyboard events come in three types. `keydown` fires when the key goes down, repeats while held (`event.repeat` is true), and is the one to use for shortcuts. `keyup` fires on release. `keypress` is deprecated and does not fire for every key. `event.key` gives the character or the name, such as `"Enter"`, `"Escape"`, `"a"`, `"A"`, `" "`, `"ArrowLeft"`. `event.code` gives the physical key, such as `"KeyA"`, `"Space"`, `"Digit1"`, and is the right choice for game controls and layouts.

Modifier state is on `event.altKey`, `event.ctrlKey`, `event.metaKey`, and `event.shiftKey`. Checking `event.key.toLowerCase() === 's' && event.ctrlKey` catches Ctrl+S, but on macOS the same shortcut uses `metaKey`, so handle both when the page should feel native on both platforms.

Do not `preventDefault` on every keydown. It blocks typing, paste, and the browser's own shortcuts. Cancel only the keys you handle, and only when the event target is not a field where the character is wanted.

## Examples

### Example 1: keyboard shortcuts that ignore text fields

```js
// Data shape: { key: string, ctrlKey: boolean, metaKey: boolean }
const search = document.querySelector('#search');

document.addEventListener('keydown', (event) => {
  // A shortcut must not steal keys from someone typing in a field.
  const field = event.target.closest('input, textarea, select, [contenteditable="true"]');

  if (event.key === '/' && !field) {
    event.preventDefault(); // stop Firefox quick find
    search.focus();
    return;
  }

  if (event.key === 'Escape') {
    search.blur();
    closePanels(); // app function, not shown
    return;
  }

  const save = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's';
  if (save) {
    event.preventDefault(); // stop the browser save dialog
    saveDraft();
  }
});
```

The field check runs first, so typing a slash in the search box inserts a slash rather than moving focus. The save shortcut accepts both modifiers, which covers Windows, Linux, and macOS.

### Example 2: one listener for row actions and row clicks

```js
// Data shape: { id: string, action: "delete" | "open" }
const table = document.querySelector('#booking-table tbody');

table.addEventListener('click', (event) => {
  const action = event.target.closest('[data-action]');

  if (action) {
    if (action.dataset.action === 'delete') {
      deleteBooking(action.closest('tr').dataset.id);
      return; // handled, do not also open the row
    }
  }

  const row = event.target.closest('tr[data-id]');
  if (!row) return; // click on the empty area of the body
  openBooking(row.dataset.id);
});
```

The early return after delete prevents the row click from firing in the same handler. If the delete button had its own separate listener, `stopPropagation` would be the tool to keep the row handler out. Ordering the checks is cheaper and easier to read.

### Example 3: live search with debounce and composition guard

```js
// Data shape: { query: string, composing: boolean }
const search = document.querySelector('#search');
const status = document.querySelector('#search-status');
let timer;

search.addEventListener('input', (event) => {
  // An IME composition (Japanese, Chinese, Korean) fires input mid-word.
  if (event.isComposing) return;

  clearTimeout(timer); // every keystroke resets the wait

  timer = setTimeout(() => {
    const query = search.value.trim();
    status.textContent = query ? 'Searching for ' + query : '';
    applyFilter(query); // app function, reads a local list
  }, 150);
});

// A select does not need a debounce. It commits one value.
document.querySelector('#city').addEventListener('change', (event) => {
  applyFilter(event.target.value);
});
```

The debounce keeps an expensive filter from running on every keystroke. The composition guard stops a half-typed word from being searched. Using `input` on the select would also work in modern browsers, but `change` states the intent: act when the choice is final.

### Example 4: a todo app with delegated events, editing, and filters

The HTML fixes the structure, and the script owns all state and rendering. Every listener is registered once, at startup, on an element that never gets replaced.

```html
<form id="todo-form">
  <input id="todo-input" name="text" autocomplete="off" placeholder="What needs doing?">
  <button type="submit">Add</button>
</form>

<div id="todo-filters">
  <button type="button" data-filter="all" class="is-active">All</button>
  <button type="button" data-filter="open">Open</button>
  <button type="button" data-filter="done">Done</button>
</div>

<p id="todo-count"></p>
<ul id="todo-list"></ul>
```

```js
// Data shape:
// { todos: [{ id: number, text: string, done: boolean }],
//   filter: "all" | "open" | "done",
//   nextId: number }
const STORAGE_KEY = 'todos-v1';

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || !Array.isArray(saved.todos)) throw new Error('no saved state');

    // Older data may lack nextId. Derive it so ids stay unique.
    const maxId = saved.todos.reduce((max, todo) => Math.max(max, Number(todo.id) || 0), 0);

    return {
      todos: saved.todos,
      filter: 'all', // filter is a view setting, not saved
      nextId: Number(saved.nextId) || maxId + 1,
    };
  } catch {
    return { todos: [], filter: 'all', nextId: 1 };
  }
}

const state = load();
const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');
const count = document.querySelector('#todo-count');
const filters = document.querySelector('#todo-filters');

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function visible() {
  if (state.filter === 'open') return state.todos.filter((todo) => !todo.done);
  if (state.filter === 'done') return state.todos.filter((todo) => todo.done);
  return state.todos;
}

function render() {
  const fragment = document.createDocumentFragment();

  for (const todo of visible()) {
    const item = document.createElement('li');
    item.dataset.id = String(todo.id);
    item.classList.toggle('is-done', todo.done); // CSS draws the strike-through

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done; // property, not attribute
    checkbox.dataset.action = 'toggle';
    checkbox.setAttribute('aria-label', 'Toggle ' + todo.text);

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text; // user text stays text

    const remove = document.createElement('button');
    remove.type = 'button'; // inside a form this must not submit
    remove.dataset.action = 'delete';
    remove.textContent = 'x';
    remove.setAttribute('aria-label', 'Delete ' + todo.text); // "x" alone says nothing

    item.append(checkbox, text, remove);
    fragment.append(item);
  }

  list.replaceChildren(fragment); // one write per render

  const open = state.todos.filter((todo) => !todo.done).length;
  count.textContent = open + ' open, ' + (state.todos.length - open) + ' done';

  for (const button of filters.querySelectorAll('[data-filter]')) {
    button.classList.toggle('is-active', button.dataset.filter === state.filter);
  }
}

// Adding. A submit listener catches the button and the Enter key.
form.addEventListener('submit', (event) => {
  event.preventDefault(); // the page must not reload

  const text = input.value.trim();
  if (!text) {
    input.focus(); // empty input, nothing to add
    return;
  }

  state.todos.push({ id: state.nextId, text, done: false });
  state.nextId += 1;
  save();
  render();
  form.reset(); // clear the field after a successful add
  input.focus();
});

// Toggling. Change events bubble, so one listener on the list is enough.
list.addEventListener('change', (event) => {
  const checkbox = event.target.closest('[data-action="toggle"]');
  if (!checkbox) return;

  const item = checkbox.closest('li');
  if (!item) return; // the row was re-rendered while the click finished

  const id = Number(item.dataset.id);
  const todo = state.todos.find((entry) => entry.id === id);
  if (!todo) return;

  todo.done = checkbox.checked; // read the live state, not the attribute
  save();
  render(); // a filter may hide the row that was just checked
});

// Deleting. Delegation keeps working after every render.
list.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action="delete"]');
  if (!button) return;

  const item = button.closest('li');
  if (!item) return;

  const id = Number(item.dataset.id);
  state.todos = state.todos.filter((todo) => todo.id !== id);
  save();
  render();
});

// Editing. A double click swaps the span for an input. The input is
// created here, so its events are delegated like every other row event.
list.addEventListener('dblclick', (event) => {
  const text = event.target.closest('.todo-text');
  if (!text) return;

  const editor = document.createElement('input');
  editor.type = 'text';
  editor.className = 'todo-edit';
  editor.value = text.textContent; // start from the current text
  text.replaceWith(editor); // no listener is lost, the span had none
  editor.focus();
  editor.select();
});

function commitEdit(editor, saveIt) {
  const item = editor.closest('li');
  if (!item) return; // the editor was already replaced by a render

  const id = Number(item.dataset.id);
  const todo = state.todos.find((entry) => entry.id === id);
  if (!todo) return;

  const next = editor.value.trim();

  if (saveIt && next) {
    todo.text = next;
    save();
  }

  render(); // cancelling and saving both redraw from state
}

// Enter commits, Escape cancels. Both keys are cancelled so the key
// does not reach another handler while the editor is open.
list.addEventListener('keydown', (event) => {
  if (!event.target.classList.contains('todo-edit')) return;

  if (event.key === 'Enter') {
    event.preventDefault();
    commitEdit(event.target, true);
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    commitEdit(event.target, false);
  }
});

// focusout fires when the editor loses focus, including a click elsewhere.
// It bubbles, unlike blur, which is why it is the right event here.
list.addEventListener('focusout', (event) => {
  if (!event.target.classList.contains('todo-edit')) return;
  commitEdit(event.target, true);
});

// Filters. One listener covers all three buttons, now and later.
filters.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-filter]');
  if (!button) return;

  state.filter = button.dataset.filter;
  render();
});

render(); // first paint from stored data
```

Three decisions carry the app. All listeners live on `form`, `list`, and `filters`, so rendering new rows never adds or loses handlers. Every handler edits `state` and calls `render`, so the DOM never becomes the source of truth. The edit flow replaces a span with an input and commits from `keydown` and `focusout`, which covers both the keyboard and a click on another row.

## Common mistakes

- Registering listeners inside `render`. Every pass adds another handler, and one click runs the action several times.
- Building a row with `innerHTML +=`. The new markup loses listeners that were attached to old nodes.
- Listening for `click` on a submit button instead of `submit` on the form. Enter in a field bypasses the button handler.
- Forgetting `event.preventDefault()` in a submit handler. The browser navigates and the page state is gone.
- Calling `stopPropagation` when the real problem was the browser default. The link still navigates.
- Reading `event.target` in a delegated handler and assuming it is the row. It is the innermost element that was clicked; use `closest`.
- Removing a listener with a different function, or without the matching capture flag. Nothing is removed.
- Using `blur` or `focus` for delegation. They do not bubble; use `focusout` and `focusin`.
- Calling `preventDefault` in a passive listener. The call is ignored, and scrolling cannot be stopped.
- Using `keyCode` or `which`. They are deprecated and give layout-dependent numbers; use `key` or `code`.
- Cancelling every keydown to stop a shortcut. Typing, paste, and browser shortcuts stop working too.
- Handling `change` on a text input for live feedback. It fires on blur, not on each keystroke; use `input`.
- Trusting `event.isTrusted` for security. It only says whether script dispatched the event, and script already runs on the page.
- Assuming a node's listeners die with the node. A listener on `window` or `document` that closes over removed nodes keeps them in memory until it is removed or aborted.

## Exam checklist

- Can you write `addEventListener` with `once`, `capture`, `passive`, and an abort signal, and say what each does?
- Can you explain why `removeEventListener` needs the same function reference and capture flag?
- Can you name the three phases and say which one a normal listener runs in?
- Can you explain the difference between `target` and `currentTarget` in a delegated handler?
- Can you list three events that do not bubble and the bubbling alternative for focus?
- Can you explain what `preventDefault` cancels and what `stopPropagation` does not cancel?
- Can you delegate clicks to a list, including a button inside each row, and guard the case where the click misses every row?
- Can you handle `submit` on the form, stop the reload, and read the fields with `FormData`?
- Can you say when `input` fires versus `change`, for a text field and for a checkbox?
- Can you read a character with `event.key`, a physical key with `event.code`, and test a modifier?
- Can you wire a list that survives re-rendering with one listener, and explain why that is safer than one listener per row?
- Can you clean up several listeners at once with an `AbortController`?

