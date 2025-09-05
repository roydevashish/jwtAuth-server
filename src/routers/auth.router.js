import { Router } from "express";
import { register, login, logout, refreshAccessToken } from "../controllers/auth.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(verifyJWT, logout);
router.route("/refresh-token").post(refreshAccessToken);

export default router;