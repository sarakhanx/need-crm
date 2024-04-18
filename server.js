"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_config_1 = __importDefault(require("./libs/config/db.config"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const pdf_test_1 = __importDefault(require("./routers/pdf-test"));
const userRoutes_1 = __importDefault(require("./routers/userRoutes"));
const companyRoute_1 = __importDefault(require("./routers/companyRoute"));
const customerRoute_1 = __importDefault(require("./routers/customerRoute"));
const productRoute_1 = __importDefault(require("./routers/productRoute"));
const docsRoute_1 = __importDefault(require("./routers/docsRoute"));
const swagger_1 = __importDefault(require("./swagger"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json({type: 'application/json'}));
app.disable('etag');
const corsOption = {
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 200,
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)(corsOption));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.get("/", (req, res) => {
    res.json("Hi folks !");
});
app.use("/api", userRoutes_1.default, companyRoute_1.default, customerRoute_1.default, productRoute_1.default, docsRoute_1.default, pdf_test_1.default);
(0, db_config_1.default)()
    .then((pool) => {
    const port = parseInt(process.env.PORT || "3000", 10);
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
    (0, swagger_1.default)(app, port);
})
    .catch((err) => {
    console.error("Failed to establish database connection:", err.message);
    process.exit(1);
});
