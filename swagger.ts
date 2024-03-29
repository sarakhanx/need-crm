import { Express, RequestHandler } from 'express'; // Import specific types
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

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

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {
  // Swagger Page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Documentation in JSON format
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

export default swaggerDocs;
