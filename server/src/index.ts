import express from "express";
import { config } from "dotenv";
import { HandleError, notFound } from "./middleware/ErroHandling.ts";
import authroute from "./routes/user_route.ts";
import cors from "cors";
import doctorroute from "./routes/doctor_route.ts";

config();
const server = express();
server.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
server.use(express.json());
server.use("/api/auth", authroute);
server.use("/api/doctor", doctorroute);
server.use(HandleError);

server.use(notFound);
server.listen(process.env.PORT, () => {
  console.log(`server running on port  ${process.env.PORT}`);
});
