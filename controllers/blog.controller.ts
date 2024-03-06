import { Request, Response, NextFunction } from "express";
import cloudinary from "cloudinary";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middlerware/catchAsyncErrors";
import { createBlog } from "../services/blog.service";
import blogModel from "../models/blog.model";

// upload post

interface IUpdateBlogBody {
  title: string;
  slug: string;
  desc: string;
  thumbnail: string;
  author: string;
  tags?: string[];
  published: boolean;
}
export const uploadPost = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("user", req.user._id);

      const { title, slug, desc, thumbnail, tags, published }: IUpdateBlogBody =
        req.body;
      const userId = req.user?._id;
      let thumbnailData = null;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "blogpost",
        });
        thumbnailData = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      const blogData = {
        title,
        slug,
        desc,
        thumbnail: thumbnailData,
        author: userId,
        tags,
        published,
      };
      const blog = await blogModel.create(blogData);
      res.status(201).json({ success: true, blog });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// edit blog

export const editBlogPost = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blogId = req.params.id;
      const { title, slug, desc, thumbnail, tags, published }: IUpdateBlogBody =
        req.body;

      // Check if the blog exists
      const blog = await blogModel.findById(blogId);
      if (!blog) {
        return next(new ErrorHandler("blog not found", 400));
      }

      if (thumbnail && blog) {
        await cloudinary.v2.uploader.destroy(blog?.thumbnail?.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "blogpost",
        });

        blog.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      } else {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "blogpost",
        });

        blog.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      // Update the blog with the new data
      blog.title = title;
      blog.slug = slug;
      blog.desc = desc;
      blog.tags = tags;
      blog.published = published;

      // Save the updated blog
      await blog.save();

      res
        .status(200)
        .json({ success: true, message: "Blog updated successfully", blog });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const deleteBlog = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      // Check if the blog exists
      const blog = await blogModel.findById(id);
      if (!blog) {
        return next(new ErrorHandler("blog not found", 400));
      }

      // Delete the blog
      await blog.deleteOne();

      res
        .status(200)
        .json({ success: true, message: "Blog deleted successfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// publish and unpublish blog
export const togglePublishBlog = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blogId = req.params?.id;
      // Check if the blog exists
      const blog = await blogModel.findById(blogId);
      if (!blog) {
        return next(new ErrorHandler("blog not found", 400));
      }

      // Toggle the published status
      blog.published = !blog.published;

      // Save the updated blog
      await blog.save();

      res.status(200).json({
        success: true,
        message: `Blog ${
          blog.published ? "published" : "unpublished"
        } successfully`,
        blog,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all blogs
export const getAllBlogs = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blogs = await blogModel.find();
      res.status(201).json(blogs);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get one using id
export const getOneBlog = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blogId = req.params.id;

      // Check if the blog exists
      const blog = await blogModel.findById(blogId);
      if (!blog) {
        return next(new ErrorHandler("blog not found", 400));
      }

      res.json(blog);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
