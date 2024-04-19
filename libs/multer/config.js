"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadLogo = void 0;
const multer_1 = __importDefault(require("multer"));
const companyLogoUpload = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/company_assets');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
exports.uploadLogo = (0, multer_1.default)({ storage: companyLogoUpload });
