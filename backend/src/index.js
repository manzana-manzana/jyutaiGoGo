require("dotenv").config({ path: "./.env" });
const { setupServer } = require("./server");
const app = setupServer();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on: http://192.168.11.5:${PORT}`);
});
