import express from "express";

import { getUserComics } from "../controllers/user.js";

const router = express.Router();

router.get("/user/comics", getUserComics);

export default router;
