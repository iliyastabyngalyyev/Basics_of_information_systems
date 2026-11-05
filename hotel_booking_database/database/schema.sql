CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(20) UNIQUE NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    description TEXT,
    image_url TEXT
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    room_id INTEGER NOT NULL REFERENCES rooms(id),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed'
        CHECK (status IN ('confirmed', 'cancelled')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (check_out > check_in)
);

-- A room cannot have two active bookings over overlapping date ranges.
-- The [) range includes check-in and excludes check-out.
ALTER TABLE bookings
    DROP CONSTRAINT IF EXISTS no_overlapping_bookings;

ALTER TABLE bookings
    ADD CONSTRAINT no_overlapping_bookings
    EXCLUDE USING GIST (
        room_id WITH =,
        daterange(check_in, check_out, '[)') WITH &&
    )
    WHERE (status <> 'cancelled');

-- Optional sample data. Run once; duplicate emails/room numbers are ignored.
INSERT INTO users (name, email)
VALUES
    ('Ilyas', 'ilyas@example.com'),
    ('Alex', 'alex@example.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO rooms (room_number, room_type, price, capacity, description)
VALUES
    ('101', 'Standard', 50.00, 2, 'Comfortable standard room'),
    ('102', 'Deluxe', 90.00, 2, 'Deluxe room with city view'),
    ('103', 'Family', 120.00, 4, 'Large family room')
ON CONFLICT (room_number) DO NOTHING;
