import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { AuthContext } from "../context/authContext";

// import DOMPurify from "dompurify";

const Single = () => {
  const [comic, setPost] = useState({});
  const [isBookmarked, setIsBookmarked] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const comicId = location.pathname.split("/")[2];

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    // console.log("comic.img:", comic.img);
    const fetchData = async () => {
      try {
        const res = await axios.get(`/title/${comicId}`);

        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [comicId]);

  useEffect(() => {
    const checkBookmarks = async () => {
      try {
        const res = await axios.get(`/bookmarks/${currentUser?.user_id}`);

        if (res.data.includes(parseInt(comicId))) {
          setIsBookmarked(true);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (currentUser) {
      checkBookmarks();
    }
  }, [currentUser, comicId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/title/${comicId}`);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await axios.delete(`/bookmarks/${currentUser.user_id}`, {
          data: { comicId: comicId },
        });

        // await axios.delete(`/bookmarks/${currentUser.user_id}/${comicId}`);
        //   data: { comicId, userId:  },
        // });
      } else {
        await axios.post(`/bookmarks/${currentUser.user_id}`, {
          comicId: comicId,
        });
      }
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="single">
      <div className="title">
        <h1>{comic.title}</h1>
      </div>
      <div className="content-container">
        <div className="content-left">
          <div className="image">
            {/* <img src={`../upload/${comic.img}`} alt={comic.title}></img> */}
            {comic.img && (
              <img src={`../upload/${comic.img}`} alt={comic.title}></img>
            )}
          </div>
          <div className="bookmark">
            <button onClick={handleBookmark}>
              {isBookmarked ? "Saved" : "Bookmark"}
            </button>
            {currentUser?.is_admin ? (
              <>
                <Link to={`/add-comic?edit=2`} state={comic}>
                  <button>Edit</button>
                </Link>

                <button onClick={handleDelete}>Delete</button>
              </>
            ) : null}
          </div>

          <p>Status: {comic.status}</p>
          <p>Type: {comic.type}</p>
        </div>
        <div className="content-right">
          <div className="socials">
            {comic.source_urls?.split(", ").map((url, index) => (
              <a key={index} href={url}>
                Link {index + 1}
              </a>
            ))}
          </div>
          <div className="alies">
            <h2>Alies</h2>
            <p>{comic.aliases}</p>
          </div>
          <div className="Synopsis">
            <h2>Synopsis</h2>
            <p>{comic.synopsis}</p>
          </div>
          <div className="genres">
            <h2>Genres</h2>
            <div className="genre">
              {/* <p>Genre, Genre 2</p> */}
              {comic.genres?.split(", ").map((genre, index) => (
                <p key={index}>{genre}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Single;
