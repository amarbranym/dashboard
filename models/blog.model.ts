import mongoose, { Schema, Types, Document, Model } from "mongoose";
import { IUser } from "./user.model";

interface IPost extends Document {
  title: string;
  slug: string;
  desc: string;
  thumbnail: {
    public_id: string;
    url: string;
  };
  author: IUser;
  tags: string[];
  published: boolean;
}

const blogPostSchema:Schema<IPost> = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    thumbnail: { public_id: String, url: String },
    author: { type: Schema.Types.ObjectId },
    tags: [{ type: String }],
    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const blogModel: Model<IPost> = mongoose.model("Blog", blogPostSchema);

export default blogModel;
