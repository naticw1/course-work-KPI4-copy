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

  // Validation functions
  const [titleValid, setTitleValid] = useState(true);
  const [sourceUrlsValid, setSourceUrlsValid] = useState(true);
  const [photoValid, setPhotoValid] = useState(true);
  const [aliasesValid, setAliasesValid] = useState(true);
  const [genresValid, setGenresValid] = useState(true);
  const [synopsisValid, setSynopsisValid] = useState(true);

  // Validation functions
  const validateTitle = (title) => title.length >= 1 && title.length <= 50;
  const validateSourceUrls = (sourceUrls) =>
    sourceUrls.length >= 10 && sourceUrls.length <= 1000;
  const validatePhoto = (file) => !!file; // Ensure that a file is selected, additional file validation may be required
  const validateAliases = (aliases) =>
    aliases.length >= 1 && aliases.length <= 200;
  const validateGenres = (genres) => genres.length >= 4 && genres.length <= 200;
  const validateSynopsis = (synopsis) => synopsis.length <= 1000;

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

    const formValid =
      titleValid &&
      sourceUrlsValid &&
      photoValid &&
      aliasesValid &&
      genresValid &&
      synopsisValid;
    if (!formValid) {
      console.log("Form is invalid!");
      return;
    }

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
            // update_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), // Format the date as per your schema
            update_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            img: file ? imgUrl : "", // URL from the upload function
            genres: genres, // Directly using the genres from the state
            source_urls: source_urls, // Directly using the sources from the state
            aliases: aliases, // Directly using the aliases from the state
          });
      navigate("/");

      console.log(moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"));

      // Navigate to home or dashboard after the operation
    } catch (err) {
      console.log(err);
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setTitleValid(validateTitle(newTitle));
  };

  const handleSourceUrlsChange = (e) => {
    const newSourceUrls = e.target.value;
    setSources(newSourceUrls);
    setSourceUrlsValid(validateSourceUrls(newSourceUrls));
  };

  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    setFile(newFile);
    setPhotoValid(validatePhoto(newFile));
  };

  const handleAliasesChange = (e) => {
    const newAliases = e.target.value;
    setAliases(newAliases);
    setAliasesValid(validateAliases(newAliases));
  };

  const handleGenresChange = (e) => {
    const newGenres = e.target.value;
    setGenres(newGenres);
    setGenresValid(validateGenres(newGenres));
  };

  const handleSynopsisChange = (e) => {
    const newSynopsis = e.target.value;
    setSynopsis(newSynopsis);
    setSynopsisValid(validateSynopsis(newSynopsis));
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
                onChange={handleTitleChange}
                className={!titleValid ? "input-error" : ""}
              />
              {!titleValid && (
                <p className="error-message">
                  Title must be 1-50 characters long.
                </p>
              )}
            </label>

            <label className="input-file">
              Comic Image
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleFileChange}
                className={!photoValid ? "input-error" : ""}
              />
              {!photoValid && (
                <p className="error-message">Please upload a photo.</p>
              )}
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
                onChange={handleGenresChange}
                className={!genresValid ? "input-error" : ""}
              />
              {!genresValid && (
                <p className="error-message">
                  Genres must be 4-200 characters long.
                </p>
              )}
            </label>
          </div>
          <div className="form-column">
            <label>
              Sources
              <input
                type="text"
                name="sources"
                value={source_urls}
                onChange={handleSourceUrlsChange}
                className={!sourceUrlsValid ? "input-error" : ""}
              />
              {!sourceUrlsValid && (
                <p className="error-message">
                  Sources must be 10-1000 characters long.
                </p>
              )}
            </label>
            <label>
              Aliases
              <input
                type="text"
                name="aliases"
                value={aliases}
                onChange={handleAliasesChange}
                className={!aliasesValid ? "input-error" : ""}
              />
              {!aliasesValid && (
                <p className="error-message">
                  Aliases must be 1-200 characters long.
                </p>
              )}
            </label>
            <label>
              Synopsis
              <textarea
                name="synopsis"
                value={synopsis}
                onChange={handleSynopsisChange}
                className={!synopsisValid ? "input-error" : ""}
              />
              {!synopsisValid && (
                <p className="error-message">
                  Synopsis can't be more than 1000 characters long.
                </p>
              )}
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
