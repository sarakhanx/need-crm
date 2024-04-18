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
Object.defineProperty(exports, "__esModule", { value: true });
exports.docsControllerTest = void 0;
const puppeteer_config_1 = require("../libs/puppeteer/puppeteer.config");
const docsControllerTest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.params.id;
    try {
        const pdfBuffer = yield (0, puppeteer_config_1.generatePDF)(params);
        res.contentType('application/pdf');
        res.send(pdfBuffer);
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.docsControllerTest = docsControllerTest;
