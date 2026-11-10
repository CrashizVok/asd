/**
 * snippets.js
 * Ready-to-copy helpers for exam work. Plain JavaScript, no dependencies.
 *
 * Everything that touches the DOM is guarded by `hasDom`, so the file runs
 * cleanly under Node and prints its examples.
 *
 * Copy one function into your project. Do not import the whole file.
 */

"use strict";

/** True in a browser, false in Node. */
const hasDom = typeof document !== "undefined";

/* ------------------------------------------------------------------ */
/* DOM: selection                                                      */
/* ------------------------------------------------------------------ */

/**
 * Select one element. Returns null when nothing matches.
 * Pass a parent to search inside it.
 */
function pick(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Select all matches as a real array, so map and filter work on it.
 */
function pickAll(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

/* ------------------------------------------------------------------ */
/* DOM: create and append                                              */
/* ------------------------------------------------------------------ */

/**
 * Build an element with text, classes and attributes in one call.
 * Text always goes through textContent, so user input cannot inject HTML.
 */
function make(tag, options = {}) {
  const el = document.createElement(tag);
  if (options.text) el.textContent = options.text;
  if (options.className) el.className = options.className;
  if (options.attrs) {
    for (const [key, value] of Object.entries(options.attrs)) {
      el.setAttribute(key, value);
    }
  }
  return el;
}

/**
 * Append a child to a parent. Returns the child so calls can be chained.
 */
function appendTo(parent, child) {
  parent.append(child);
  return child;
}

/**
 * Remove every child of a node without touching the node itself.
 */
function clear(node) {
  node.replaceChildren();
}

/* ------------------------------------------------------------------ */
/* DOM: events                                                         */
/* ------------------------------------------------------------------ */

/**
 * Add a listener and return a function that removes it again.
 * Useful for components that mount and unmount.
 */
function on(target, type, handler, options) {
  target.addEventListener(type, handler, options);
  return () => target.removeEventListener(type, handler, options);
}

/**
 * Listen on a parent for events from matching children.
 * Works for children added later, unlike a direct listener.
 */
function delegate(parent, childSelector, type, handler) {
  parent.addEventListener(type, (event) => {
    const match = event.target.closest(childSelector);
    if (match && parent.contains(match)) handler(event, match);
  });
}

/* ------------------------------------------------------------------ */
/* DOM: show and hide                                                  */
/* ------------------------------------------------------------------ */

/**
 * Toggle an element with the hidden attribute.
 * The attribute is semantic and works without CSS.
 */
function toggle(element, visible) {
  if (typeof visible === "boolean") {
    element.hidden = !visible;
  } else {
    element.hidden = !element.hidden;
  }
  return !element.hidden;
}

/* ------------------------------------------------------------------ */
/* Forms                                                               */
/* ------------------------------------------------------------------ */

/**
 * Check a form with the browser's own rules.
 * Returns { valid, errors }, where errors maps field name to message.
 */
function validateForm(form) {
  const errors = {};
  const fields = Array.from(form.elements);

  for (const field of fields) {
    if (!field.name) continue;
    if (!field.willValidate) continue;

    field.setCustomValidity("");
    if (!field.checkValidity()) {
      errors[field.name] = field.validationMessage || "Invalid value";
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Read a form into a plain object. Checkboxes become booleans,
 * repeated names become arrays.
 */
function readForm(form) {
  const data = {};
  const fd = new FormData(form);

  for (const key of new Set(fd.keys())) {
    const values = fd.getAll(key);
    data[key] = values.length > 1 ? values : values[0];
  }

  for (const el of form.elements) {
    if (el.type === "checkbox" && el.name) data[el.name] = el.checked;
  }

  return data;
}

/* ------------------------------------------------------------------ */
/* Network                                                             */
/* ------------------------------------------------------------------ */

/**
 * GET JSON. Throws on a network error or a non 2xx status,
 * because fetch alone resolves on 404 and 500.
 */
async function getJson(url, options = {}) {
  const res = await fetch(url, {
    headers: { Accept: "application/json", ...options.headers },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`GET ${url} failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * POST JSON and return the parsed response. Sends credentials only
 * when the caller asks for them.
 */
async function postJson(url, body, options = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...options.headers },
    body: JSON.stringify(body),
    ...options,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`POST ${url} failed: ${res.status} ${detail}`.trim());
  }

  const type = res.headers.get("content-type") || "";
  return type.includes("application/json") ? res.json() : res.text();
}

/* ------------------------------------------------------------------ */
/* Timing                                                              */
/* ------------------------------------------------------------------ */

/**
 * Delay a call until input pauses. The last call wins.
 * Use it for search boxes and resize handlers.
 */
function debounce(fn, delay = 300) {
  let timer = null;

  const wrapped = (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, delay);
  };

  wrapped.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  return wrapped;
}

/* ------------------------------------------------------------------ */
/* Dates and strings                                                   */
/* ------------------------------------------------------------------ */

/**
 * Format a Date or ISO string for display.
 * "short" gives 10 Nov 2026, "long" adds the weekday,
 * "iso" gives 2026-11-10 for input[type=date].
 */
function formatDate(value, style = "short") {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  if (style === "iso") {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  const opts =
    style === "long"
      ? { weekday: "long", day: "numeric", month: "long", year: "numeric" }
      : { day: "numeric", month: "short", year: "numeric" };

  return new Intl.DateTimeFormat("en-GB", opts).format(date);
}

/* ------------------------------------------------------------------ */
/* Storage                                                             */
/* ------------------------------------------------------------------ */

/**
 * localStorage with a memory fallback, so the same code runs in Node.
 * Values are JSON encoded, which keeps numbers and objects intact.
 */
const memoryStore = new Map();
const storage = (() => {
  try {
    // window check first: Node exposes localStorage as a warning-only getter.
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("__probe__", "1");
      window.localStorage.removeItem("__probe__");
      return window.localStorage;
    }
  } catch {
    /* private mode blocks writes, fall through */
  }
  return {
    getItem: (k) => (memoryStore.has(k) ? memoryStore.get(k) : null),
    setItem: (k, v) => memoryStore.set(k, v),
    removeItem: (k) => memoryStore.delete(k),
  };
})();

/**
 * Save any JSON serialisable value under a key.
 */
function save(key, value) {
  storage.setItem(key, JSON.stringify(value));
}

/**
 * Load a value. Returns the fallback when the key is missing
 * or the stored text is not valid JSON.
 */
function load(key, fallback = null) {
  const raw = storage.getItem(key);
  if (raw === null) return fallback;

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/* ------------------------------------------------------------------ */
/* Lists                                                               */
/* ------------------------------------------------------------------ */

/**
 * Case-insensitive search across several fields of each item.
 * Empty query returns the list unchanged.
 */
function searchList(items, query, fields) {
  const needle = String(query).trim().toLowerCase();
  if (!needle) return items.slice();

  return items.filter((item) =>
    fields.some((field) => String(item[field] ?? "").toLowerCase().includes(needle))
  );
}

/**
 * Sort a copy by one field. Strings use localeCompare so accents
 * and case behave. Add "desc" as the third argument for reverse order.
 * The input array is never mutated.
 */
function sortBy(items, field, direction = "asc") {
  const factor = direction === "desc" ? -1 : 1;

  return items.slice().sort((a, b) => {
    const left = a[field];
    const right = b[field];

    if (typeof left === "number" && typeof right === "number") {
      return (left - right) * factor;
    }

    return String(left).localeCompare(String(right), "en") * factor;
  });
}

/**
 * Group items by a field into { key: [items] }.
 * A function key is allowed for computed groups.
 */
function groupBy(items, key) {
  const getKey = typeof key === "function" ? key : (item) => item[key];
  const groups = {};

  for (const item of items) {
    const name = String(getKey(item));
    if (!groups[name]) groups[name] = [];
    groups[name].push(item);
  }

  return groups;
}

/**
 * Sum of numbers, or of a field when objects are passed.
 */
function sum(items, field) {
  const pickValue = field ? (item) => Number(item[field]) || 0 : (item) => Number(item) || 0;
  return items.reduce((total, item) => total + pickValue(item), 0);
}

/**
 * Average, or 0 for an empty list.
 */
function average(items, field) {
  if (items.length === 0) return 0;
  return sum(items, field) / items.length;
}

/**
 * Unique values in order of first appearance.
 */
function unique(items) {
  return [...new Set(items)];
}

/* ------------------------------------------------------------------ */
/* Clipboard                                                           */
/* ------------------------------------------------------------------ */

/**
 * Copy text to the clipboard. Resolves true on success.
 * Falls back to a hidden textarea on older browsers and on insecure origins.
 */
async function copyText(text) {
  if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  if (!hasDom) return false;

  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.append(area);
  area.select();
  const ok = document.execCommand("copy");
  area.remove();
  return ok;
}

/* ------------------------------------------------------------------ */
/* Modal                                                               */
/* ------------------------------------------------------------------ */

/**
 * Open a dialog element. Falls back to the hidden attribute
 * when the browser has no showModal.
 * Focus goes back to the trigger on close, which keeps keyboard users sane.
 */
function openModal(dialog) {
  if (!dialog) return;
  const trigger = document.activeElement;

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.hidden = false;
  }

  dialog.addEventListener(
    "close",
    () => {
      if (trigger && typeof trigger.focus === "function") trigger.focus();
    },
    { once: true }
  );
}

/**
 * Close a dialog opened by openModal.
 */
function closeModal(dialog) {
  if (!dialog) return;

  if (typeof dialog.close === "function") {
    dialog.close();
  } else {
    dialog.hidden = true;
  }
}

/* ------------------------------------------------------------------ */
/* Usage examples                                                      */
/* ------------------------------------------------------------------ */

const rooms = [
  { name: "Sea view double", city: "Split", price: 80, free: true },
  { name: "City single", city: "Budapest", price: 55, free: false },
  { name: "Family suite", city: "Split", price: 140, free: true },
];

console.log("search:", searchList(rooms, "split", ["name", "city"]).map((r) => r.name));
console.log("sort:", sortBy(rooms, "price", "desc").map((r) => r.name));
console.log("group:", Object.keys(groupBy(rooms, "city")));
console.log("sum:", sum(rooms, "price"), "average:", average(rooms, "price"));
console.log("unique:", unique(["a", "b", "a", "c"]));
console.log("date:", formatDate("2026-11-10T14:00:00Z", "long"));
console.log("debounce:", typeof debounce(() => {}, 100));
console.log("json:", typeof getJson, typeof postJson);

save("demo", { rooms: rooms.length });
console.log("storage round trip:", load("demo"));

/* DOM examples only run in a browser. Guarded so Node stays quiet. */
if (hasDom) {
  const form = pick("#booking-form");
  if (form) {
    on(form, "submit", (event) => {
      event.preventDefault();
      const result = validateForm(form);
      if (result.valid) {
        console.log(readForm(form));
      } else {
        console.log(result.errors);
      }
    });
  }

  const btn = pick("#copy");
  if (btn) {
    on(btn, "click", () => copyText("copied from the page"));
  }

  const dialog = pick("#modal");
  const openBtn = pick("#open-modal");
  if (dialog && openBtn) {
    on(openBtn, "click", () => openModal(dialog));
    on(dialog, "click", (event) => {
      if (event.target === dialog) closeModal(dialog);
    });
  }
}
