import express from "express";
import {
  getAllUsers,
  getUserByEmail,
  createUser,
  updateUserByEmail,
  deleteUserByEmail,
  loginUser,
  verifyEmail,
} from "../../controllers/website/user.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/verify/:token", verifyEmail);

// Protected routes
router.get("/", protect, getAllUsers);
router.get("/:email", protect, getUserByEmail);
router.put("/:email", protect, updateUserByEmail);
router.delete("/:email", protect, deleteUserByEmail);

export default router;
