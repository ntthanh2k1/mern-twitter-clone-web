import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { commentOnPost, createPost, deletePost, getAllPosts, likeOrUnlikePost } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/getAll", protectRoute, getAllPosts);

router.post("/create", protectRoute, createPost);

router.post("/like/:id", protectRoute, likeOrUnlikePost);

router.post("/comment/:id", protectRoute, commentOnPost);

router.delete("/:id", protectRoute, deletePost);

export default router;
