const express = require("express");
const amiVoiceController = require("../controllers/amivoice.js");
const multer = require("multer");
const cors = require("cors");
const knex = require("../knex");
const { v4: uuidV4 } = require("uuid");

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
  app.get("/api/assign-id", async (req, res) => {
    const clientId = uuidV4();
    res.json({ clientId });
  });

  app.post("/api/users/locations", async (req, res) => {
    const { uuid, location } = req.body;

    if (!req.body || !uuid || !location) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const insertData = {
      uuid: req.body.uuid,
      latitude: location.latitude,
      longitude: location.longitude,
    };

    console.log(new Date().toLocaleString());
    console.log("🐣 insertData", insertData);

    try {
      await knex("locations").insert(insertData);
      res.status(200).json({ location: location });
    } catch (error) {
      console.error("Error inserting location:", error.message);
      res.status(500).json({ error: "Failed to insert location" });
    }
  });

  app.get("/api/users", async (req, res) => {
    try {
      const latestLocations = await knex("locations")
        .select("uuid", "latitude", "longitude", "created_at")
        .orderBy("uuid") // uuidでソート
        .orderBy("created_at", "desc") // uuidごとに最新のデータを優先
        .distinctOn("uuid"); // uuidごとに一意なデータを取得

      res.status(200).json(latestLocations); // JSONでクライアントに送信
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ error: "サーバーでエラーが発生しました。" });
    }
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
