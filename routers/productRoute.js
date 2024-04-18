"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const router = express_1.default.Router();
router.post("/add-product", productController_1.createProduct);
router.get("/get-products", productController_1.getAllProducts);
router.get("/get-product/:sku", productController_1.getSingleProd);
router.put("/update-product/:sku", productController_1.updateProduct);
router.delete("/del-product/:sku", productController_1.deleteProduct);
exports.default = router;
