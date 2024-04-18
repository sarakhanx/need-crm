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
exports.getSingleUser = exports.deleteUser = exports.getAllUsers = exports.signIn = exports.isExistedUser = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const db_config_1 = __importDefault(require("../libs/config/db.config"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const jwtToken = process.env.JWT_SECRET;
const isExistedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email, telephone, address, name, lastname } = req.body;
    let conn;
    const pool = yield (0, db_config_1.default)();
    try {
        conn = yield pool.getConnection();
        const isUserExisted = yield conn.query(`SELECT * FROM User WHERE email = ?`, [email]);
        if (isUserExisted.length > 0) {
            return res.status(409).json({
                message: "User already existed",
            });
        }
        else {
            const defaultRole = "seller";
            const roles = req.body.roles || defaultRole;
            const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
            const sqlQuery = "INSERT INTO User(username, password, email, telephone, address , name , lastname , roles) VALUES(?,?,?,?,?,?,?,?)";
            yield pool.query(sqlQuery, [
                username,
                hashedPassword,
                email,
                telephone,
                address,
                name,
                lastname,
                roles
            ]);
            return res.status(201).json({
                message: "User created successfully",
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
    finally {
        if (conn) {
            conn.end();
        }
    }
});
exports.isExistedUser = isExistedUser;
const signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    let conn;
    const pool = yield (0, db_config_1.default)();
    try {
        conn = yield pool.getConnection();
        const user = yield conn.query("SELECT * FROM User WHERE username = ?", [
            username,
        ]);
        if (user.length === 0) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        const isValidPassword = yield bcryptjs_1.default.compare(password, user[0].password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        // Generate a JWT
        const token = jsonwebtoken_1.default.sign({ userId: user[0].id, username: user[0].username }, 
        // Replace with your secure secret
        process.env.JWT_SECRET || `${jwtToken}`, { expiresIn: "1d" });
        const userData = {
            id: user[0].id,
            username: user[0].username,
            name: user[0].name,
            lastname: user[0].lastname,
        };
        res.json({ message: "Login successful", token, userData });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
});
exports.signIn = signIn;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let conn;
    const pool = yield (0, db_config_1.default)();
    try {
        conn = yield pool.getConnection();
        const users = yield conn.query("SELECT * FROM User");
        const numberToString = users.map((user) => {
            return Object.assign(Object.assign({}, user), { telephone: user.telephone.toString() });
        });
        res.status(200).json({ users: numberToString });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error eh" });
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
});
exports.getAllUsers = getAllUsers;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let conn;
    const pool = yield (0, db_config_1.default)();
    try {
        conn = yield pool.getConnection();
        const sqlQuery = "DELETE FROM User WHERE id = ?";
        yield conn.query(sqlQuery, [id]);
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
});
exports.deleteUser = deleteUser;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.params.id;
    let conn;
    const pool = yield (0, db_config_1.default)();
    try {
        conn = yield pool.getConnection();
        const sqlQuery = "SELECT * FROM User WHERE id = ?";
        const data = yield conn.query(sqlQuery, [params]);
        const dataString = data.map((user) => {
            return Object.assign(Object.assign({}, user), { telephone: user.telephone.toString() });
        });
        if (!sqlQuery.length) {
            return res.status(404).json({ send: "user not found" });
        }
        res.status(200).json({ user: dataString });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ send: "user not found" });
    }
});
exports.getSingleUser = getSingleUser;
