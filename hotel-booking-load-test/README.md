# Hotel Booking System — Load Test

This project uses Artillery to test your Hotel Booking System API.

## What the default test does
It starts **1 new virtual user per second for 60 seconds** (approximately 60 virtual users started during the minute). Each user sends a `GET /api/rooms` request. This is not 60 simultaneous users.

## Requirements
- Node.js and npm
- Your backend running
- `GET /api/rooms` available
- Permission to test the target server

## Setup
1. Open a terminal in this folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start your Hotel Booking backend in another terminal (for example, `npm start`).
4. Ensure the backend is available at `http://localhost:3000`. If not, change `target` in `tests/load-test.yml`.
5. Run:
   ```bash
   npm run load-test
   ```

## Save a JSON report
```bash
npm run load-test:report
```
Optional HTML report:
```bash
npm run report:html
```

## If you need 60 users started almost simultaneously
Replace the `phases` section in `tests/load-test.yml` with:
```yaml
  phases:
    - duration: 1
      arrivalRate: 60
      name: "Burst of approximately 60 virtual users"
```
This is a one-second burst. The default test is the one-minute arrival pattern.

## Results to inspect
- Response-time statistics (especially p95)
- HTTP status codes
- Request rate
- Failed requests / errors

A 200 response is a successful request, but evaluate latency and error rate too.

## Troubleshooting
- `ECONNREFUSED`: backend is not running or host/port is wrong.
- `404`: verify the `/api/rooms` route.
- `401` or `403`: endpoint requires authentication; add a test authorization token.
- Database errors: verify PostgreSQL connection and test data.

## Defense explanation
"We used Artillery to perform load testing on our Hotel Booking System. The test starts one virtual user per second for 60 seconds and sends requests to the rooms API. We analyze response time, request rate, HTTP status codes, and failed requests to evaluate backend performance."
