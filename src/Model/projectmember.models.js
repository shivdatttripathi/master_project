import mongoose from "mongoose";
const projectmemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const ProjectMember = mongoose.model(
  "ProjectMember",
  projectmemberSchema
);
