// dependencias
const express = require("express");
const cors = require("cors");
const {config} = require("dotenv");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');config();

// classe server
class Server {
  // constructor de classe
  constructor(app = express()) {
    this.app = app;
    this.middlewares(this.app);
    this.routes(this.app);
    this.database();
    this.initializeServer(this.app);
  }
  //get app
  getApp() {
    return this.app;
  }
  // middlewares
  async middlewares(app) { 
    app.use(cors());
    app.use(express.json());
  }
  // connect database
  async database() {
    const connection = require("./database/connection");
    try {
      await connection.authenticate();
      console.log("Conexão com o banco de dados estabelecida com sucesso!");
    } catch (error) {
      console.error("Não foi possível conectar com o banco de dados:", error.message);
    }
  }
  // routes
  async routes(app) {
    const appRoutes = require("./routes");
    app.use(appRoutes);
    app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }
  // start server
  async initializeServer(app) {
    const PORT = process.env.PORT_NODE || 3000;
    const HOST = process.env.HOST_NODE || "localhost";
    app.listen(PORT, () => console.log(`Servidor executando http://${HOST}:${PORT}`));
  }

}

module.exports = { Server };

