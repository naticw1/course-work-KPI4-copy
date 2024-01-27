import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import UserIcon from "../img/user-icon.png";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Dropdown from "../components/Dropdown";
import moment from "moment";

const User = () => {
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
  const { currentUser, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const [comics, setComics] = useState([]);
  // const [selectedGenre, setSelectedGenre] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [types, setTypes] = useState([]); // Додано стан для типів
  const [selectedType, setSelectedType] = useState("");
  const [selectedSortOrder, setSelectedSortOrder] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (currentUser === null) {
      navigate("/login"); // Перенаправляєте користувача на сторінку входу
    }
  }, [currentUser, navigate]); // Додаєте currentUser та navigate як залежності useEffect

  const handleLogout = async () => {
    try {
      await logout(); // Викликаєте функцію logout з AuthContext
    } catch (error) {
      console.error(error); // Обробка помилок, якщо вони є
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const queryParams = new URLSearchParams();
      queryParams.append("user_id", currentUser?.user_id);

      // console.log(currentUser.user_id);
      if (searchQuery) {
        queryParams.append("search", searchQuery);
      }
      if (selectedGenres.length > 0) {
        queryParams.append("genres", selectedGenres.join(","));
        console.log("selectedGenres.join(", ")", selectedGenres.join(","));
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

      console.log(queryParams.toString());
      try {
        const res = await axios.get(`/users/user/comics?${queryParams}`);
        console.log(res.data);
        setComics(res.data);
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
    currentUser,
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
    <div className="user-page">
      <div className="container">
        <div className="user">
          <div className="inside-user">
            <img src={UserIcon} alt="user icon" />
            <div className="user-content">
              <h1>Hello,</h1>
              <h1>{currentUser?.username}</h1>
              <button onClick={logout}>Logout</button>
            </div>
          </div>
        </div>
        <div className="Bookmarks">
          <div className="manga-lists">
            <h3>Bookmarks</h3>
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
                  {/* <p>{getText(comic.genres_id)}</p> */}
                  <p></p>
                  <p>Created: {moment(comic.update_date).fromNow()}</p>
                  {/* {getText(}</p> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
