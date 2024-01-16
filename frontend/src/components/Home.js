import React, { useState, useEffect } from "react";
import HomeCard from "./HomeCard";
import axios from "axios";
import DataTable from "react-data-table-component";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// Home Page
function Home() {
  axios.defaults.withCredentials = true;

  // add states
  const [ranking, setRanking] = useState([]);

  // table column definition
  const columns = [
    {
      name: "Rank",
      selector: (row) =>
        ranking.findIndex((x) => x.player_id === row.player_id) + 1,
    },
    {
      name: "Player",
      selector: (row) => row.player_name,
    },
    {
      name: "Winning Rate",
      selector: (row) => row.win_rate.toFixed(2),
    },
  ];

  // table styling
  const tableStyles = {
    table: {
      style: {
        overflowX: "hidden",
      },
    },
    headCells: {
      style: {
        fontSize: 18,
      },
    },
    rows: {
      style: {
        fontSize: 16,
      },
    },
  };

  // side effect
  useEffect(() => {
    // api call to get player ranks data
    axios
      .get(`${process.env.REACT_APP_PLAYERS_API_URL}/ranks`)
      .then((res) => {
        setRanking(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div style={{ backgroundColor: "#f2f2f2" }}>
      <div className="d-flex flex-row justify-content-center">
        <HomeCard title="Live" width="30rem" bg="#a6a6a6" to="live">
          View chessboard live. <br />
          Using object recognition and image processing on videos capture by cam
          to identify the position of chess pieces on normal chessboard.
        </HomeCard>
        <HomeCard title="Replay" width="30rem" bg="#a6a6a6" to="replay">
          Replay saved chess games. The chess games that is saved into database
          can be review.
        </HomeCard>
      </div>

      <Container fluid>
        <Row className="justify-content-md-center">
          <Col lg="3"></Col>
          <Col
            lg="6"
            className="p-1 rounded border border-2 border-dark-subtle"
            style={{ background: "#bcbdc1" }}
          >
            <div className="d-flex justify-content-center">
              <h1>Player Ranking</h1>
            </div>
            <div className="d-flex justify-content-center">
              <DataTable
                columns={columns}
                data={ranking}
                keyField="player_id"
                fixedHeader
                customStyles={tableStyles}
              ></DataTable>
            </div>
          </Col>
          <Col lg="3"></Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
