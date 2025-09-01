import { Router } from "express";
import { exampleGetController, examplePostController } from "../controllers/example.controller.js";

const router = Router();

router.route("/endpoint").get(exampleGetController);
router.route("/endpoint").post(examplePostController);

export default router;