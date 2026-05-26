import { Router } from "express";
import * as videoController from "../controllers/videoController.js"
import { param } from "express-validator";
import { validationResultMiddleware } from "../middleware/middleware.js";

const videoRouter = Router();

videoRouter.get("/:id", 
    param("id").isInt().withMessage("id param must be an integer"),
    validationResultMiddleware,
    videoController.getVideo
);

export default videoRouter;