import express from "express";
import { followOrUnfollowUser, getSuggestedUsers, getUserProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);

router.get("/suggested", protectRoute, getSuggestedUsers);

router.post("/follow/:id", protectRoute, followOrUnfollowUser);

// router.post("/update", protectRoute, updateUserProfile);

export default router;
