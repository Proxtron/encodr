import { Router } from "express";
import * as videoController from "../controllers/videoController.js"

const videoRouter = Router();

videoRouter.get("/:id", videoController.getVideo);

export default videoRouter;