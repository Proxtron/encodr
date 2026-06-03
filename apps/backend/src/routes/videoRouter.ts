import { Router } from "express";
import * as videoController from "../controllers/videoController.js"
import { param, body } from "express-validator";
import { validationResultMiddleware } from "../middleware/middleware.js";

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
    body("filename").trim().notEmpty().withMessage("Video file name is required")
    // 1. Ensure it ends exactly with .mp4 (case-insensitive)
    // 2. Reject illegal OS filename characters (\ / : * ? " < > |)
    .matches(/^[^\\/:\*\?"<>\|]+\.mp4$/i).withMessage('Invalid file name. It must be a valid name ending in .mp4.'),
    validationResultMiddleware,
    videoController.insertVideo
);


export default videoRouter;