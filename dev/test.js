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
exports.fetchDataFromMariaDB = void 0;
const db_config_1 = __importDefault(require("../libs/config/db.config"));
const puppeteer_1 = __importDefault(require("puppeteer"));
function fetchDataFromMariaDB() {
    return __awaiter(this, void 0, void 0, function* () {
        // Launch Puppeteer and create a new page
        const browser = yield puppeteer_1.default.launch();
        const page = yield browser.newPage();
        let conn;
        const pool = yield (0, db_config_1.default)();
        try {
            conn = yield pool.getConnection();
            const query = `
      SELECT
        Doc.createdAt,
        User.name, User.lastname, User.roles,
        Company.company_name, Company.company_address, Company.company_contact, Company.company_vat_id,
        Customer.name AS customer_name, Customer.lastname AS customer_lastname, Customer.customer_address, Customer.customer_mobile,
        (
          SELECT GROUP_CONCAT(
            CONCAT(
              'Title: ', title, ', ',
              'Size: ', size, ', ',
              'Qty: ', qty, ', ',
              'Price: ', price, ', ',
              'Discount: ', discount, ', ',
              'Total Price: ', total_price
            ) SEPARATOR '; '
          ) FROM Product WHERE Product.doc_id = Doc.id
        ) AS products
      FROM Doc
      JOIN Company ON Doc.dealer_id = Company.id
      JOIN User ON Doc.seller_id = User.id
      JOIN Customer ON Doc.client_id = Customer.id
      WHERE Doc.id = 2;
    `;
            const result = yield new Promise((resolve, reject) => {
                pool.query(query, (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(results);
                    }
                });
            });
            console.log('Query results:', result);
            // Close database connection
            pool.end();
            // Close Puppeteer browser
            yield browser.close();
        }
        catch (error) {
            console.error('Error:', error);
            // Close Puppeteer browser in case of error
            yield browser.close();
        }
    });
}
exports.fetchDataFromMariaDB = fetchDataFromMariaDB;
fetchDataFromMariaDB();
