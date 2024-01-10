import axios from "axios";
import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";

// Viewing Replay Page's Player Information Card
function ReplayViewPlayerInfoCard(props) {
  // destructure props
  const { title, children } = props;

  // add states
  const [playerName, setPlayerName] = useState("-");

  // side effect
  useEffect(() => {
    // api call to get player data
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
      <Card className="player-card">
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

export default ReplayViewPlayerInfoCard;
