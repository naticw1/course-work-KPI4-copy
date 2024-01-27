import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getStatuses = (req, res) => {
  let q;
  if (req.query.status) {
    q = `
        SELECT c.* 
        FROM comics c
        JOIN statuses s ON c.status_id = s.status_id
        WHERE s.name = ?
      `;
  } else {
    q = "SELECT * FROM statuses";
  }

  db.query(q, [req.query.status], (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json(data);
  });
};
