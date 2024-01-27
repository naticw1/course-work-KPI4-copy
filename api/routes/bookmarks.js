import express from "express";
import {
  getBookmarks,
  addBookmark,
  deleteBookmark,
} from "../controllers/bookmark.js";

const router = express.Router();

router.get("/:user_id", getBookmarks); // Додаємо параметр шляху `user_id` для отримання закладок певного користувача
router.post("/:user_id", addBookmark);

router.delete("/:user_id", deleteBookmark);

export default router;
