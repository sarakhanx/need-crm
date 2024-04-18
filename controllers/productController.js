"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getSingleProd = exports.getAllProducts = exports.createProduct = void 0;
const db_config_1 = __importDefault(require("../libs/config/db.config"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let conn;
    const pool = yield (0, db_config_1.default)();
    const doc_id = req.body.doc_id;
    const { title, description, size, qty, price, note, sku, discount, } = req.body.item;
    try {
        conn = yield pool.getConnection();
        const sqlQuery = "INSERT INTO Product (title , description , size , qty , price , note , sku , discount , doc_id) VALUES (?,?,?,?,?,?,?,?,?)";
        yield conn.query(sqlQuery, [
            title,
            description,
            size,
            qty,
            price,
            note,
            sku,
            discount,
            doc_id
        ]);
        res.status(201).json({
            message: "Product created successfully",
            data: {
                productname: title,
                description: description,
                size: size,
                qty: qty,
                price: price,
                note: note,
                sku: sku,
                discount: discount,
                doc_id: doc_id
            },
        });
        console.log(req.body.item);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
});
exports.createProduct = createProduct;
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let conn;
    const pool = yield (0, db_config_1.default)();
    try {
        conn = yield pool.getConnection();
        const products = yield conn.query("SELECT * FROM Product");
        res.status(200).json({ products: products[0] });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
});
exports.getAllProducts = getAllProducts;
const getSingleProd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.params.sku;
    let conn;
    const pool = yield (0, db_config_1.default)();
    try {
        conn = yield pool.getConnection();
        const isExistedProduct = yield conn.query(`SELECT * FROM Product WHERE sku = ?`, [params]);
        if (!isExistedProduct.length) {
            return res.status(400).json({ send: "data not found" });
        }
        res.status(200).json({ data: isExistedProduct });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ send: "Internal server error" });
    }
});
exports.getSingleProd = getSingleProd;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sku = req.params.sku;
    const { title, description, size, qty, price, note, discount, total_price, } = req.body;
    if (!title || !description || !size || !qty || !price) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    let conn;
    const pool = yield (0, db_config_1.default)();
    try {
        conn = yield pool.getConnection();
        const isExistedProduct = yield conn.query(`SELECT * FROM Product WHERE sku = ?`, [sku]);
        if (!isExistedProduct.length) {
            console.log("A product not found");
            res.status(404).json({ error: "A product not found" });
        }
        const sqlQuery = "UPDATE Product SET title = ? , description = ? , size = ? , qty = ? , price = ? , note = ? , discount = ? , total_price = ? WHERE sku = ?";
        yield conn.query(sqlQuery, [
            title,
            description,
            size,
            qty,
            price,
            note,
            discount,
            total_price,
            sku
        ]);
        res.status(200).json({ message: "data updated successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sku = req.params.sku;
    let conn;
    const pool = yield (0, db_config_1.default)();
    try {
        conn = yield pool.getConnection();
        const isExistedProduct = yield conn.query(`SELECT * FROM Product WHERE sku = ?`, [sku]);
        if (!isExistedProduct.length) {
            return res.status(404).json({ send: "data not found" });
        }
        const sqlQuery = "DELETE FROM Product WHERE sku = ?";
        yield conn.query(sqlQuery, [sku]);
        res.status(200).json({ send: "Data deleted successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ send: "Internal server error" });
    }
});
exports.deleteProduct = deleteProduct;
