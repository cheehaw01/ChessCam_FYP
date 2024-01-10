import axios from "axios";
import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";

// Card for Live Player Information
function LivePlayerInfoCard(props) {
  // destructure props
  const { title, children, timerClick, clickable, auth } = props;

  // add states
  const [playerName, setPlayerName] = useState("-");

  // side effect
  useEffect(() => {
    // api call for getting player data
    axios
      .get(`${process.env.REACT_APP_PLAYERS_API_URL}/${title}`)
      .then((res) => {
        console.log(res);
        setPlayerName(res.data.data?.player_name || "-");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [title]);

  // render
  return (
    <React.Fragment>
      <Card
        className={auth && clickable ? "player-card-clickable" : "player-card"}
        onClick={timerClick()}
      >
        <Card.Body>
          <Card.Title>
            <h1>{playerName}</h1>
          </Card.Title>
          {children}
        </Card.Body>
      </Card>
    </React.Fragment>
  );
}

export default LivePlayerInfoCard;
