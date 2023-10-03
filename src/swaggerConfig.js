const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "M3P-BACKEND-SQUAD1",
      version: "1.0.0",
      description: "API documentation for M3P-BACKEND-SQUAD1",
    },
    components: {
      securitySchemes: {
        Authentication: {
          type: "http",
          scheme : "bearer",
          bearerFormat: "JWT"
        },
      },
    },
  },
  apis: ["./routes/*.js"], // Path para as rotas da API
};
const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;

// Path: src/swaggerConfig.js
