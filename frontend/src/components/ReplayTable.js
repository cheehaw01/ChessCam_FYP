import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";

// table styling
const tableStyles = {
  rows: {
    style: {
      fontSize: 16,
      background: "#e6e6e6",
    },
  },
  headCells: {
    style: {
      fontSize: 18,
      background: "#d9d9d9",
    },
  },
};

// Replay Page Chess Move Table
function ReplayTable() {
  // add states
  const [games, setGames] = useState([]);
  const [data, setData] = useState(games);
  // const [tournaments, setTournaments] = useState([]);
  // const [venues, setVenues] = useState([]);
  // const [pairs, setPairs] = useState([]);
  // const [players, setPlayers] = useState([]);

  // function - handle search filter
  const handleFilter = (event) => {
    const newData = games.filter((row) => {
      return (
        row.white_player
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        row.black_player
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        row.tournament_name
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        row.venue_name
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        row.date
          .toString()
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      );
    });
    setData(newData);
  };

  // side effect
  useEffect(() => {
    // api call for getting game data
    axios
      .get(`${process.env.REACT_APP_GAMES_API_URL}`)
      .then((res) => {
        setGames(res.data.data);
        setData(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => console.log(err));
    // axios
    //   .get(
    //     `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_TOURNAMENTS_API_URL}`
    //   )
    //   .then((res) => {
    //     setTournaments(res.data.data);
    //     console.log(res.data.data);
    //   })
    //   .catch((err) => console.log(err));
    // axios
    //   .get(
    //     `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_VENUES_API_URL}`
    //   )
    //   .then((res) => {
    //     setVenues(res.data.data);
    //     console.log(res.data.data);
    //   })
    //   .catch((err) => console.log(err));
    // axios
    //   .get(
    //     `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_PAIRS_API_URL}`
    //   )
    //   .then((res) => {
    //     setPairs(res.data.data);
    //     console.log(res.data.data);
    //   })
    //   .catch((err) => console.log(err));
    // axios
    //   .get(
    //     `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_PLAYERS_API_URL}`
    //   )
    //   .then((res) => {
    //     setPlayers(res.data.data);
    //     console.log(res.data.data);
    //   })
    //   .catch((err) => console.log(err));
  }, []);

  // table column definition
  const columns = [
    {
      name: "Tournament",
      selector: (row) => row.tournament_name,
      // selector: (row) => {
      //   return tournaments.map((item) => {
      //     return (
      //       item.tournament_id === row.tournament_id && item.tournament_name
      //     );
      //   });
      // },
      sortable: true,
    },
    {
      name: "Venue",
      selector: (row) => row.venue_name,
      // selector: (row) => {
      //   return venues.map((item) => {
      //     return item.venue_id === row.venue_id && item.venue_name;
      //   });
      // },
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.date.slice(0, 10),
      sortable: true,
    },
    {
      name: "Player White",
      selector: (row) => row.white_player,
      // selector: (row) => {
      //   return players.map((a) => {
      //     return pairs.map((item) => {
      //       return (
      //         (item.game_id === row.game_id &&
      //           item.side === "white" &&
      //           item.player_id) === a.player_id && a.player_name
      //       );
      //     });
      //   });
      // },
      sortable: true,
    },
    {
      name: "Player Black",
      selector: (row) => row.black_player,
      // selector: (row) => {
      //   return players.map((a) => {
      //     return pairs.map((item) => {
      //       return (
      //         (item.game_id === row.game_id &&
      //           item.side === "black" &&
      //           item.player_id) === a.player_id && a.player_name
      //       );
      //     });
      //   });
      // },
      sortable: true,
    },
    {
      name: "Winning Side",
      selector: (row) => row.winning_side,
      sortable: true,
    },
    {
      name: "",
      selector: (row) => (
        <Button variant="info" onClick={() => navigate(`${row.game_id}`)}>
          View
        </Button>
      ),
    },
  ];

  // for navigate programmatically
  const navigate = useNavigate();

  // render
  return (
    <React.Fragment>
      <div className="mb-1">
        <Form.Text>Search:</Form.Text>
      </div>
      <div className="float-start mb-1 w-25">
        <Form.Control onChange={handleFilter}></Form.Control>
      </div>
      <DataTable
        className="rounded border border-2 border-dark"
        columns={columns}
        data={data}
        customStyles={tableStyles}
        fixedHeader
        pagination
      ></DataTable>
    </React.Fragment>
  );
}

export default ReplayTable;
