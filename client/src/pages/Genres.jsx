import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import moment from "moment";

import axios from "axios";

// import "./Genres.css";

import Dropdown from "../components/Dropdown";
const Genres = () => {
  const { genre } = useParams("");

  // Стани
  const [comics, setComics] = useState([]);
  const [formattedGenre, setFormattedGenre] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedSortOrder, setSelectedSortOrder] = useState("");

  const formatGenreName = (genre) => {
    const formatted = genre
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    console.log("Formatted Genre in function:", formatted); // Додаємо вивід в консоль
    return formatted;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("genres", formattedGenre);

        if (selectedStatus) {
          queryParams.append("status", selectedStatus);
        }
        if (selectedType) {
          queryParams.append("type", selectedType);
        }
        if (selectedSortOrder) {
          queryParams.append("order", selectedSortOrder);
        }
        if (searchQuery) {
          queryParams.append("search", searchQuery);
        }
        const res = await axios.get(`/title?${queryParams}`);
        setComics(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [
    formattedGenre,
    searchQuery,
    selectedStatus,
    selectedType,
    selectedSortOrder,
  ]);

  useEffect(() => {
    const newFormattedGenre = formatGenreName(genre);
    setFormattedGenre(newFormattedGenre);
  }, [genre]);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await axios.get("/statuses");
        setStatuses(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStatuses();
  }, []);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await axios.get("/types");
        setTypes(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTypes();
  }, []);

  return (
    <div className="genre-page">
      <div className="genre-comic">
        <h3> {formattedGenre} Lists</h3>
      </div>
      <div className="search-titles">
        <input
          type="text"
          placeholder="Search titles"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        ></input>
      </div>
      <div className="filters">
        {/* <button>Status All</button> */}
        <Dropdown
          className="dropdown-button"
          title="Status All"
          items={statuses.map((status) => ({
            id: status.status_id,
            value: status.name,
          }))}
          onGenreSelect={(status) => setSelectedStatus(status)}
        />
        <Dropdown
          className="dropdown-button"
          title="Type All"
          items={types.map((type) => ({
            id: type.type_id,
            value: type.name,
          }))}
          onGenreSelect={(type) => setSelectedType(type)}
        />
        <Dropdown
          className="dropdown-button"
          title="Order by A-Z"
          items={[
            { id: 1, value: "A-Z" },
            { id: 2, value: "Update" },
            { id: 3, value: "Z-A" },
          ]}
          onGenreSelect={(order) => setSelectedSortOrder(order)}
        />

        {/* <button>Type All</button>
        <button>Order by A-Z</button> */}
      </div>
      <div className="result">
        {comics.map((comic) => (
          <div className="post" key={comic.comic_id}>
            <div className="img">
              <img src={`../upload/${comic.img}`} alt="comic image" />
            </div>
            <div className="content">
              <Link className="link" to={`/title/${comic.comic_id}`}>
                <h1>{comic.title}</h1>
              </Link>

              <p></p>
              <p>Created: {moment(comic.date).fromNow()}</p>
              {/* {getText(}</p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Genres;
