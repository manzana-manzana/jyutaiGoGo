require("dotenv").config({ path: "./.env" });
const { setupServer } = require("./server");
const app = setupServer();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on: http://172.20.10.3:${PORT}`);
});