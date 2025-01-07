// const express = require("express");
// const cors = require("cors");
//
// function setupServer() {
//   const app = express();
//   app.use(cors());
//
//   app.use(express.json());
//
//   app.use("/", express.static("../frontend/dist/"));
//
//   return app;
// }
//
// module.exports = {
//   setupServer,
// };

const express = require("express");
const amiVoiceController = require("../controllers/amivoice.js");
const multer = require("multer");
const cors = require("cors");
const knex = require("../knex");

function setupServer() {
  const app = express();
  app.use(cors());

  app.use(express.json());

  //Ami Voice-ここから-----------------------------------------------
  app.get("/api/jyutai/voice", (req, res) => {
    //動作test用
    console.log("test-server");
    res.status(200).send("D");
  });

  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });

  app.post("/api/jyutai/voice", upload.single("file"), async (req, res) => {
    console.log("POST /api/jyutai/voice-------------------------");

    const amiRes = await amiVoiceController.getTextByAmiVoice(req);
    console.log("amiRes++", amiRes);
    res.status(200).json(amiRes);
  });

  //expo-location-ここから-----------------------------------------------
  app.post("/api/users/locations", async (req, res) => {
    console.log("★★★ 受け取った request.body:", req.body);
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
  });

  // userId(uuid)を保存。今はまだ使っていないです。
  app.post("/api/uuid", (req, res) => {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    knex("users").insert({ uuid: userId, name: req.body.name });

    res.status(200).json({ message: "Success" });
  });

  app.get("/", (req, res) => {
    console.log("hello world");
    res.status(200).send("Hello World!");
  });

  return app;
}

module.exports = {
  setupServer,
};
