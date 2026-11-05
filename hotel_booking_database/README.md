# Hotel Booking System — Database & API

This folder contains the database and backend API part of the Hotel Booking System.

## Technology
- PostgreSQL
- Node.js
- Express
- `pg` (PostgreSQL client)

## Folder structure

```text
hotel-booking-database/
├── database/
│   └── schema.sql
├── src/
│   ├── db.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Setup

1. Install Node.js and PostgreSQL.
2. Create a PostgreSQL database named `hotel_booking`.
3. Open `database/schema.sql` in pgAdmin or `psql` and run it against `hotel_booking`.
4. In this folder, install packages:

   ```bash
   npm install
   ```

5. Copy `.env.example` to `.env` and enter your own PostgreSQL password.
6. Start the API:

   ```bash
   npm start
   ```

7. Open `http://localhost:3000/api/health`. A successful response looks like:

   ```json
   {"status":"ok","database":"connected"}
   ```

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check API and database connection |
| GET | `/api/rooms` | Get all rooms |
| GET | `/api/bookings` | Get bookings with customer and room details |
| POST | `/api/bookings` | Create a booking |
| PATCH | `/api/bookings/:id/cancel` | Cancel a booking |

### Example: create a booking

Send a `POST` request to `http://localhost:3000/api/bookings` with JSON:

```json
{
  "user_id": 1,
  "room_id": 1,
  "check_in": "2026-11-10",
  "check_out": "2026-11-15"
}
```

The sample users and rooms are inserted by `schema.sql`. Use their actual IDs from your database.

## Important
- Do not share your `.env` file or commit it to Git.
- This is a project starter, not a production-ready booking platform. Add authentication, authorization, input validation, rate limiting, and payment handling before real-world deployment.
- Make sure the rest of your team uses the same API routes and data format when integrating the frontend.
