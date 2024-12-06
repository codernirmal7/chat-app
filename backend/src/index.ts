import app from "./app";
import "dotenv/config";

const PORT = process.env.PORT || 5347; // set 5347 as default when no port is defined

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});