import express from "express";
import { authorizeRoles, isAutheticated } from "../middlerware/auth";
import {
  deleteBlog,
  editBlogPost,
  getAllBlogs,
  getOneBlog,
  togglePublishBlog,
  uploadPost,
} from "../controllers/blog.controller";
const blogRouter = express.Router();

blogRouter.post(
  "/create-blog",
  isAutheticated,
  authorizeRoles("admin"),
  uploadPost
);

blogRouter.put(
  "/update-blog/:id",
  isAutheticated,
  authorizeRoles("admin"),
  editBlogPost
);

blogRouter.delete(
  "/delete-blog/:id",
  isAutheticated,
  authorizeRoles("admin"),
  deleteBlog
);
blogRouter.put(
  "/publish-blog/:id",
  isAutheticated,
  authorizeRoles("admin"),
  togglePublishBlog
);
blogRouter.get(
  "/get-all-blogs",
  isAutheticated,
  authorizeRoles("admin"),
  getAllBlogs
);
blogRouter.get(
  "/get-one-blog/:id",
  isAutheticated,
  authorizeRoles("admin"),
  getOneBlog
);

export default blogRouter;
