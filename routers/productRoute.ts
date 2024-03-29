import express from "express";
import {
  createProduct,
  getAllProducts,
  getSingleProd,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";

const router = express.Router();

router.post("/add-product", createProduct);
router.get("/get-products", getAllProducts);
router.get("/get-product/:sku", getSingleProd);
router.put("/update-product/:sku", updateProduct);
router.delete("/del-product/:sku", deleteProduct);

export default router;
