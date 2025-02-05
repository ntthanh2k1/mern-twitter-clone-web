import express from "express";
import { getInfo, signin, signout, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/getInfo", protectRoute, getInfo);

router.post("/signup", signup);

router.post("/signin", signin);

router.post("/signout", signout);

export default router;
