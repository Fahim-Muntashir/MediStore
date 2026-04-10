import { Request, Response } from "express";
import { blogService } from "./blog.service";

const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const result = await blogService.getAllBlogs();
    res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getSingleBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await blogService.getBlogById(id);
    if (!result) {
      res.status(404).json({ success: false, message: "Blog not found" });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const blogController = {
  getAllBlogs,
  getSingleBlog
};
