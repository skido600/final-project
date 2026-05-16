import express from "express";
import { envConfig } from "./util/config";

const server = express();

server.listen(envConfig.PORT, () => {
  console.log(`server running on port ${envConfig.PORT}`);
});
