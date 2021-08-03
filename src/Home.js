import React, { useState } from "react";
import searchIcon from "./search-icon.jpg";
import "./Home.css";
import axios from "axios";
import {
  ASTRA_DB_ID,
  ASTRA_DB_REGION,
  ASTRA_DB_KEYSPACE,
  ASTRA_DB_TABLE,
} from "./AstraDetails";
import { ASTRA_DB_APPLICATION_TOKEN } from "./Auth";
import { Input, Space, Row, Col, Card, Typography, Button } from "antd";

const { Search } = Input;
const { Meta } = Card;
const { Title } = Typography;

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
  };
  return (
    <div className="home-page">
      <Title className="title">Image Search App Using Datastax Astra</Title>
      <div>
        <Row>
          <Col span={12} offset={6}>
            <Search
              placeholder="Search ..."
              allowClear
              enterButton="Search"
              size="large"
              onChange={(e) => setQuery(e.target.value)}
              onSearch={searchPhotos}
            />
          </Col>
        </Row>
      </div>

      <div className="images-container">
        <Row gutter={[32, 32]}>
          {results.map((result) => (
            <Col span={8}>
              <Card
                hoverable
                cover={<img alt={result.src} src={result.image_url} />}>
                <Meta title={result.type} />
                <Space
                  direction="horizontal"
                  align="center"
                  size={[16, 64]}
                  wrap>
                  <Button primary>Danger Default</Button>
                  <Button danger>Danger Default</Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Home;
