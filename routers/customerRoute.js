"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customerController_1 = require("../controllers/customerController");
const router = express_1.default.Router();
router.post('/add-customer', customerController_1.createCustomer);
router.get('/get-customers', customerController_1.getAllUser);
router.get('/get-customer/:id', customerController_1.getSingleUser);
router.delete('/delete-customer/:id', customerController_1.deleteUser);
router.put('/update-customer/:id', customerController_1.updateCustomer);
exports.default = router;
