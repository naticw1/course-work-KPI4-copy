import { db } from "../db.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  let genres = [];
  if (req.query.genres) {
    genres = req.query.genres.split(",").map((g) => g.trim());
  }

  let status = req.query.status;
  let type = req.query.type;
  let order = req.query.order;
  let search = req.query.search;

  let q = `SELECT c.comic_id, c.title, c.synopsis, c.status_id, c.type_id, c.update_date, c.img FROM comics c`;
  let whereAdded = false;

  if (status || type || search) {
    q += " WHERE ";
    if (status) {
      q += "c.status_id=(SELECT status_id FROM statuses WHERE name=?)";
      whereAdded = true;
    }
    if (type) {
      if (whereAdded) q += " AND ";
      q += "c.type_id=(SELECT type_id FROM types WHERE name=?)";
      whereAdded = true;
    }
    if (search) {
      if (whereAdded) q += " AND ";
      q += "c.title LIKE ?";
      whereAdded = true;
    }
  }

  genres.forEach((genre, index) => {
    if (index === 0 && !whereAdded) q += " WHERE ";
    else q += " AND ";

    q += `c.comic_id IN (SELECT comic_id FROM comicsgenres WHERE genre_id=(SELECT genre_id FROM genres WHERE name=?))`;
  });

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
      default:
        break;
    }
  }

  const params = [];
  if (status) params.push(status);
  if (type) params.push(type);
  if (search) params.push(`%${search}%`);
  const queryParams = params.concat(genres);

  db.query(q, queryParams, (err, data) => {
    if (err) {
      console.error("Error during DB query:", err);
      return res.status(500).json(err);
    }
    return res.status(200).json(data);
  });
};

export const getPost = (req, res) => {
  const q = `
  SELECT 
      c.comic_id, 
      c.title,
      c.aliases,
      c.synopsis, 
      c.update_date, 
      c.img,
      s.name AS status,
      t.name AS type,
      GROUP_CONCAT(DISTINCT g.name ORDER BY g.name SEPARATOR ', ') AS genres,
      GROUP_CONCAT(DISTINCT cs.source_url ORDER BY cs.source_id SEPARATOR ', ') AS source_urls
  FROM 
      comics c
  LEFT JOIN 
      statuses s ON c.status_id = s.status_id
  LEFT JOIN 
      types t ON c.type_id = t.type_id
  LEFT JOIN 
      comicsgenres cg ON c.comic_id = cg.comic_id
  LEFT JOIN 
      genres g ON cg.genre_id = g.genre_id
  LEFT JOIN 
      comicsources cs ON c.comic_id = cs.comic_id
  WHERE 
      c.comic_id = ?
  GROUP BY 
      c.comic_id,
      c.title, 
      c.synopsis, 
      c.update_date, 
      c.img, 
      s.name,
      t.name
      `;

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]);
  });
};
export const addPost = (req, res) => {
  const token = req.cookies.access_token;
  // if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const getStatusId = new Promise((resolve, reject) => {
      db.query(
        "SELECT status_id FROM statuses WHERE name = ?",
        [req.body.status],
        (err, data) => {
          if (err) {
            console.log("Error fetching status_id:", err);
            reject(err);
          } else {
            resolve(data[0].status_id);
          }
        }
      );
    });

    const getTypeId = new Promise((resolve, reject) => {
      db.query(
        "SELECT type_id FROM types WHERE name = ?",
        [req.body.type],
        (err, data) => {
          if (err) {
            console.log("Error fetching type_id:", err);
            reject(err);
          } else {
            resolve(data[0].type_id);
          }
        }
      );
    });

    Promise.all([getStatusId, getTypeId])
      .then((values) => {
        const [statusId, typeId] = values;

        // Step 2: Insert into Comics Table with correct Status ID and Type ID
        const q = `
          INSERT INTO comics (title, synopsis, status_id, type_id, update_date, img, aliases)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const insertValues = [
          req.body.title,
          req.body.synopsis,
          statusId,
          typeId,
          req.body.update_date,
          req.body.img,
          req.body.aliases,
        ];

        db.query(q, insertValues, (err, data) => {
          if (err) {
            console.log("Error inserting comic:", err);
            return res.status(500).json(err);
          }

          const comicId = data.insertId;

          if (req.body.genres) {
            const genres = req.body.genres.split(", "); // Assuming genres are provided as a comma-separated string
            genres.forEach((genre) => {
              const qGenre = `
                INSERT INTO comicsgenres (comic_id, genre_id)
                SELECT ?, genre_id FROM genres WHERE name = ?
              `;
              db.query(qGenre, [comicId, genre], (err, data) => {
                if (err) return res.status(500).json(err);
              });
            });
          }

          // Step 4: Insert into ComicSources Table
          if (req.body.source_urls) {
            const sources = req.body.source_urls.split(", "); // Assuming sources are provided as a comma-separated string
            sources.forEach((source) => {
              const qSource = `
                INSERT INTO comicsources (comic_id, source_url, description)
                VALUES (?, ?, 'Link')
              `;
              db.query(qSource, [comicId, source], (err, data) => {
                if (err) return res.status(500).json(err);
              });
            });
          }

          return res.json("Comic has been created.");
        });
      })
      .catch((err) => {
        console.log("Error in Promise.all:", err);
        return res.status(500).json(err);
      });
  });
};

// export const deletePost = (req, res) => {
//   const token = req.cookies.access_token;
//   if (!token) return res.status(401).json("Not authenticated!");

//   jwt.verify(token, "jwtkey", (err, userInfo) => {
//     if (err) return res.status(403).json("Token is not valid!");

//     console.log(req.params.id);

//     const comicId = req.params.id;

//     console.log(comicId);
//     const q = "DELETE FROM comics WHERE `comic_id` = ?";

//     // db.query(q, [comicId, userInfo.id], (err, data) => {
//     //   if (err) return res.status(403).json("You can delete only your post!");

//     //   return res.json("Post has been deleted!");
//     // });
//     db.query(q, [comicId], (err, data) => {
//       console.log(data);

//       if (err) return res.status(500).json(err);
//       // if (data.affectedRows === 0) {
//       //   return res.status(404).json("Post not found!");
//       // }
//       return res.json("Post has been deleted!");
//     });
//   });
// };

export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json("Not authenticated!");
  }

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const comicId = req.params.id;

    // Get a connection from the pool
    db.getConnection((error, connection) => {
      if (error) {
        console.error("Error getting connection from pool:", error);
        return res.status(500).json("Internal server error");
      }

      // Begin a new transaction
      connection.beginTransaction((err) => {
        if (err) {
          console.error("Error starting transaction:", err);
          connection.release();
          return res.status(500).json("Internal server error");
        }

        const queries = [
          "DELETE FROM Comicsgenres WHERE comic_id = ?",
          "DELETE FROM UserLibrary WHERE comic_id = ?",
          "DELETE FROM comicsources WHERE comic_id = ?",
          "DELETE FROM comics WHERE comic_id = ?",
        ];

        // Helper function to perform a query in a transaction
        const performQuery = (query, callback) => {
          connection.query(query, [comicId], (err, result) => {
            if (err) {
              console.error("Error during deletion:", err);
              return connection.rollback(() => {
                connection.release();
                res.status(500).json("Internal server error");
              });
            }
            callback(result);
          });
        };

        // Execute each query in sequence
        performQuery(queries[0], () => {
          performQuery(queries[1], () => {
            performQuery(queries[2], () => {
              performQuery(queries[3], (result) => {
                if (result.affectedRows === 0) {
                  console.error("Comic not found");
                  return connection.rollback(() => {
                    connection.release();
                    res.status(404).json("Comic not found");
                  });
                }

                // If everything is successful, commit the transaction
                connection.commit((err) => {
                  if (err) {
                    console.error("Error committing transaction:", err);
                    return connection.rollback(() => {
                      connection.release();
                      res.status(500).json("Internal server error");
                    });
                  }
                  console.log(
                    "Successfully deleted the comic and all related records"
                  );
                  connection.release();
                  res
                    .status(200)
                    .json("Comic and all related records deleted successfully");
                });
              });
            });
          });
        });
      });
    });
  });
};

export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Assuming you are passing the comic_id as a URL parameter
    const comicId = req.params.id;

    // Input validation (make sure to adapt it to your needs)
    if (!req.body.title || !req.body.synopsis) {
      return res.status(400).json("Required fields are missing!");
    }

    // Update the comic
    const q = `
      UPDATE comics
      SET
        title = ?,
        synopsis = ?,
        status_id = (SELECT status_id FROM statuses WHERE name = ?),
        type_id = (SELECT type_id FROM types WHERE name = ?),
        update_date = ?,
        img = ?,
        aliases = ?
      WHERE
        comic_id = ?
    `;

    const updateValues = [
      req.body.title,
      req.body.synopsis,
      req.body.status,
      req.body.type,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      req.body.img,
      req.body.aliases,
    ];

    db.query(q, [...updateValues, comicId], (err, data) => {
      if (err) {
        console.error("Error updating comic:", err);
        return res.status(500).json(err);
      }

      if (data.affectedRows === 0) {
        return res.status(404).json("Comic not found!");
      }

      // Handle genres and source URLs update
      handleGenresUpdate(comicId, req.body.genres, (err) => {
        if (err) return res.status(500).json(err);

        handleSourcesUpdate(comicId, req.body.source_urls, (err) => {
          if (err) return res.status(500).json(err);

          return res.status(200).json("Comic updated successfully");
        });
      });
    });
  });
};

function handleGenresUpdate(comicId, genresStr, callback) {
  const deleteGenres = `DELETE FROM comicsgenres WHERE comic_id = ?`;
  db.query(deleteGenres, [comicId], (err, data) => {
    if (err) return callback(err);

    if (genresStr) {
      const genres = genresStr.split(", ");
      const insertPromises = genres.map((genre) => {
        return new Promise((resolve, reject) => {
          const qGenre = `
            INSERT INTO comicsgenres (comic_id, genre_id)
            SELECT ?, genre_id FROM genres WHERE name = ?
          `;
          db.query(qGenre, [comicId, genre], (err, data) => {
            if (err) reject(err);
            else resolve();
          });
        });
      });

      Promise.all(insertPromises)
        .then(() => callback(null))
        .catch(callback);
    } else {
      callback(null); // No genres to update
    }
  });
}

function handleSourcesUpdate(comicId, sourcesStr, callback) {
  const deleteSources = `DELETE FROM comicsources WHERE comic_id = ?`;
  db.query(deleteSources, [comicId], (err, data) => {
    if (err) return callback(err);

    if (sourcesStr) {
      const sources = sourcesStr.split(", ");
      const insertPromises = sources.map((source) => {
        return new Promise((resolve, reject) => {
          const qSource = `
            INSERT INTO comicsources (comic_id, source_url, description)
            VALUES (?, ?, 'Link')
          `;
          db.query(qSource, [comicId, source], (err, data) => {
            if (err) reject(err);
            else resolve();
          });
        });
      });

      Promise.all(insertPromises)
        .then(() => callback(null))
        .catch(callback);
    } else {
      callback(null); // No sources to update
    }
  });
}
