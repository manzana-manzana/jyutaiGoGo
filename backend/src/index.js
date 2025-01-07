
const express = require("express");
// const app = express();
const knex = require("../knex.js");

app.use(express.json());

// userLocationを保存
app.post("/api/users/locations", async (req, res) => {
  const { user_id, location } = req.body;
  if (!req.body || !user_id || !location) {
    return res.status(400).json({ error: "Invalid request data" });
  }


  const insertData = {
    user_id: req.body.user_id,
    latitude: location.latitude,
    longitude: location.longitude,
  };

  try {
    await knex("locations").insert(insertData);
    res.status(200).json({ location: location });
  } catch (error) {
    console.error("Error inserting location:", error.message);
    res.status(500).json({ error: "Failed to insert location" });
  }

const PORT = process.env.PORT;
const HOST = process.env.DB_HOST

})
app.listen(PORT, () => {
  console.log(`Server running on: https://${HOST}:${PORT}/`);

});

// userId(uuid)を保存
app.post("/api/uuid", (req, res) => {
  const userId = req.body.userId;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  knex("users").insert({ uuid: userId, name: req.body.name });

  res.status(200).json({ message: "Success" });
});

app.get("/", (req, res) => {
  res.send("Welcome to the API server!");
});



// サーバー起動
// app.listen(3000, () => {
//   console.log(`Server listening on: http://localhost:${3000}/`);
// });
app.listen(3000, () => {
  console.log(`Server listening on: http://localhost:${3000}/`)
});

// require("dotenv").config({ path: "./.env" });
//
// const { setupServer } = require("./server");
//
// const app = setupServer();
//
// const PORT = process.env.PORT;
//
// app.listen(PORT, () => {
//   console.log(`Server running on: http://localhost:${PORT}/`);
// });

require("dotenv").config({ path: "./.env" });
const { setupServer } = require("./server");
const app = setupServer();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on: http://192.168.11.5:${PORT}`);
});

