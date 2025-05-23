import mongoose, { Schema } from "mongoose";
import { AvailableUserRoles, UserRoleEnum } from "../utils/constants.js";
// Enum for user roles in the system
const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: AvailableUserRoles,
      default: UserRoleEnum.MEMBER,
    },

  },
  { timestamps: true }
);

// Create a compound index to ensure unique name and createdBy combination
// projectSchema.index({ name: 1, createdBy: 1 }, { unique: true });



export const Project = mongoose.model("Project", projectSchema);
