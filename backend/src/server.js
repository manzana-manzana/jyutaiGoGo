const express = require("express");
const cors = require("cors");
const path = require("path");

function setupServer() {
  const app = express();
  app.use(cors());

  app.use(express.json());

  // Reactのビルドディレクトリのパスを解決
  const frontendPath = path.resolve(__dirname, "../../frontend/dist");
  app.use("/", express.static("../frontend/dist/"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });

  // メソッド参考になるかも？
  // app.get("/shops", shopController.all);
  // app.get("/shops/:id", shopController.view);
  // app.post("/shops", shopController.save);

  return app;
}

module.exports = {
  setupServer,
};
