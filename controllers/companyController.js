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
exports.getACompany = exports.deleteCompany = exports.updateCompany = exports.createCompany = exports.getAllCompanies = void 0;
const db_config_1 = __importDefault(require("../libs/config/db.config"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("../libs/multer/config");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const getAllCompanies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let conn;
    const pool = yield (0, db_config_1.default)();
    try {
        conn = yield pool.getConnection();
        const sqlQuery = "SELECT * FROM Company";
        const result = yield conn.query(sqlQuery);
        const companies = [];
        for (const data of result) {
            const imgPath = path_1.default.join(__dirname, `../uploads/company_assets/${data.logo}`);
            if (fs_1.default.existsSync(imgPath)) {
                const imgUrl = `/uploads/company_assets/${data.logo}`;
                companies.push(Object.assign(Object.assign({}, data), { imgUrl }));
            }
            else {
                res.status(400).json({ send: "logo or data fields not found" });
            }
        }
        res.status(200).json({ data: companies });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
    finally {
        if (conn) {
            conn.release();
            console.log("Database connection released");
        }
    }
});
exports.getAllCompanies = getAllCompanies;
const createCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    config_1.uploadLogo.single("file")(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return res
                .status(500)
                .json({ send: "error while uploading logo, Please try again later" });
        }
        const file = req.file;
        const logoName = file === null || file === void 0 ? void 0 : file.filename;
        if (!req.file) {
            console.log("no file was found in Upload..., Please try again");
            return res
                .status(400)
                .json({ send: "not found file attached, Please try again" });
        }
        const { company_name, company_address, company_vat_id, company_contact } = req.body;
        let conn;
        const pool = yield (0, db_config_1.default)();
        try {
            conn = yield pool.getConnection();
            const sqlQuery = "INSERT INTO Company(logo , company_name , company_address , company_vat_id , company_contact) VALUES(? , ? , ? , ? , ?)";
            pool.query(sqlQuery, [
                logoName,
                company_name,
                company_address,
                company_vat_id,
                company_contact,
            ]);
            res.status(201).json({
                message: "Company created successfully",
                data: {
                    companyLogo: logoName,
                    companyName: company_name,
                    companyAddress: company_address,
                    companyVatId: company_vat_id,
                    companyContact: company_contact,
                },
            });
        }
        catch (error) {
            console.log("error in creating company", error);
            next(error);
        }
        finally {
            if (conn) {
                conn.release();
            }
        }
    }));
});
exports.createCompany = createCompany;
const updateCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.params.id;
    const { company_name, company_address, company_vat_id, company_contact } = req.body;
    let conn;
    const pool = yield (0, db_config_1.default)();
    try {
        conn = yield pool.getConnection();
        const isExisted = yield conn.query(`SELECT * FROM Company WHERE id = ?`, [
            params,
        ]);
        if (!isExisted) {
            return res.status(400).json({ send: "data not found" });
        }
        const sqlQuery = "UPDATE Company SET company_name = ? , company_address = ? , company_vat_id = ? , company_contact = ? WHERE id = ?";
        yield conn.query(sqlQuery, [
            company_name,
            company_address,
            company_vat_id,
            company_contact,
            params,
        ]);
        res.status(200).json({ send: "data updated successfully", data: req.body });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ send: "Internal server error" });
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
});
exports.updateCompany = updateCompany;
const deleteCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.params.id;
    let conn;
    const pool = yield (0, db_config_1.default)();
    try {
        conn = yield pool.getConnection();
        const isExisted = yield conn.query(`SELECT * FROM Company WHERE id = ?`, [params]);
        if (!isExisted.length) {
            return res.status(400).json({ send: "data not found" });
        }
        const imagePath = path_1.default.join(__dirname, `../uploads/company_assets/${isExisted[0].logo}`);
        if (fs_1.default.existsSync(imagePath)) {
            fs_1.default.unlinkSync(imagePath);
        }
        const sqlQuery = "DELETE FROM Company WHERE id = ?";
        conn.query(sqlQuery, [params]);
        res.status(200).json({ send: "data deleted successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ send: "Internal server error" });
    }
});
exports.deleteCompany = deleteCompany;
const getACompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.params.id;
    let conn;
    const pool = yield (0, db_config_1.default)();
    try {
        conn = yield pool.getConnection();
        const isExistedCompany = yield conn.query(`SELECT * FROM Company WHERE id = ?`, [params]);
        if (!isExistedCompany) {
            return res.status(400).json({ send: "data not found" });
        }
        res.status(200).json({ data: isExistedCompany });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ send: "Internal server error" });
    }
});
exports.getACompany = getACompany;
