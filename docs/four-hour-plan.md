# Four-hour plan

The B part is 240 minutes. This plan leaves 20 minutes for testing and submission.

## 0 to 10 minutes: read and set up

- Read every task once. Mark the points and the required output labels.
- Create the exam folder with your name, for example `Vezeteknev_Keresztnev`.
- Unzip the source. Create the database and import the SQL dump.
- Open the Java, backend, and frontend projects in the IDE.
- Run one empty project to check the toolchain.

Do not start coding before you know which part gives the most points for the least work.

## 10 to 50 minutes: Java console (15 points)

1. Copy `BookingsCli.java` and the CSV into the project.
2. Run it once with the sample CSV.
3. Replace the CSV path and the field names with the exam data.
4. Solve the tasks in order. Print after each task.
5. Write the output file last.

If a task is unclear, print the intermediate list and check the first three rows by hand.

## 50 to 85 minutes: JavaFX (10 points)

1. Copy `BookingsGui.java`, `app.css`, and `pom.xml`.
2. Run the empty window first.
3. Add the menu, the radio buttons, and the two lists.
4. Add the file chooser and the CSV loader.
5. Wire the selection listeners.
6. Add the About alert and the Exit item.
7. Check that the lists resize with the window.

The GUI is worth 10 points. Do not spend 40 minutes on it. A working plain window scores more than a broken fancy one.

## 85 to 130 minutes: backend (15 points)

1. Import `schema.sql`.
2. Copy the `node` folder.
3. Set `.env` and run `npm install`.
4. Start with `GET /api/hotels` and test it in the browser.
5. Add the other endpoints one by one.
6. Test each endpoint with curl or Postman before moving on.

Use `dateStrings: true`. Use parameterized queries. Return JSON for every path, including errors.

## 130 to 180 minutes: React (15 points)

1. Copy the `react` folder.
2. Run `npm install` and `npm run dev`.
3. Confirm the proxy works with the hotels endpoint.
4. Build `Home.jsx` first. Cards and stars.
5. Add the owner popup.
6. Add the route to `Bookings.jsx`.
7. Add `MyMenu.jsx` and the search route.
8. Add loading, error, and empty states.

Do not install extra UI libraries. Plain CSS is enough.

## 180 to 205 minutes: responsive CSS (10 points)

1. Add the background image to the public folder.
2. Set the full-screen background and the centered panel.
3. Fix the navbar and add top padding to the page.
4. Make the card grid responsive.
5. Test at 375px, 768px, and 1280px.
6. Check that the table or booking list does not overflow.

## 205 to 235 minutes: test and fix

- Run every part from a clean start.
- Test the happy path and one error path per endpoint.
- Check the browser console for errors.
- Check the Java console for exceptions.
- Confirm the output file exists and has the right number of lines.
- Re-read the task sheet and tick each requirement.

## 235 to 240 minutes: submit

- Close the programs.
- Make sure the source folders are saved.
- Submit the required files or links.
- Do not rename folders at the last minute.

## If you run out of time

Priority order by points per minute:

1. Backend endpoints (15 points, mostly copy and adapt).
2. React pages (15 points, three routes).
3. Java console (15 points, one file).
4. CSS (10 points, one stylesheet).
5. JavaFX (10 points, the most fiddly).

A half-finished backend with four working endpoints can still earn most of the backend points. A JavaFX window that does not open earns none.
