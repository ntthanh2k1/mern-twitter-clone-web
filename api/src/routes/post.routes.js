import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { commentOnPost, createPost, deletePost, likeOrUnlikePost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createPost);

router.post("/like/:id", protectRoute, likeOrUnlikePost);

router.post("/comment/:id", protectRoute, commentOnPost);

router.delete("/:id", protectRoute, deletePost);

export default router;
