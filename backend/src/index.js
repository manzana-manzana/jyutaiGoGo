require("dotenv").config({ path: "./.env" });

const { setupServer } = require("./server");

const app = setupServer();

const PORT = process.env.PORT;
const HOST = process.env.DB_HOST

app.listen(PORT, () => {
  console.log(`Server running on: https://${HOST}:${PORT}/`);
});
