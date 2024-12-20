import fs from "fs"; //* as
import FormData from "form-data";
import axios from "axios";

const API_KEY =
  "9C5246C7C0A6DAB7AD857208E083B04A546268FD00A517388563AC9A4E79727C21F5D5684F";

const toAmi = async () => {
  console.log("toAmi スタート");
  const filePath = "./otukaresama01kawamoto 2.mp3";

  const url = "https://acp-api.amivoice.com/v1/recognize";
  const file = fs.createReadStream(filePath);
  const data = new FormData();
  data.append("a", file);
  const params = {
    u: API_KEY,
    d: "grammarFileNames=-a-general keepFillerToken=1",
  };

  const resAmi = await axios.request({
    method: "POST",
    url,
    data,
    headers: data.getHeaders(),
    params,
    maxBodyLength: Infinity,
  });

  console.log("Ami:", resAmi.data.text);
};

toAmi();
