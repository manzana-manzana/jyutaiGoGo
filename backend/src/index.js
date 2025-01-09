require("dotenv").config({ path: "./.env" });
const { setupServer } = require("./server");
const app = setupServer();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
