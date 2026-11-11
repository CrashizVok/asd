# Exam Prep Kit

A local study repository for the 4-hour software developer exam. It follows the five parts of the sample task in `/home/rronyecz/Documents/vizsga`:

1. Java console application (15 points)
2. JavaFX desktop application (10 points)
3. Node.js + Express + MySQL backend (15 points)
4. React frontend (15 points)
5. Responsive HTML/CSS page (10 points)

The templates are written to be copied, renamed, and adapted under time pressure. Every file has comments that mark the parts you normally change: file names, column names, field names, routes, and labels.

## What is inside

| I need to... | Open |
|---|---|
| See the exam parts and points | `docs/exam-map.md` |
| Follow a minute-by-minute plan | `docs/four-hour-plan.md` |
| Find a copy-paste function fast | `docs/copy-paste-index.md` |
| Build the Java console app | `java/BookingsCli.java` |
| Build the JavaFX app | `javafx/BookingsGui.java` |
| Build the REST API | `node/server.js` |
| Build the React app | `react/src/App.jsx` |
| Create the database | `sql/schema.sql` |
| Practice SQL queries | `sql/queries.sql` |
| Study CSS layout | `css/cheatsheet.md` |
| Study algorithms | `algorithms/README.md` |
| Search all notes offline | `offline/index.html` |
| Practice exam-style tasks | `practice/tasks.md` |

## Quick start

### Java console

```bash
cd java
javac BookingsCli.java
java BookingsCli bookings-sample.csv
```

The program writes `rovidek.txt` in the current directory.

### JavaFX

Open the `javafx` folder in IntelliJ as a Maven project, or run:

```bash
cd javafx
mvn javafx:run
```

If Maven is not available, add the JavaFX SDK to the project libraries in IntelliJ and run `BookingsGui`.

### Backend

```bash
cd node
cp .env.example .env
npm install
npm start
```

Import `sql/schema.sql` into MySQL first. The API listens on `http://localhost:3000`.

### Frontend

```bash
cd react
npm install
npm run dev
```

Vite proxies `/api` to `http://localhost:3000`, so the frontend works without CORS changes during development.

### Database

```bash
mysql -u root -p < sql/schema.sql
```

The schema creates the `bookings` database, three tables, foreign keys, and a small neutral sample data set.

### Offline wiki

Open `offline/index.html` in a browser. It is a dark, searchable reference covering seven languages: HTML, CSS, JavaScript, React, Node.js, Java, and JavaFX. Search matches topic titles, command names, syntax, explanations, and examples.

The site has 167 topic pages and 1240 command pages. Every tag, property, method, hook, and API has its own page with syntax and an example. It has no external links, so it works on a machine with no internet.

The generated `offline/data.js`, `offline/ref-*.js`, and `offline/generated-content.js` files are committed, so there is no `npm install` and no build step. The exam machine only needs the repo after `git pull`.

New material lives as Markdown and JSON under `content/`. Rebuild the browser bundle with `node tools/build-content.mjs`, then the Markdown mirror with `node tools/export-reference.mjs`. Both use Node built-ins only.

The Markdown export is in `reference/`, one file per topic and one file per command.

The text is original exam material, not a W3Schools mirror.

## The sample exam in one screen

- **Java console:** read `bookings.csv`, print the count, find the longest booking, list 2024 bookings sorted by length, pick a random guest and print their bookings, count words in hotel descriptions, group bookings by year, write short bookings to `rovidek.txt`.
- **JavaFX:** menu bar with Open and Exit, Help/About, two lists, Years and Hotels radio buttons, file chooser, about dialog.
- **Backend:** seven endpoints for hotels, bookings by hotel, search, booking update, new customer, new booking, and date-range totals.
- **React:** three routes (`/`, `/hotels/:id`, `/search/:searchedWord`), hotel cards, owner popup, search with a three-character minimum, responsive layout.
- **CSS:** full-screen background image, centered translucent panel with a 1100px maximum width and 12px radius, fixed top navigation, mobile layout.

## How to use this in the exam

1. Spend the first 10 minutes reading every task and creating the folder and database.
2. Copy the closest template. Do not write from an empty file.
3. Rename the entity and the fields first. Then fix the file paths and column names.
4. Run the smallest part after each change. A console print or one API call is enough.
5. Leave the CSS polish for the end. A working page with plain styling scores more than a beautiful page that does not load data.

The templates use neutral sample data. Replace it with the exam CSV or the exam SQL dump. The field names in the code match the sample exam schema, including the unusual `boylovers` column, so the API and the CSV parser work without a rename.

## About W3Schools

This repository does not contain copied W3Schools pages. The reference sheets and the offline command index are original notes that cover the same beginner ground: HTML, CSS, JavaScript, React, Node, and SQL. The offline site does not link out and is meant to be complete on its own. If you are online and want more detail, the official documentation is here:

- https://www.w3schools.com/
- https://developer.mozilla.org/
- https://react.dev/
- https://expressjs.com/
- https://dev.mysql.com/doc/

## GitHub

The folder is a local git repository. The `origin` remote points at `https://github.com/CrashizVok/asd.git`.

If a push asks for a login, authenticate once:

```bash
cd /home/rronyecz/Documents/GitHub/asd
gh auth login
git push -u origin main
```

After that, `git pull` on the exam machine gets the latest version. The offline wiki is static, so it does not need `npm install` after the pull.

## Structure

```text
asd/
  docs/          exam map, time plan, copy-paste index
  java/          console template, cheat sheet, sample CSV
  javafx/        GUI template, CSS, Maven file, cheat sheet
  node/          Express API, routes, database pool, cheat sheet
  react/         Vite app, pages, components, styles, cheat sheet
  sql/           schema, queries, cheat sheet
  css/           CSS cheat sheet and ready components
  html/          HTML cheat sheet
  javascript/    JavaScript cheat sheet and snippets
  algorithms/    JavaScript and Java algorithm demos
  practice/      exam-style tasks with hints
  content/       Markdown topics and JSON commands: the source for new pages
  offline/       dark static wiki: 167 topic pages and 1240 command pages
  reference/     Markdown export, one file per page
  tools/         dependency-free build and export scripts
  git/           git cheat sheet
```
