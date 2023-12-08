// src/index.ts
import express from "express";
import * as bodyParser from "body-parser";
import router from "./src/router";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use("/api", router);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});