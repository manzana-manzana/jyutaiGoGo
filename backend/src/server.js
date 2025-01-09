const express = require("express");
const amiVoiceController = require("../controllers/amivoice.js");
const multer = require("multer");
const cors = require("cors");
const knex = require("../knex");
const { v4: uuidV4 } = require("uuid");
const agoraController = require("./agora/agoraController");

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

    // リクエストのバリデーション
    if (!req.body || !uuid || !location) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const insertData = {
      uuid,
      latitude: location.latitude,
      longitude: location.longitude,
      created_at: knex.fn.now(), // 最新時刻を入れる
    };

    console.log(new Date().toLocaleString());
    console.log("🐣 insertData", insertData);

    try {
      // ここでアップサート (onConflict -> merge) を行う
      await knex("locations")
        .insert(insertData)
        .onConflict("uuid")
        .merge({
          latitude: knex.raw("excluded.latitude"), // insertData.latitudeに相当
          longitude: knex.raw("excluded.longitude"),
          created_at: knex.raw("excluded.created_at"),
        });

      return res.status(200).json({ location });
    } catch (error) {
      console.error("Error upserting location:", error.message);
      return res.status(500).json({ error: "Failed to upsert location" });
    }
  });

  app.get("/api/users", async (req, res) => {
    try {
      const latestLocations = await knex("locations")
        .select("uuid", "latitude", "longitude", "created_at")
        .where("created_at", ">=", knex.raw(`NOW() - INTERVAL '10 minutes'`)) // 10分以上経過しているデータを除外
        .orderBy("uuid") // uuidでソート
        .orderBy("created_at", "desc") // uuidごとに最新のデータを優先
        .distinctOn("uuid"); // uuidごとに一意なデータを取得

      res.status(200).json(latestLocations);
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ error: "サーバーでエラーが発生しました。" });
    }
  });

  //Agoraここから-----------------------------------------------
  app.post('/api/tokens', agoraController.token);

  app.get("/", (req, res) => {
    console.log("hello world");
    res.status(200).send("Hello World!");
  });

  app.get("/test", (req, res) => {
    console.log("hello world");
    res.status(200).send("Test中です。");
  });

  return app;
}

module.exports = {
  setupServer,
};
