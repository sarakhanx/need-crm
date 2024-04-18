"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pdfController_1 = require("../controllers/pdfController");
const router = (0, express_1.Router)();
router.get('/genarate-pdf/:id', pdfController_1.docsControllerTest);
exports.default = router;
