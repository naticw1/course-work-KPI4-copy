import express from "express";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import comicRoutes from "./routes/comics.js";
import bookmarkRoutes from "./routes/bookmarks.js";
import statusRoutes from "./routes/statuses.js";
import typesRoutes from "./routes/types.js";
import cors from "cors";
import { db } from "./db.js";
import cookieParser from "cookie-parser";

import multer from "multer";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/title", comicRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/statuses", statusRoutes);
app.use("/api/types", typesRoutes);

// app.get("/test", (req, res) => {
//   res.json("It works");
// });

// app.get("/test", (req, res) => {
//   const q = "SELECT * FROM users";
//   db.query(q, (err, data) => {
//     if (err) return res.json(err);
//     return res.json(data);
//   });
// });

app.listen(8800, () => {
  console.log("Connected");
});
