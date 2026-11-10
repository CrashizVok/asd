# React frontend

A Vite + React 19 app for the bookings exam. It has three routes, hotel cards, an owner popup, a search field with a three-character minimum, and a responsive layout.

## Run it

```bash
cd react
npm install
npm run dev
```

Open `http://localhost:5173`. The backend must run on `http://localhost:3000`.

Vite proxies `/api` to the backend, so the browser sees one origin during development. No CORS change is needed.

To point at another API, create `react/.env`:

```bash
VITE_API_URL=http://localhost:3000/api
```

Restart `npm run dev` after changing `.env`.

## Build

```bash
npm run build
npm run preview
```

The build lands in `dist/`. A static host needs a fallback to `index.html` for the client-side routes. On nginx, use `try_files $uri /index.html;`.

## Routes

| Path | Page | Data |
|---|---|---|
| `/` | `src/pages/Home.jsx` | `GET /api/hotels` |
| `/hotels/:id` | `src/pages/Bookings.jsx` | `GET /api/bookings/by-hotel/:id` |
| `/search/:searchedWord` | `src/pages/SearchResult.jsx` | `GET /api/bookings/by-search/:word` |

`src/App.jsx` holds the router and the fixed menu. `src/components/MyMenu.jsx` holds the Home button and the search form.

## File map

```text
react/
  index.html
  package.json
  vite.config.js
  src/
    main.jsx          React root, BrowserRouter, global CSS
    App.jsx           routes and menu
    api.js            axios instance and API functions
    styles.css        all layout, card, table, modal and mobile rules
    components/
      MyMenu.jsx      fixed navbar, search validation
    pages/
      Home.jsx        hotel cards, stars, owner popup
      Bookings.jsx    bookings table for one hotel
      SearchResult.jsx search results
```

## API fields used

`GET /api/hotels` returns one row per hotel:

```text
id, city, name, description, stars, hotel_image, owner_email,
first_name, last_name, owner_image
```

`GET /api/bookings/by-hotel/:id` returns:

```text
customer_email, hotel_id, start_date, end_date, adults, children,
boylovers, first_name, last_name, customer_image
```

`GET /api/bookings/by-search/:word` adds the hotel name as `name`.

Dates arrive as `YYYY-MM-DD` strings because the backend sets `dateStrings: true`. Do not wrap them in `new Date()` unless you need date arithmetic.

## How to adapt it

1. Rename the entity in `api.js`, the pages, and the route paths.
2. Change the field names in the JSX. Keep the API field names identical to the database columns or aliases.
3. Change the table headers in `Bookings.jsx`.
4. Change the card fields in `Home.jsx`. The owner popup reads `first_name`, `last_name`, `owner_email`, and `owner_image`.
5. Change the links. `Bookings.jsx` uses `:id`; `SearchResult.jsx` links to `/hotels/${result.hotel_id}`.
6. Change the text. UI labels are plain strings, not translation keys.

## Images

The app uses the image URL from the API directly. If the database stores a relative path such as `images/hotel1.jpg`, the browser resolves it against the frontend origin, not the backend. Either:

- store a full URL in the database, or
- copy the images into `react/public/` and store `/images/hotel1.jpg`, or
- change `api.js` to prefix the backend origin.

The background image lives at `react/public/backgroundImage.jpg`. Add your own file with that name. The CSS also has a dark gradient, so the page stays readable when the image is missing.

## Common errors

| Symptom | Cause | Fix |
|---|---|---|
| `Network Error` or 404 on `/api` | Backend is not running | Start `node/server.js` on port 3000 |
| `CORS` error | Frontend calls the backend directly | Use the Vite proxy or enable `cors()` |
| Blank page after a route refresh | Static host has no SPA fallback | Rewrite unknown paths to `index.html` |
| `Cannot read properties of undefined` | API returned an error object, not an array | Check the network tab and the backend log |
| Images are broken | Relative path points at the frontend | Use a full URL or copy files into `public/` |
| `import.meta.env` is undefined | File is not processed by Vite | Keep it inside `src/`, not in a plain Node script |
| Search does nothing on 1 or 2 characters | Expected behavior | Type at least 3 characters |

## Exam checklist

1. Start the backend and confirm `GET /api/hotels` in the browser.
2. Build the home page with a loading state, an error state, and an empty state.
3. Make the card click navigate to `/hotels/:id`.
4. Add the owner button and stop its click from opening the card.
5. Add the search field and the three-character check.
6. Add the bookings table and the search results page.
7. Add the responsive CSS and test at 375px wide.
8. Run `npm run build` before you submit.
