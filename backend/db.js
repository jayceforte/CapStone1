const { Client } = require("pg");
require("dotenv").config();

function getClient(){
    return new Client ({
        connectionString: process.env.DATABASE_URL
    })
}
module.exports = getClient;