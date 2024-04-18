"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Documents for CRMs app',
            description: `APIs endpoints for a CRMs app documented on Swagger`,
            contact: {
                name: 'Need CRMs app',
                email: 'need@need.co.th',
                url: 'https://crm.need.co.th/',
            },
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:5500/',
                description: 'Live server',
            },
        ],
    },
    apis: ['./routers/*.ts'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
function swaggerDocs(app, port) {
    // Swagger Page
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    // Documentation in JSON format
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
}
exports.default = swaggerDocs;
