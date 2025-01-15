const express = require("express");
const amiVoiceController = require("../controllers/amivoice.js");
const multer = require("multer");
const cors = require("cors");
const knex = require("../knex");
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
  app.get(`/api/users/:id`, async (req, res) => {
    const userId = req.params.id;

    try {
      const user = await knex("users").where({ id: userId }).first(); // 一致する最初のレコードを取得

      if (!user) {
        return res
          .status(404)
          .json({ error: "指定されたユーザーが見つかりません。" });
      }

      const username = user.username;
      console.log("⚡️username", username);

      res.status(200).json({ username });
    } catch (error) {
      console.error("Error fetching username:", error);
      res.status(500).json({ error: "サーバーでエラーが発生しました。" });
    }
  });

  app.post("/api/users", async (req, res) => {
    console.log("🍅:", req.body);
    const { username } = req.body;
    console.log("username: ", username);

    // リクエストのバリデーション
    if (!req.body || !username) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const insertData = {
      username,
    };

    try {
      const user = await knex("users").insert(insertData).returning("*");
      console.log("inserted user:", user);
      return res.status(200).json({ user });
    } catch (error) {
      console.error("Error insert user:", error.message);
      return res.status(500).json({ error: "Failed to insert user" });
    }
  });

  app.post("/api/users/locations", async (req, res) => {
    const { user_id, latitude, longitude } = req.body;

    // バリデーション
    if (!req.body || !user_id || !latitude || !longitude) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    // DBに挿入するデータを作成
    const insertData = {
      user_id,
      latitude,
      longitude,
      updated_at: knex.fn.now(),
    };

    console.log(new Date().toLocaleString());
    console.log("🐣 insertData", insertData);

    try {
      // onConflict -> merge でアップサート
      await knex("locations")
        .insert(insertData)
        .onConflict("user_id")
        .merge({
          latitude: knex.raw("excluded.latitude"),
          longitude: knex.raw("excluded.longitude"),
          updated_at: knex.raw("excluded.updated_at"),
        });

      // クライアントに返す
      return res.status(200).json({
        message: "Upsert succeeded",
        location: {
          user_id,
          latitude,
          longitude,
        },
      });
    } catch (error) {
      console.error("Error upserting location:", error.message);
      return res.status(500).json({ error: "Failed to upsert location" });
    }
  });

  app.get("/api/users", async (req, res) => {
    try {
      // locations テーブルからデータ取得しつつ、users テーブルから username もまとめて取得
      const locationsWithUsername = await knex("locations")
        .select(
          "locations.user_id",
          "locations.latitude",
          "locations.longitude",
          "users.username",
        )
        .join("users", "locations.user_id", "=", "users.id"); // user_id と users.id をJOIN
      res.status(200).json(locationsWithUsername);
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ error: "サーバーでエラーが発生しました。" });
    }
  });

  //Agoraここから-----------------------------------------------
  app.post("/api/tokens", agoraController.token);

  app.get("/", (req, res) => {
    console.log("hello world");
    res.status(200).send("Hello World!");
  });

  return app;
}

module.exports = {
  setupServer,
};
