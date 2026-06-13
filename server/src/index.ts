import express from "express";
import { config } from "dotenv";
import { HandleError, notFound } from "./middleware/ErroHandling.ts";
import authroute from "./routes/user_route.ts";
import cors from "cors";
import doctorroute from "./routes/doctor_route.ts";
import symptomroute from "./routes/symptom.ts";
import type { Request, Response } from "express";
config();
const server = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://final-project-drab-eight.vercel.app",
];
server.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
server.use(express.json());
server.use("/api/auth", authroute);
server.use("/api/doctor", doctorroute);
server.use("/api/ai", symptomroute);

server.get("/health", (_req: Request, res: Response) => {
  return res.json({ message: "Server is healthy!" });
});
server.use(HandleError);

server.use(notFound);
server.listen(process.env.PORT, () => {
  console.log(`server running on port  ${process.env.PORT}`);
});
