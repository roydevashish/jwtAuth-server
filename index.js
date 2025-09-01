// config environment variables
import dotenv from "dotenv";
dotenv.config({path: "./env"});

import connectToDB from "./src/db/connectToDB.js";
import app from "./src/app.js";

connectToDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`💻 Server running at port: ${process.env.PORT}`);
  });
}).catch((error) => {
  console.log(`🚫 MongoDB connection failed.`);
  console.log(error);
});