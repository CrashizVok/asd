# Mock exam tasks

Use the same data shape as the sample exam. The field names are awkward because the exam data is awkward.

## Data

CSV header:

```text
customer_email,first_name,last_name,phone,birthday,customer_image,hotel_id,hotel_city,hotel_name,hotel_description,hotel_stars,hotel_owner_email,hotel_image,start_date,end_date,adults,children,boylovers
```

Database:

```text
customers(email, first_name, last_name, phone, birthday, image)
hotels(id, city, name, description, stars, owner_email, image)
bookings(customer_email, hotel_id, start_date, end_date, adults, children, boylovers)
```

`bookings` has no `id` column. Its primary key is `(customer_email, hotel_id)`.

## Part 1: Java console (15 points, 45 minutes)

Write a console program that reads the CSV path from the first command line argument.

1. Print the number of booking rows. Skip the header if it exists. (2 points)
2. Find the booking with the most nights. Print the guest email, hotel name, and night count. (3 points)
3. Print every booking that starts in 2024, sorted by nights descending. (2 points)
4. Pick a random guest with at least one booking and print all of that guest's bookings. (2 points)
5. Count the words in the first hotel description. Treat repeated spaces as one separator. (2 points)
6. Print the number of bookings per year, sorted by year, with no trailing comma. (2 points)
7. Write every booking shorter than 3 nights to `short.txt`, with the guest email, hotel id, and nights. (2 points)

Run it on `java/bookings-sample.csv` and on a file with an empty optional field.

## Part 2: JavaFX (10 points, 35 minutes)

1. Menu bar: File/Open with Ctrl+O, File/Exit, Help/About. (2 points)
2. Years and Hotels radio buttons, Years selected at start. (1 point)
3. Left list starts at 200x350 and grows vertically. (2 points)
4. Right list starts at 400x350 and grows in both directions. (2 points)
5. File chooser loads the CSV. (1 point)
6. Years mode lists years ascending; selecting a year shows its hotels. (1 point)
7. Hotels mode lists hotel names alphabetically; selecting a hotel shows its bookings. (1 point)

The lists must not touch. Clear the right list when the mode changes. About shows an information alert. Exit closes the window.

## Part 3: SQL and Node backend (15 points, 55 minutes)

Create the three tables with primary and foreign keys. Then build an Express API:

1. `GET /api/hotels`: all hotels with the owner name and image. (2 points)
2. `GET /api/bookings/by-hotel/:hotel_id`: bookings of one hotel with guest name and image. (2 points)
3. `GET /api/bookings/by-search/:search_word`: search guest names, hotel names, and descriptions. (2 points)
4. `PUT /api/booking`: partial update by `customer_email` and `hotel_id`. Return 400 when no updateable field is present. (3 points)
5. `POST /api/customer`: create a customer. Require email, first name, and last name. (2 points)
6. `POST /api/booking`: create a booking. Reject duplicates and missing references. (2 points)
7. `GET /api/bookings/from/:from_date/to/:to_date`: sum adults, children, and extra guests for overlapping bookings. (2 points)

Use parameterized queries. Return JSON for every response, including errors.

## Part 4: React frontend (15 points, 55 minutes)

1. `/`: hotel cards with name, city, description, five stars, image, and owner. (4 points)
2. Owner click opens a centered popup. Card click opens `/hotels/:id`. The owner click must not open the card. (3 points)
3. `/hotels/:id`: a bookings table for that hotel. (3 points)
4. `/search/:searchedWord`: results with hotel name, guest name, dates, and counts. (2 points)
5. Fixed menu with a Home icon and a search field. Search starts at 3 characters. (2 points)
6. Loading, error, and empty states. (1 point)

Encode the search word in the URL. The detail page must refetch when the route id changes.

## Part 5: Responsive CSS (10 points, 30 minutes)

1. Full-screen background image with a dark overlay. (2 points)
2. Centered translucent panel, maximum width 1100px, 12px radius. (3 points)
3. Fixed top navigation; content must not hide under it. (2 points)
4. Card grid with `repeat(auto-fill, minmax(260px, 1fr))`. (2 points)
5. At 375px wide: one column, readable text, no horizontal scroll. (1 point)

Test with the browser device toolbar.

## Optional warmup

No points. Do these before the timer starts if you need to warm up:

- Binary search that returns `-1` when the target is missing.
- A stack with `push`, `pop`, and `peek`.
- Character count with a map.
- Longest common prefix of an array of strings.

## Acceptance checks

### Java

- [ ] `javac` finishes without errors.
- [ ] The header is not counted as a booking.
- [ ] An empty numeric field becomes 0.
- [ ] `short.txt` has one line per short booking.
- [ ] The year output has no trailing comma.

### JavaFX

- [ ] The window opens with Years selected.
- [ ] Open loads a CSV and fills the left list.
- [ ] The left list grows only vertically.
- [ ] The right list grows both ways.
- [ ] Switching modes clears the old right list.
- [ ] About and Exit work.

### Backend

- [ ] `GET /api/hotels` returns an array.
- [ ] A missing hotel id returns 400.
- [ ] `PUT /api/booking` with no fields returns 400.
- [ ] `PUT /api/booking` with one field changes only that field.
- [ ] A duplicate booking returns 409 or 400 with JSON.
- [ ] The date range includes a booking that starts before the range and ends inside it.
- [ ] A search word with a quote does not break the query.

### React

- [ ] The home page shows cards from the API.
- [ ] The owner popup opens and closes.
- [ ] The card click goes to the bookings route.
- [ ] A one-character search does nothing.
- [ ] A three-character search goes to the result route.
- [ ] A refresh on `/hotels/1` still loads on the dev server.
- [ ] Loading, error, and empty states are visible when forced.

### CSS

- [ ] The background covers the viewport.
- [ ] The panel is centered and no wider than 1100px.
- [ ] The navbar stays on top while scrolling.
- [ ] The grid is one column at 375px.
- [ ] No horizontal scrollbar at 375px.
