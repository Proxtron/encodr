import { Router } from "express";
import * as videoController from "../controllers/videoController.js"
import { param, body } from "express-validator";
import { validationResultMiddleware } from "../middleware/validate.js";

const videoRouter = Router();

videoRouter.get("/:id", 
    param("id").isInt().withMessage("id param must be an integer"),
    validationResultMiddleware,
    videoController.getVideo
);

videoRouter.get("/",
    videoController.getAllVideos
)

videoRouter.post("/",
    body("title").trim().notEmpty().withMessage("Video title is required"),
    body("mimeType").trim().equals("video/mp4").withMessage("Video must be an mp4"),
    validationResultMiddleware,
    videoController.insertVideo
);


export default videoRouter;