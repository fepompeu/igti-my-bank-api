import _ from "./env.js";
import app from "./src/config/custom-express.js";

app.listen(3000, () => {
  console.log("API Started!");
});
