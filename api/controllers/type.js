import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getTypes = (req, res) => {
  let q;
  if (req.query.type) {
    q =
      "SELECT * FROM comics WHERE type_id=(SELECT type_id FROM types WHERE name=?)";
  } else {
    q = "SELECT * FROM types";
  }

  db.query(q, [req.query.type], (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json(data);
  });
};
