import "./env.js";
import app from "./src/config/custom-express.js";

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
