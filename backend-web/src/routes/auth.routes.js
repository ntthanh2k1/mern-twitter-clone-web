import express from "express";
import { getInfo, signIn, signOut, signUp } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/getInfo", protectRoute, getInfo);

router.post("/signUp", signUp);

router.post("/signIn", signIn);

router.post("/signOut", signOut);

export default router;
