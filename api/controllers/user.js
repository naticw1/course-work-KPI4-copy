import jwt from "jsonwebtoken";

import { db } from "../db.js";

// api/controllers/user.js (або де ви зберігаєте свої controllers)
export const getUserComics = (req, res) => {
  let userId = req.query.user_id;
  let search = req.query.search;
  let genre = req.query.genres;

  let status = req.query.status;
  let type = req.query.type;
  let order = req.query.order;

  let q = `
      SELECT c.comic_id, c.title, c.synopsis, c.status_id, c.type_id, c.update_date, c.img
      FROM comics c
      JOIN userlibrary ul ON c.comic_id = ul.comic_id
      WHERE ul.user_id = ?
    `;

  const queryParams = [userId];

  if (search) {
    q += " AND c.title LIKE ?";
    queryParams.push(`%${search}%`);
  }

  if (genre) {
    q +=
      " AND EXISTS (SELECT * FROM comicsgenres cg JOIN genres g ON cg.genre_id = g.genre_id WHERE cg.comic_id = c.comic_id AND g.name = ?)";
    queryParams.push(genre);
  }

  if (status) {
    q +=
      " AND EXISTS (SELECT * FROM statuses s WHERE s.status_id = c.status_id AND s.name = ?)";
    queryParams.push(status);
  }

  if (type) {
    q +=
      " AND EXISTS (SELECT * FROM types t WHERE t.type_id = c.type_id AND t.name = ?)";
    queryParams.push(type);
  }

  if (order) {
    switch (order) {
      case "A-Z":
        q += " ORDER BY c.title ASC";
        break;
      case "Z-A":
        q += " ORDER BY c.title DESC";
        break;
      case "Update":
        q += " ORDER BY c.update_date DESC";
        break;
    }
  }

  db.query(q, queryParams, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json(data);
  });
};
