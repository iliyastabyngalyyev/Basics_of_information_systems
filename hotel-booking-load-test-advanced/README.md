# Advanced Hotel Booking System Load Testing

A small Artillery test suite for a Node.js/Express Hotel Booking System API.

## Folder structure

```text
hotel-booking-load-test-advanced/
├── package.json
├── .env.example
├── .gitignore
├── README.md
├── scripts/
│   └── check-target.js
├── reports/
└── tests/
    ├── rooms-load.yml
    ├── auth-load.yml
    ├── booking-load.yml
    ├── full-load.yml
    └── data/
        └── users.csv
```

## What each test does

- `rooms-load.yml`: starts 1 new virtual user per second for 60 seconds and calls `GET /api/rooms`.
- `auth-load.yml`: tests `POST /api/auth/login`. Update the route and test accounts to match your backend.
- `booking-load.yml`: checks the rooms and bookings endpoints. A real booking creation test requires your API's exact request body and a valid test token.
- `full-load.yml`: runs two stages: approximately 60 new users/minute, then 120 new users/minute. It mixes room browsing and booking-list reads.

**Arrival rate is not the same as concurrent users.** `arrivalRate: 1` means one new virtual user starts each second. The number active at once depends on how long each scenario takes. To hold a target number of concurrent users, configure a suitable scenario duration and use Artillery's arrival/concurrency controls based on your exact test goal.

## 1. Requirements

- Node.js 18+ (for built-in `fetch` in the target checker).
- Your backend running on `http://localhost:3000`, or set `TARGET_URL`.
- The routes in the YAML files must exist.
- Use a local/staging test database and test accounts only.

## 2. Install

```bash
npm install
```

Copy `.env.example` to `.env` if you want to keep local settings. Set the target in your terminal:

macOS/Linux:
```bash
export TARGET_URL=http://localhost:3000
```

PowerShell:
```powershell
$env:TARGET_URL="http://localhost:3000"
```

## 3. Start backend and check it

In another terminal, start your backend, for example:

```bash
npm start
```

Then run:

```bash
npm run check:target
```

## 4. Run tests

```bash
npm run test:rooms
npm run test:auth
npm run test:booking
npm run test:full
```

Save a JSON report:

```bash
npm run test:report
```

Generate an HTML report:

```bash
npm run report:html
```

## 5. Adapt endpoints before testing

The starter backend previously used:
- `GET /api/rooms`
- `POST /api/bookings`
- `GET /api/bookings`

The auth endpoint `/api/auth/login` is a placeholder assumption. Change it to your actual login route. If `/api/bookings` requires JWT, add an Authorization header and a valid test token. Do not weaken your real authentication to make a test pass.

For a booking-creation scenario, use the exact JSON schema required by your own `POST /api/bookings` endpoint. Use a dedicated test user and test room, and clean up test bookings after each run. Avoid generating hundreds of permanent bookings in your real database.

## 6. Interpreting results

Review:
- response-time median and p95/p99
- HTTP response codes
- request rate
- failed requests and timeouts

A test is not automatically a pass just because the server returns HTTP 200. Define acceptable response-time and error-rate targets with your team, then compare the report to those targets.

## 7. Safety

Run load tests only against systems you own or are explicitly authorized to test. Start with the 60-arrival baseline and monitor CPU, memory, and PostgreSQL connections. Do not run the higher-load phase against production without approval.
