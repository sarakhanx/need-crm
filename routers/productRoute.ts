import express from "express"
import {createProduct} from "../controllers/productController"

const router = express.Router();

router.post('/add-product' , createProduct )


export default router;