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
import {
  Input,
  Space,
  Row,
  Col,
  Card,
  Typography,
  Button,
  Popconfirm,
  message,
  Modal,
} from "antd";

const { Search } = Input;
const { Meta } = Card;
const { Title } = Typography;
const text = "Are you sure to delete this image?";

export const Home = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [imageName, setImageName] = useState("");

  const [visible, setVisible] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState("");

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

  const confirmDelete = (id) => {
    axios
      .delete(
        `https://${ASTRA_DB_ID}-${ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/keyspaces/${ASTRA_DB_KEYSPACE}/${ASTRA_DB_TABLE}/${query}/${id}`,
        {
          headers: {
            "x-cassandra-token": `${ASTRA_DB_APPLICATION_TOKEN}`,
          },
        }
      )
      .catch((error) => {
        console.error(error);
      });
    searchPhotos();
  };

  const showModal = (imageId, imageName) => {
    setSelectedImageId(imageId);
    setImageName(imageName);
    setVisible(true);
  };

  const handleUpdate = () => {
    axios.put(
      `https://${ASTRA_DB_ID}-${ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/keyspaces/${ASTRA_DB_KEYSPACE}/${ASTRA_DB_TABLE}/${query}/${selectedImageId}`,
      {
        type: imageName,
      },
      {
        headers: {
          "x-cassandra-token": `${ASTRA_DB_APPLICATION_TOKEN}`,
        },
      }
    );
    setInterval(searchPhotos(), 500);
    handleCancel();
  };

  const handleCancel = () => {
    setVisible(false);
    setSelectedImageId("");
    setImageName("");
  };
  return (
    <div className="home-page">
      <Title className="title">Image Search App Using Datastax Astra</Title>
      <div>
        <Row>
          <Col span={12} offset={6}>
            <Search
              placeholder="Search for images (cats, dogs, apples etc) ..."
              allowClear
              enterButton="Search"
              size="large"
              onChange={(e) => setQuery(e.target.value.toLowerCase())}
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
                  size={[16, 16]}
                  wrap>
                  <Button
                    type="primary"
                    onClick={() => showModal(result.id, result.type)}>
                    Update Name
                  </Button>
                  <Popconfirm
                    placement="top"
                    title={text}
                    onConfirm={() => confirmDelete(result.id)}
                    okText="Yes"
                    cancelText="No">
                    <Button danger>Delete image</Button>
                  </Popconfirm>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      {visible && (
        <Modal visible={visible} onOk={handleUpdate} onCancel={handleCancel}>
          <input
            type="text"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
          />
        </Modal>
      )}
    </div>
  );
};

export default Home;
