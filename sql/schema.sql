-- Exam schema for the bookings task.
-- Run: mysql -u root -p < sql/schema.sql
--
-- Warning: this drops the three tables in the bookings database.
-- Change the database name if you already have data with the same name.

CREATE DATABASE IF NOT EXISTS bookings
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE bookings;

DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS hotels;
DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
    email VARCHAR(120) PRIMARY KEY,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    phone VARCHAR(40) NULL,
    birthday DATE NULL,
    image VARCHAR(500) NULL
) ENGINE = InnoDB;

CREATE TABLE hotels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    city VARCHAR(80) NOT NULL,
    name VARCHAR(120) NOT NULL,
    description TEXT NULL,
    stars TINYINT NOT NULL DEFAULT 0,
    owner_email VARCHAR(120) NOT NULL,
    image VARCHAR(500) NULL,
    CONSTRAINT fk_hotels_owner
        FOREIGN KEY (owner_email) REFERENCES customers (email)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT chk_hotels_stars CHECK (stars BETWEEN 0 AND 5)
) ENGINE = InnoDB;

-- The exam table has no id column. One guest can book one hotel once,
-- so the pair (customer_email, hotel_id) identifies a booking.
CREATE TABLE bookings (
    customer_email VARCHAR(120) NOT NULL,
    hotel_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    adults TINYINT UNSIGNED NOT NULL DEFAULT 1,
    children TINYINT UNSIGNED NOT NULL DEFAULT 0,
    boylovers TINYINT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (customer_email, hotel_id),
    CONSTRAINT fk_bookings_customer
        FOREIGN KEY (customer_email) REFERENCES customers (email)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_bookings_hotel
        FOREIGN KEY (hotel_id) REFERENCES hotels (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT chk_booking_dates CHECK (start_date <= end_date)
) ENGINE = InnoDB;

-- Neutral sample data so the API and the frontend can be tested at once.
-- Replace it with the exam data. The column names stay the same.

INSERT INTO customers (email, first_name, last_name, phone, birthday, image) VALUES
    ('anna.kovacs@example.com', 'Anna', 'Kovacs', '+36 30 111 1111', '1990-05-12', 'https://placehold.co/150x150/1d4ed8/ffffff?text=AK'),
    ('ben.nagy@example.com', 'Ben', 'Nagy', '+36 30 222 2222', '1985-11-03', 'https://placehold.co/150x150/0f766e/ffffff?text=BN'),
    ('cara.szabo@example.com', 'Cara', 'Szabo', '+36 30 333 3333', '1998-02-27', 'https://placehold.co/150x150/7c3aed/ffffff?text=CS');

INSERT INTO hotels (id, city, name, description, stars, owner_email, image) VALUES
    (1, 'Budapest', 'Danube View', 'A quiet hotel on the river with a breakfast room and a small sauna.', 4, 'anna.kovacs@example.com', 'https://placehold.co/800x500/0f172a/f8fafc?text=Danube+View'),
    (2, 'Balatonfured', 'Lake Garden', 'Family rooms, a garden, and a short walk to the beach.', 3, 'ben.nagy@example.com', 'https://placehold.co/800x500/14532d/f8fafc?text=Lake+Garden'),
    (3, 'Debrecen', 'City Loft', 'Modern rooms above a cafe in the old town.', 5, 'cara.szabo@example.com', 'https://placehold.co/800x500/7c2d12/f8fafc?text=City+Loft');

INSERT INTO bookings (customer_email, hotel_id, start_date, end_date, adults, children, boylovers) VALUES
    ('anna.kovacs@example.com', 1, '2025-07-01', '2025-07-05', 2, 1, 0),
    ('ben.nagy@example.com', 1, '2025-07-10', '2025-07-12', 1, 0, 0),
    ('cara.szabo@example.com', 2, '2025-08-01', '2025-08-08', 2, 2, 1),
    ('anna.kovacs@example.com', 3, '2024-12-20', '2025-01-02', 2, 0, 0),
    ('ben.nagy@example.com', 3, '2025-06-15', '2025-06-18', 1, 0, 0);
