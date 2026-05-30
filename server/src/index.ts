import express from "express";
import { envConfig } from "./util/config.ts";
import { HandleError, notFound } from "./middleware/ErroHandling.ts";
import authroute from "./routes/user_route.ts";
import cors from "cors";
const server = express();
server.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend
    credentials: true,
  }),
);
server.use(express.json());
server.use("/api/auth", authroute);
server.use(HandleError);
server.use(notFound);
server.listen(envConfig.PORT, () => {
  console.log(`server running on port ${envConfig.PORT}`);
});
