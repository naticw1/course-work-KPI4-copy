import React from "react";

import { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const Home = () => {
  const [comics, setPosts] = useState([]);

  const location = useLocation();
  console.log(location);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/title`);
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  // console

  return (
    <div className="home">
      <div className="posts">
        {comics.map((comic) => (
          <div className="post" key={comic.comic_id}>
            <div className="img">
              <img src={`../upload/${comic.img}`} alt="comic image" />
            </div>
            <div className="content">
              <Link className="link" to={`/title/${comic.comic_id}`}>
                <h1>{comic.title}</h1>
              </Link>
              {/* <p>{getText(comic.synopsis)}</p> */}
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

export default Home;
