import mysql from "mysql";

// export const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "trawuchka123",
//   database: "comicdb",
// });

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "trawuchka123",
  database: "comicdb",
});
