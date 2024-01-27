import { getTypes } from "../controllers/type.js";
import express from "express";

const router = express.Router();

router.get("/", getTypes);

export default router;
