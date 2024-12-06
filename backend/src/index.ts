import app from "./app";
import "dotenv/config";
import connectToDB from "./db/mongo.db";

const PORT = process.env.PORT || 5347; // Set 5347 as default when no port is defined

connectToDB(process.env.MONGODB_CONNECTION_URI as string)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });