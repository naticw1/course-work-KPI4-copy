import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getBookmarks = (req, res) => {
  const q = "SELECT comic_id FROM userlibrary WHERE user_id = ?";

  db.query(q, [req.params.user_id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((item) => item.comic_id));
  });
};

export const addBookmark = (req, res) => {
  const token = req.cookies.accessToken;
  // Розкоментуйте наступні рядки, якщо потрібна автентифікація
  // if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    // if (err) return res.status(403).json("Token is not valid!");
    const userId = req.params.user_id;
    const { comicId } = req.body;
    const q = "INSERT INTO userlibrary (user_id, comic_id) VALUES (?, ?)";
    db.query(q, [userId, comicId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Comic has been added to bookmarks.");
    });
  });
};

export const deleteBookmark = (req, res) => {
  const token = req.cookies.accessToken;

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    const userId = req.params.user_id; // отримуємо user_id з параметрів URL
    const { comicId } = req.body; // отримуємо comicId з тіла запиту

    // Використовуємо userId та comicId для видалення закладки
    const q = "DELETE FROM userlibrary WHERE user_id = ? AND comic_id = ?";

    db.query(q, [userId, comicId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Comic has been removed from bookmarks.");
    });
  });
};
