import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { param, body } from "express-validator";
import { validationResultMiddleware } from "../middleware/validate.js";

const userRouter = Router();

userRouter.post("/login", 
    body("username").trim().notEmpty().withMessage("Missing field in body: username"),
    body("password").trim().notEmpty().withMessage("Missing field in body: password"),
    validationResultMiddleware,
    userController.loginUser
);

export default userRouter;