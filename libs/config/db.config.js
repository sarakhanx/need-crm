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
// ./libs/config/db.config.ts
const mariadb_1 = __importDefault(require("mariadb"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let pool = undefined;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const createDatabasePool = () => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof pool !== "undefined") {
        return pool;
    }
    pool = mariadb_1.default.createPool({
        connectionLimit: 5,
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
    });
    try {
        const connection = yield pool.getConnection();
        connection.release();
        console.log("Database connected successfully");
    }
    catch (err) {
        console.error("Error connecting to the database:", err.message);
    }
    return pool;
});
exports.default = createDatabasePool;
