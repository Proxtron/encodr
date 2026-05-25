import express from "express";
import "dotenv/config";
import path from "node:path";
import type { Request, Response, NextFunction } from "express";
// import session from "express-session";
// import { PrismaSessionStore } from "@quixo3/prisma-session-store";
// import { prisma } from "./db/prisma.js"
import indexRouter from "./routes/indexRouter.js";
// import passport from "passport";
// import flash from "connect-flash";
// import passportConfig from "./config/passportConfig.js";
import { AppError } from "./error/error.js";
import cors from "cors";
import videoRouter from "./routes/videoRouter.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));

const assetsPath = path.join(import.meta.dirname, "public");
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));

// const sessionSecret = process.env.SECRET;
// if(!sessionSecret) throw new Error("SECRET env var is not set");

// app.use(session({
//     store: new PrismaSessionStore(prisma, {}),  
//     secret: sessionSecret, 
//     resave: false, 
//     saveUninitialized: false
// }));

// app.use(passport.initialize());
// app.use(passport.session());
// app.use(flash());
// passportConfig();

// app.use((req: Request, res: Response, next: NextFunction) => {
//     res.locals.user = req.user;
//     next();
// });

//Routers
app.use("/", indexRouter);
app.use("/video", videoRouter)

//Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof AppError) {
        return res.status(err.statusCode).render("error", {message: err.message});
    }
    console.error(err);
    res.status(500).render("error", {message: "Something went wrong"});
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Listening on port 3000")
});