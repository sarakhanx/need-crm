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
exports.generatePDF = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
function generatePDF(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = path_1.default.join(__dirname, "../../uploads/pdf", `docs-no-${params}-${Date.now()}.pdf`);
        try {
            console.log("Launching browser...");
            const browser = yield puppeteer_1.default.launch();
            console.log("Browser launched successfully.");
            console.log("Opening new page...");
            const page = yield browser.newPage();
            console.log("New page opened successfully.");
            const website = `${process.env.PDF_URL}/${params}`;
            console.log("Navigating to:", website);
            yield page.goto(website, { waitUntil: "networkidle0" });
            console.log("Page navigation complete.");
            console.log("Generating PDF...");
            const pdf = yield page.pdf({
                path: filePath,
                margin: { top: '10px', right: '5px', bottom: '10px', left: '5px' },
                printBackground: true,
                format: 'A4',
            });
            console.log("PDF generated successfully.");
            yield browser.close();
            console.log("Browser closed.");
            return pdf;
        }
        catch (error) {
            console.error("An error occurred:", error);
            throw error;
        }
    });
}
exports.generatePDF = generatePDF;
