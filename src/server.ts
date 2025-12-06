import app from "./app";
import config from "./config";

app.listen(config.PORT, () => {
  console.log(`Drive Mate API is running on port ${config.PORT} 🚀 `);
});
