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
exports.updateCustomer = exports.deleteUser = exports.getSingleUser = exports.getAllUser = exports.createCustomer = void 0;
const db_config_1 = __importDefault(require("../libs/config/db.config"));
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let conn;
    const pool = yield (0, db_config_1.default)();
    try {
        const { name, lastname, customer_address, customer_email, customer_mobile, company_address, company_contact, company_name, company_vat, } = req.body;
        conn = yield pool.getConnection();
        const sqlQuery = `INSERT INTO Customer(name, lastname, customer_address, customer_email, customer_mobile, company_address, company_contact, company_name, company_vat) VALUES(?,?,?,?,?,?,?,?,?)`;
        const result = yield conn.query(sqlQuery, [
            name,
            lastname,
            customer_address,
            customer_email,
            customer_mobile,
            company_address,
            company_contact,
            company_name,
            company_vat,
        ]);
        const data = {
            affectedRows: result.affectedRows,
            insertId: result.insertId,
            warningCount: result.warningCount,
            message: result.message,
        };
        // todo: back to make validation via email and mobile again
        if (!data) {
            return res
                .status(400)
                .json({ send: "some fields is blank or something went wrongs" });
        }
        console.log(req.body);
        res.status(200).json({
            send: "data inserted successfully",
            data: Object.assign(Object.assign({}, data), { insertId: String(data.insertId) }),
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ send: "Internal server error" });
    }
    finally {
        if (conn) {
            conn.release();
            console.log("Database connection released");
        }
    }
});
exports.createCustomer = createCustomer;
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let conn;
    const pool = yield (0, db_config_1.default)();
    try {
        conn = yield pool.getConnection();
        const users = yield conn.query("SELECT * FROM Customer");
        if (!users) {
            console.log("data not found");
            return res.status(404).json("user not found");
        }
        res.status(200).json({ data: users });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ send: "Internal server error" });
    }
    finally {
        if (conn) {
            conn.release();
            console.log("Database connection released");
        }
    }
});
exports.getAllUser = getAllUser;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.params.id;
    let conn;
    const pool = yield (0, db_config_1.default)();
    try {
        conn = yield pool.getConnection();
        const user = yield conn.query(`SELECT * FROM Customer WHERE id = ?`, [
            params,
        ]);
        if (!user.length) {
            console.log("user not found");
            return res.status(404).json({ send: "user not found" });
        }
        return res.status(200).json({ data: user });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ send: "Internal server error" });
    }
    finally {
        if (conn) {
            conn.release();
            console.log("Database connection released");
        }
    }
});
exports.getSingleUser = getSingleUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.params.id;
    let conn;
    const pool = yield (0, db_config_1.default)();
    try {
        conn = yield pool.getConnection();
        const sqlQuery = "DELETE FROM Customer WHERE id = ?";
        const result = yield conn.query(sqlQuery, [params]);
        if (!result) {
            console.log("Customer not found");
            return res.status(404).json({ send: "Customer not found" });
        }
        res.status(200).json({ send: "deleted successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ send: "Internal server error" });
    }
    finally {
        if (conn) {
            conn.release();
            console.log("Database connection released");
        }
    }
});
exports.deleteUser = deleteUser;
const updateCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.params.id;
    const { name, lastname, customer_address, customer_email, customer_mobile, company_address, company_contact, company_name, company_vat, } = req.body;
    let conn;
    const pool = yield (0, db_config_1.default)();
    try {
        conn = yield pool.getConnection();
        const isExistedCustomer = yield conn.query(`SELECT * FROM Customer WHERE id = ?`, [params]);
        if (!isExistedCustomer) {
            return res.status(400).json({ send: "user not found" });
        }
        const sqlQuery = `UPDATE Customer SET name = ?, lastname = ?, customer_address = ?, customer_email = ?, customer_mobile = ?, company_address = ?, company_contact = ?, company_name = ?, company_vat = ? WHERE id = ?`;
        const result = yield conn.query(sqlQuery, [
            name,
            lastname,
            customer_address,
            customer_email,
            customer_mobile,
            company_address,
            company_contact,
            company_name,
            company_vat,
            params,
        ]);
        if (!result) {
            return res.status(400).json({ send: "some fields is blank or something went wrongs" });
        }
        res.status(200).json({
            send: "data inserted successfully",
            data: Object.assign(Object.assign({}, result), { insertId: String(result.insertId) }),
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ send: "Internal server error" });
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
});
exports.updateCustomer = updateCustomer;
