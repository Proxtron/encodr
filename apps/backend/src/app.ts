import "dotenv/config";
import { env } from "./config/env.js";
import express from "express";
import path from "node:path";
import cors from "cors";
import videoRouter from "./routes/videoRouter.js";
import { errorHandler } from "./middleware/error.js";
import { pinoHttp } from "pino-http";
import { logger } from "./config/logger.js";
import userRouter from "./routes/userRouter.js";
import { checkAuth } from "./middleware/auth.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({ origin: env.CLIENT_HOST, credentials: true }));

const assetsPath = path.join(import.meta.dirname, "public");
app.use(express.static(assetsPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(pinoHttp( { logger }));

//Routers
app.use("/video", checkAuth, videoRouter);
app.use("/user", userRouter);

//Error handler
app.use(errorHandler);

const PORT = env.PORT;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});