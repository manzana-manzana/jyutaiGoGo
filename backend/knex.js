require("dotenv").config({ path: "./.env" });

const knex = require("knex");
const knexConfig = require("./knexfile.js");

module.exports = knex(knexConfig[process.env.NODE_ENV]);
// Hello world!
console.log("Hello world");