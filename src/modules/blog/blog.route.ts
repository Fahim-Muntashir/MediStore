import express from "express";
import { blogController } from "./blog.controller";

const router = express.Router();

router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getSingleBlog);

export const blogRoutes = router;
