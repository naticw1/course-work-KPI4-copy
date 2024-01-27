import React from "react";

import { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment";

import Dropdown from "../components/Dropdown";

const Allcomics = () => {
  const items = [
    { id: 1, value: "Supernatural" },
    { id: 2, value: "Action" },
    { id: 3, value: "Comedy" },
    { id: 4, value: "Romance" },
    { id: 5, value: "Ecchi" },
    { id: 6, value: "Adventure" },
    { id: 7, value: "Fantasy" },
    { id: 8, value: "Magic" },
    { id: 9, value: "Psychological" },
    { id: 10, value: "Drama" },
    { id: 11, value: "Mystery" },
    { id: 12, value: "Sci-Fi" },
    { id: 13, value: "Slice of Life" },
    { id: 14, value: "Yaoi" },
    { id: 15, value: "Horror" },
    { id: 16, value: "Thriller" },
    { id: 17, value: "Shounen Ai" },
    { id: 18, value: "Gender Bender" },
    { id: 19, value: "Sports" },
    { id: 20, value: "Yuri" },
    { id: 21, value: "Shoujo Ai" },
    { id: 22, value: "Mature" },
    { id: 23, value: "One Shot" },
    { id: 24, value: "Crime" },
    { id: 25, value: "Seinen" },
  ];

  const location = useLocation();
  const [selectedGenre, setSelectedGenre] = useState(""); // State to keep track of selected genre
  const [comics, setPosts] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [types, setTypes] = useState([]); // Додано стан для типів
  const [selectedType, setSelectedType] = useState("");
  const [selectedSortOrder, setSelectedSortOrder] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       console.log(`Selected Genre: ${selectedGenre}`); // Logging to check the selected genre
  //       const res = await axios.get(`/title?genre=${selectedGenre}`);
  //       setPosts(res.data);
  //       console.log(res.data); // Logging the response
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   fetchData();
  // }, [selectedGenre]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const selectedGenresQuery = selectedGenres.join(","); // Join the array into a string for the query
  //       console.log(`Selected Genres: ${selectedGenresQuery}`);
  //       const res = await axios.get(`/title?genres=${selectedGenresQuery}`);
  //       console.log(res.data);
  //       setPosts(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   fetchData();
  // }, [selectedGenres]);

  // Allcomics.jsx
  // Завантаження коміксів з урахуванням вибраних жанрів, статусів та типів
  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (selectedGenres.length > 0) {
          queryParams.append("genres", selectedGenres.join(","));
        }
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
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [
    selectedGenres,
    selectedStatus,
    selectedType,
    selectedSortOrder,
    searchQuery,
  ]);

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
  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };
  return (
    <div className="all-comics">
      <div className="manga-lists">
        <h3>Comics Lists</h3>
      </div>
      <div className="search-titles">
        <input
          type="text"
          placeholder="Search titles"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        ></input>
      </div>
      {/* <div className="filters">
        <button className="filter-button">Genre All</button>
        <button className="filter-button">Status All</button>
        <button className="filter-button">Type All</button>
        <button className="filter-button">Order by A-Z</button>
      </div> */}
      <div className="filters">
        <div className="filter-group">
          <Dropdown
            className="dropdown-button"
            title="Genre"
            items={items}
            // Indicate that this is a multi-select dropdown
            onGenreSelect={(genres) => {
              console.log(`Updated genres in AllComics: ${genres}`); // Log the updated genres
              setSelectedGenres(genres); // Update the selected genres state
            }}
            multiSelect
          />
          <Dropdown
            className="dropdown-button"
            title="Status All"
            items={statuses.map((status) => ({
              id: status.status_id,
              value: status.name,
            }))}
            onGenreSelect={(status) => {
              setSelectedStatus(status);
            }}
          />
          <Dropdown
            className="dropdown-button"
            title="Type All"
            items={types.map((type) => ({
              id: type.type_id,
              value: type.name,
            }))}
            onGenreSelect={(type) => {
              setSelectedType(type); // Оновлення вибраного типу
            }}
          />
          <Dropdown
            className="dropdown-button"
            title="Order by A-Z"
            items={[
              { id: 1, value: "A-Z" },
              { id: 2, value: "Update" },
              { id: 3, value: "Z-A" },
            ]}
            onGenreSelect={(order) => {
              setSelectedSortOrder(order);
            }}
          />
        </div>
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
              {/* <p>{genre}</p> */}
              {/* <p>{getText(comic.genres_id)}</p> */}
              <p></p>
              <p>Created: {moment(comic.update_date).fromNow()}</p>
              {/* {getText(}</p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Allcomics;
