import express from "express";
import upload from "../../utils/cloudinaryConfig.js";
import {
  createProductImage,
  getProductImages,
  getProductImageById,
  updateProductImage,
  deleteProductImage,
} from "../../controllers/admin/productImage.controller.js";

const router = express.Router();

router.post("/", upload.single("image"), createProductImage);
router.get("/", getProductImages);
router.get("/:id", getProductImageById);
router.put("/:id", updateProductImage);
router.delete("/:id", deleteProductImage);

export default router;
