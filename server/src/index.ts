import express from "express";
import { envConfig } from "./util/config.ts";
import { HandleError, notFound } from "./middleware/ErroHandling.ts";
import authroute from "./routes/user_route.ts";

const server = express();
server.use(express.json());
server.use("/api/auth", authroute);
server.use(HandleError);
server.use(notFound);
server.listen(envConfig.PORT, () => {
  console.log(`server running on port ${envConfig.PORT}`);
});
