import React, { useState } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

import "./AddComic.css";

const AddComic = () => {
  const state = useLocation().state;
  const [title, setTitle] = useState(state?.title || "");
  const [synopsis, setSynopsis] = useState(state?.synopsis || "");
  const [status, setStatus] = useState(state?.status || ""); // Assuming state has status_id
  const [type, setType] = useState(state?.type || ""); // Assuming state has type_id

  const [file, setFile] = useState(null);
  const [aliases, setAliases] = useState(state?.aliases || "");
  const [genres, setGenres] = useState(state?.genres || ""); // Assuming genres is a string; adjust if it's an array
  const [source_urls, setSources] = useState(state?.source_urls || ""); // Assuming sources is a string; adjust if it's an array

  const navigate = useNavigate();

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/upload", formData);
      console.log(res.data);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const imgUrl = await upload(); // Ensure this function handles the image upload and returns the URL

    console.log(imgUrl);

    if (!imgUrl) {
      console.log("File upload failed");
      return;
    }

    // Prepare the data object for submission

    try {
      state
        ? await axios.put(`/title/${state.comic_id}`, {
            title: title,
            synopsis: synopsis,
            status: status, // You need a mechanism in your form to select or input the status_id
            type: type, // You need a mechanism in your form to select or input the type_id
            // update_date: , // Format the date as per your schema
            img: file ? imgUrl : "", // URL from the upload function
            genres: genres, // Directly using the genres from the state
            source_urls: source_urls, // Directly using the sources from the state
            aliases: aliases, // Directly using the aliases from the state
          })
        : await axios.post(`/title/`, {
            title: title,
            synopsis: synopsis,
            status: status, // You need a mechanism in your form to select or input the status_id
            type: type, // You need a mechanism in your form to select or input the type_id
            update_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), // Format the date as per your schema
            img: file ? imgUrl : "", // URL from the upload function
            genres: genres, // Directly using the genres from the state
            source_urls: source_urls, // Directly using the sources from the state
            aliases: aliases, // Directly using the aliases from the state
          });
      navigate("/");

      // Navigate to home or dashboard after the operation
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="add-comic-container">
      <form>
        <div className="form-row">
          <div className="form-column">
            <label>
              Comic Title
              <input
                type="text"
                value={title}
                name="title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label className="input-file">
              Comic Image
              <input
                type="file"
                id="file"
                name="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>

            <label>
              Status
              <input
                type="text"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
            </label>

            <label>
              Type
              <input
                type="text"
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </label>
            <label>
              Genres
              <input
                type="text"
                name="genres"
                value={genres}
                onChange={(e) => setGenres(e.target.value)}
              />
            </label>
          </div>
          <div className="form-column">
            <label>
              Sources
              <input
                type="text"
                name="sources"
                value={source_urls}
                onChange={(e) => setSources(e.target.value)}
              />
            </label>
            <label>
              Aliases
              <input
                type="text"
                name="aliases"
                value={aliases}
                onChange={(e) => setAliases(e.target.value)}
              />
            </label>
            <label>
              Synopsis
              <textarea
                name="synopsis"
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
              />
            </label>
          </div>
        </div>
        <button onClick={handleClick}>Save</button>
        {}
      </form>
    </div>
  );
};

export default AddComic;
