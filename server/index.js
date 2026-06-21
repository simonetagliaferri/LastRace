import createApp from "./createApp.js";

const app = createApp();
const port = 3000;

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
})