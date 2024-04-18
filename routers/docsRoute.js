"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const docsController_1 = require("../controllers/docsController");
const router = (0, express_1.default)();
router.get('/testDoc/:id', docsController_1.getSomeDoc);
router.post('/create-doc', docsController_1.createDoc);
router.put('/update-doc', docsController_1.updateDoc);
router.get('/get-docs', docsController_1.getAllDocs);
router.get('/get-a-doc/:id', docsController_1.getADoc);
router.delete('/del-doc/:id', docsController_1.deleteDoc);
router.get('/get-docs-by-user/:sellerId', docsController_1.getDocsBySeller);
exports.default = router;
