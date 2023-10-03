const { config } = require("dotenv");
config();
const dbConfig = {
  development: {
    dialect: "postgres",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
   
    port: process.env.DB_PORT,
  },
  test: {
    dialect: "postgres",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "database_test",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  },
  production: { 
    dialect: "postgres",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "database_production",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  },
};


module.exports = {
  ...dbConfig,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
