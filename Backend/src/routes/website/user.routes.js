import express from "express";
import {
  getAllUsers,
  getUserByEmail,
  createUser,
  updateUserByEmail,
  deleteUserByEmail
} from "../../controllers/website/user.controller.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:email", getUserByEmail);
router.put("/:email", updateUserByEmail);
router.delete("/:email", deleteUserByEmail);

export default router;
