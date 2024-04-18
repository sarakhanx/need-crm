"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const companyController_1 = require("../controllers/companyController");
const router = express_1.default.Router();
router.get('/companies', companyController_1.getAllCompanies);
router.post('/createcompanies', companyController_1.createCompany);
router.put('/updatecompanies/:id', companyController_1.updateCompany);
router.delete('/deletecompanies/:id', companyController_1.deleteCompany);
router.get('/company/:id', companyController_1.getACompany);
exports.default = router;
