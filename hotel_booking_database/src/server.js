const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Database connection failed" });
  }
});

// List all rooms.
app.get("/api/rooms", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM rooms ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not retrieve rooms" });
  }
});

// List bookings, including customer and room details.
app.get("/api/bookings", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.id, b.check_in, b.check_out, b.status, b.created_at,
             u.name AS customer_name, u.email,
             r.room_number, r.room_type, r.price
      FROM bookings b
      JOIN users u ON u.id = b.user_id
      JOIN rooms r ON r.id = b.room_id
      ORDER BY b.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not retrieve bookings" });
  }
});

// Create a booking. PostgreSQL prevents overlapping active bookings.
app.post("/api/bookings", async (req, res) => {
  const { user_id, room_id, check_in, check_out } = req.body;

  if (!user_id || !room_id || !check_in || !check_out) {
    return res.status(400).json({
      error: "user_id, room_id, check_in and check_out are required"
    });
  }

  if (new Date(check_out) <= new Date(check_in)) {
    return res.status(400).json({ error: "check_out must be after check_in" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO bookings (user_id, room_id, check_in, check_out)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user_id, room_id, check_in, check_out]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23P01") {
      return res.status(409).json({
        error: "This room is already booked for some of these dates"
      });
    }
    if (error.code === "23503") {
      return res.status(400).json({ error: "The supplied user_id or room_id does not exist" });
    }
    console.error(error);
    res.status(500).json({ error: "Could not create booking" });
  }
});

// Cancel a booking without deleting its history.
app.patch("/api/bookings/:id/cancel", async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE bookings
       SET status = 'cancelled'
       WHERE id = $1 AND status <> 'cancelled'
       RETURNING *`,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Booking not found or already cancelled" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not cancel booking" });
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Hotel Booking API running at http://localhost:${port}`);
});
