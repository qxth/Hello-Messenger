import mysql from "mysql";

const conn = mysql.createPool({
  user: "root",
  host: "localhost",
  database: "ChatApp",
  charset: "utf8mb4_unicode_ci",
});

const query = (sql, parametros) => {
  return new Promise((resolve, reject) => {
    conn.query(sql, parametros, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

export { query };
