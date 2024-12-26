const express = require("express");
// const cors = require("cors");
// const path = require("path");
const amiVoiceController = require("../controllers/amivoice.js")
const formidable = require("formidable");
const FormData = require('form-data');
const fs = require('fs');
const  multer= require("multer")



function setupServer() {
  const app = express();
  // app.use(cors());

  app.use(express.json());

  // Reactのビルドディレクトリのパスを解決
  // const frontendPath = path.resolve(__dirname, "../../frontend/dist");
  // app.use("/", express.static("../frontend/dist/"));

  // app.get("*", (req, res) => {
  //   res.sendFile(path.join(frontendPath, "index.html"));
  // });

  // メソッド参考になるかも？
  // app.get("/shops", shopController.all);
  // app.get("/shops/:id", shopController.view);
  // app.post("/shops", shopController.save);

  //Ami Voice-ここから-----------------------------------------------
  app.get("/api/jyutai/voice",(req,res)=>{
    //動作test用
    console.log('test-server')
    res.status(200).send('D')
  })

  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });

  app.post('/api/jyutai/voice', upload.single('file'), async (req, res) => {
    console.log("POST /api/jyutai/voice-------------------------")

    const amiRes = await amiVoiceController.getTextByAmiVoice(req)
    console.log("amiRes++",amiRes)
    res.status(200).json(amiRes)

  });
  //Ami Voice-ここまで-----------------------------------------------

  return app;
}

module.exports = {
  setupServer,
};
