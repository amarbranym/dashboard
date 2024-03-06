import { Response } from "express";
import BlogModel from "../models/blog.model";
import { CatchAsyncError } from "../middlerware/catchAsyncErrors";

// create blog

export const createBlog = CatchAsyncError(async (data: any, res: Response) => {
  const blog = await BlogModel.create(data);

  res.status(201).json({ success: true, blog });
});
