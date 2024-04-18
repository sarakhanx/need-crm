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
exports.getDocsBySeller = exports.getAllDocs = exports.deleteDoc = exports.getADoc = exports.updateDoc = exports.createDoc = exports.getSomeDoc = void 0;
const db_config_1 = __importDefault(require("../libs/config/db.config"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getSomeDoc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.params.id;
    let conn;
    const pool = yield (0, db_config_1.default)();
    try {
        conn = yield pool.getConnection();
        const sqlQuery = `SELECT * FROM Doc WHERE id = ${params}`;
        const result = yield conn.query(sqlQuery);
        res.status(200).json({ data: result });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getSomeDoc = getSomeDoc;
const createDoc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let conn;
    const pool = yield (0, db_config_1.default)();
    try {
        conn = yield pool.getConnection();
        const { sellerId, dealerId, customerId } = req.body;
        const result = yield conn.query("INSERT INTO Doc (seller_id, dealer_id, client_id) VALUES (?, ?, ?)", [sellerId, dealerId, customerId]);
        const docId = parseInt(result.insertId);
        res.status(201).json({
            message: "Document created successfully",
            data: { sellerId, dealerId, customerId, docId },
        });
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
exports.createDoc = createDoc;
const updateDoc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let conn;
    const pool = yield (0, db_config_1.default)();
    try {
        conn = yield pool.getConnection();
        const { id, sellerId, dealerId, customerId } = req.body;
        // console.log(sellerId, dealerId, customerId);
        // Update document in the database
        const result = yield conn.query("UPDATE Doc SET seller_id = ?, dealer_id = ?, client_id = ? WHERE id = ?", [sellerId, dealerId, customerId, id]);
        res.status(200).json({
            message: "Document updated successfully",
            data: { sellerId, dealerId, customerId },
        });
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
exports.updateDoc = updateDoc;
const getADoc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const DocId = req.params.id;
    let conn;
    const pool = yield (0, db_config_1.default)();
    try {
        conn = yield pool.getConnection();
        const doc = yield conn.query(`SELECT
          Doc.createdAt AS doc_createdAt,
          Doc.id as DocId,
          User.name AS user_name,
          User.lastname AS user_lastname,
          User.roles AS user_roles,
          Company.logo AS company_logo,
          Company.company_name AS company_name,
          Company.company_address AS company_address,
          Company.company_contact AS company_contact,
          Company.company_vat_id AS company_vat_id,
          Customer.name AS customer_name,
          Customer.lastname AS customer_lastname,
          Customer.customer_address AS customer_address,
          Customer.customer_mobile AS customer_mobile,
          Customer.company_name AS customer_company_name,
          (
              SELECT GROUP_CONCAT(
                  CONCAT(
                      'Title: ', title, ', ',
                      'Size: ', size, ', ',
                      'Qty: ', qty, ', ',
                      'Price: ', price, ', ',
                      'Discount: ', discount, ', ',
                      'Total Price: ', total_price
                  ) SEPARATOR '; '
              )
              FROM Product
              WHERE Product.doc_id = Doc.id
          ) AS products,
          (
              SELECT SUM(total_price)
              FROM Product
              WHERE Product.doc_id = Doc.id
          ) AS net
      FROM Doc
      JOIN Company ON Doc.dealer_id = Company.id
      JOIN User ON Doc.seller_id = User.id
      JOIN Customer ON Doc.client_id = Customer.id
      WHERE Doc.id = ?;
      `, [DocId]);
        const data = doc[0];
        const productsString = doc[0].products;
        const productsArray = productsString
            ? productsString.split("; ").map((product) => {
                const attributes = product.split(", ");
                const productObject = {};
                attributes.forEach((attribute) => {
                    const [key, value] = attribute.split(": ");
                    productObject[key.trim()] = value.trim();
                });
                return productObject;
            })
            : [];
        const documentData = Object.assign(Object.assign({}, data), { productsArray });
        const logoPath = data.company_logo
            ? `http://localhost:5500/uploads/company_assets/${data.company_logo}`
            : null;
        documentData.company_logo_path = logoPath;
        res.status(200).json({ doc: documentData });
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
exports.getADoc = getADoc;
const deleteDoc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.params.id;
    let conn;
    const pool = yield (0, db_config_1.default)();
    try {
        conn = yield pool.getConnection();
        const isExisted = yield conn.query(`SELECT * FROM Doc WHERE id = ?`, [
            params,
        ]);
        if (!isExisted.length) {
            return res.status(400).json({ send: "data not found" });
        }
        const sqlQuery = "DELETE FROM Doc WHERE id = ?";
        yield conn.query(sqlQuery, [params]);
        res.status(200).json({ send: "data deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "internal server error" });
    }
});
exports.deleteDoc = deleteDoc;
const getAllDocs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let conn;
    const pool = yield (0, db_config_1.default)();
    try {
        conn = yield pool.getConnection();
        const docs = yield conn.query(`SELECT
        Doc.createdAt AS doc_createdAt,
        User.name AS user_name, User.lastname AS user_lastname, User.roles AS user_roles,
        Company.company_name AS company_name, Company.company_address AS company_address, Company.company_contact AS company_contact, Company.company_vat_id AS company_vat_id,
        Customer.name AS customer_name, Customer.lastname AS customer_lastname, Customer.customer_address AS customer_address, Customer.customer_mobile AS customer_mobile,
        (SELECT GROUP_CONCAT(CONCAT( 
            'Title: ', title, ', ',
            'Size: ', size, ', ',
            'Qty: ', qty, ', ',
            'Price: ', price, ', ',
            'Discount: ', discount, ', ',
            'Total Price: ', total_price
        ) SEPARATOR '; ') FROM Product WHERE Product.doc_id = Doc.id) AS products,
        (SELECT SUM(total_price) FROM Product WHERE Product.doc_id = Doc.id) AS total
    FROM Doc
    JOIN Company ON Doc.dealer_id = Company.id
    JOIN User ON Doc.seller_id = User.id
    JOIN Customer ON Doc.client_id = Customer.id`);
        const allDocs = [];
        for (let i = 0; i < docs.length; i++) {
            const data = docs[i];
            const productsString = docs[i].products;
            const productsArray = productsString
                ? productsString.split("; ").map((product) => {
                    const attributes = product.split(", ");
                    const productObject = {};
                    attributes.forEach((attribute) => {
                        const [key, value] = attribute.split(": ");
                        productObject[key.trim()] = value.trim();
                    });
                    return productObject;
                })
                : [];
            allDocs.push(Object.assign(Object.assign({}, data), { productsArray }));
        }
        res.status(200).json({ doc: allDocs });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "internal server error" });
    }
});
exports.getAllDocs = getAllDocs;
const getDocsBySeller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let conn;
    const pool = yield (0, db_config_1.default)();
    const sellerId = req.params.sellerId;
    console.log(sellerId);
    try {
        conn = yield pool.getConnection();
        const query = `SELECT
  Doc.createdAt, Doc.id AS id,
  User.name AS user_name, User.lastname AS user_lastname, User.roles,
  Company.company_name, Company.company_address, Company.company_contact, Company.company_vat_id,
  Customer.name AS customer_name, Customer.lastname AS customer_lastname, Customer.customer_address, Customer.customer_mobile, Customer.company_name AS customer_company_name, Customer.id AS customer_id,
  (
    SELECT GROUP_CONCAT(CONCAT(
      'Title: ', title, ', ',
      'Size: ', size, ', ',
      'Qty: ', qty, ', ',
      'Price: ', price, ', ',
      'Discount: ', discount, ', ',
      'Total Price: ', total_price
    ) SEPARATOR '; ') FROM Product WHERE Product.doc_id = Doc.id
  ) AS products
FROM Doc
JOIN Company ON Doc.dealer_id = Company.id
JOIN User ON Doc.seller_id = User.id
JOIN Customer ON Doc.client_id = Customer.id
WHERE User.id = ? ;`;
        const docs = yield conn.query(query, [sellerId]);
        const allDocs = [];
        for (let i = 0; i < docs.length; i++) {
            const data = docs[i];
            const productsString = docs[i].products;
            const productsArray = productsString ? productsString.split("; ").map((product) => {
                const attributes = product.split(", ");
                const productObject = {};
                attributes.forEach((attribute) => {
                    const [key, value] = attribute.split(": ");
                    productObject[key.trim()] = value.trim();
                });
                return productObject;
            }) : [];
            allDocs.push(Object.assign(Object.assign({}, data), { productsArray }));
        }
        res.status(200).json({ docs: allDocs });
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.getDocsBySeller = getDocsBySeller;
