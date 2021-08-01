import React, { useState } from "react";
import searchIcon from "./search-icon.jpg";
import "./Home.css";
import axios from "axios";

const ASTRA_DB_ID = "3d0ec803-5233-4844-92b6-2d666f44f92b";
const ASTRA_DB_REGION = "us-west-2";
const ASTRA_DB_KEYSPACE = "img_search";
const ASTRA_DB_TABLE = "images";
const ASTRA_DB_APPLICATION_TOKEN =
  "AstraCS:ZrMJOcvyswTqNTZHSZaCLOOh:5189077f7825d514ba8c8e3cd66c24c0c6ccb1738aacdac354b693266f80ad99";

export const Home = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const searchPhotos = () => {
    axios
      .get(
        `https://${ASTRA_DB_ID}-${ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/keyspaces/${ASTRA_DB_KEYSPACE}/${ASTRA_DB_TABLE}/${query}`,
        {
          headers: {
            "x-cassandra-token": `${ASTRA_DB_APPLICATION_TOKEN}`,
          },
        }
      )
      .then((res) => {
        setResults(res.data.data);
        console.log(res.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
    return <p>hello</p>;
  };
  return (
    <div className="home-page">
      <h1> Welcome to Todo</h1>
      <div className="search-area">
        <input
          className="search-text"
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <img className="search-icon" src={searchIcon} onClick={searchPhotos} />
      </div>
      <div className="card-list">
        {results.map((result) => (
          <div className="card" key={result.id}>
            <img
              className="card--image"
              alt={result.src}
              src={result.image_url}
              width="50%"
              height="50%"></img>
            <span>{result.type}</span>
          </div>
        ))}{" "}
      </div>
    </div>
  );
};

export default Home;
