const mysql = require("mysql2");

exports.getMySQLConnection = async () => {
  const host = process.env.HOSTNAME;
  const user = process.env.USER;
  const password = process.env.PASSWORD;
  const port = process.env.PORT;
  const database = process.env.DATABASE;
  //console.log("process.env.user " + process.env.DATABASE);

  if (
    port == null ||
    port == "" ||
    port == undefined ||
    host == null ||
    host == "" ||
    host == undefined ||
    user == null ||
    user == "" ||
    user == undefined ||
    password == null ||
    password == "" ||
    password == undefined
  ) {
    console.log("Please provide database connection details.");
    return;
  }

  return mysql.createConnection({
    host: host,
    user: user,
    password: password,
    port: port,
    database: database,
  });
};
