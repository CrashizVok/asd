# Exam map

The B part of the sample exam is 240 minutes and 65 points. The A part is the team project and is not covered here.

| Part | Points | Time budget | Template |
|---|---:|---:|---|
| a. Java console | 15 | 40 min | `java/BookingsCli.java` |
| b. JavaFX GUI | 10 | 35 min | `javafx/BookingsGui.java` |
| c. Backend | 15 | 45 min | `node/` |
| d. React frontend | 15 | 50 min | `react/` |
| e. Responsive CSS | 10 | 25 min | `css/components.css` |

## a. Java console (15 points)

The sample task uses a CSV with hotel bookings. The expected skills:

- Read a CSV file with a header.
- Store rows in a class or record.
- Count rows.
- Find a maximum by a computed value.
- Filter by year and sort by length.
- Collect distinct values and pick one at random.
- Count words in a text field.
- Group by year and join the output with commas.
- Write a filtered list to a text file.

Traps:

- The first line may be a header. Detect it, do not assume it.
- Dates are `yyyy-MM-dd`. Use `LocalDate`.
- Empty fields are common. Parse with a fallback.
- The output must match the sample labels. Copy the labels from the task sheet.
- The last item in a comma-separated line must not have a trailing comma.

## b. JavaFX GUI (10 points)

The sample task asks for:

- A menu bar with File/Open (Ctrl+O), File/Exit, Help/About.
- Two `ListView` controls. Left is about 200 px wide, right about 400 px, both grow vertically.
- Radio buttons for Years and Hotels. Years is selected at start.
- A file chooser that loads a CSV.
- In Years mode, the left list shows the years in ascending order. Selecting a year shows the hotels booked in that year on the right.
- In Hotels mode, the left list shows hotel names in alphabetical order. Selecting a hotel shows its bookings on the right.
- An About alert.
- Exit closes the program.

Traps:

- `ListView` inside an `HBox` grows vertically by default, but the width needs `setPrefWidth`, `setMinWidth`, and `setMaxWidth`.
- Bind the right list width to the window or use `HBox.setHgrow`.
- Clear the right list when the mode changes.
- Load the CSS file with a fallback path. A missing stylesheet should not crash the app.

## c. Backend (15 points)

The sample API has seven endpoints:

| Method | URL | What it does |
|---|---|---|
| GET | `/api/hotels` | All hotels with the owner's full name, sorted by hotel name |
| GET | `/api/bookings/by-hotel/:hotel_id` | All bookings for one hotel |
| GET | `/api/bookings/by-search/:search_word` | Bookings where the guest name, hotel name, or description matches |
| PUT | `/api/booking` | Update one booking by its identifiers |
| POST | `/api/customer` | Insert a new customer |
| POST | `/api/booking` | Insert a new booking |
| GET | `/api/bookings/from/:from_date/to/:to_date` | Sum adults, children, and extra guests for bookings that overlap the range |

Traps:

- The `bookings` table has no `id` column. Its primary key is `(customer_email, hotel_id)`. Use those two fields in the `WHERE` clause, or add an `id` column if the task allows it.
- A `PUT` body may contain only some fields. Build the `SET` clause dynamically. If no field is present, return 400 and do not update.
- Use parameterized queries. Never concatenate user input into SQL.
- Set `dateStrings: true` in the MySQL pool so `DATE` values do not shift by timezone.
- Return 404 when an update finds no row, 409 for duplicate keys, 400 for bad input.

## d. React frontend (15 points)

The sample app has three routes:

| Route | Page | Data |
|---|---|---|
| `/` | `Home.jsx` | All hotels |
| `/hotels/:id` | `Bookings.jsx` | Bookings for one hotel |
| `/search/:searchedWord` | `SearchResult.jsx` | Search results |

Required behaviour:

- A fixed top menu with a Home icon and a search field.
- Hotel cards with name, description, stars, image, and owner.
- Clicking a card opens the bookings page.
- Clicking the owner opens a centered popup with the owner's data.
- Search starts only when the word has at least three characters.
- A no-results message.
- Responsive layout on mobile.

Traps:

- The `onClick` on the owner must call `event.stopPropagation()`, otherwise the card navigation also fires.
- The search route must encode the word with `encodeURIComponent`.
- Use `useEffect` with the route parameter in the dependency array.
- Show loading and error states. An empty list is not an error.
- Use `key={item.id}` or another stable key, not the array index.

## e. Responsive CSS (10 points)

The sample requirements:

- Full-screen background image, scaled proportionally, content above it.
- Centered translucent panel, maximum width 1100px, 12px radius.
- Fixed top navigation with a Home icon on the left and a search field on the right.
- Booking and search pages responsive at any viewport.
- Home page responsive on a phone.

Traps:

- Use `background-size: cover` and `background-position: center`.
- Use `min-height: 100vh`, not a fixed height.
- Add top padding to the content so the fixed navbar does not cover it.
- Use `grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))` for the cards.
- Test at 375px width.
