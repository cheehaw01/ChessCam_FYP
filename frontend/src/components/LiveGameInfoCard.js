import axios from "axios";
import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import useLongPress from "./custom-hooks/useLongPress";

// styling
const titleStyle = {
  fontSize: 24,
};

// Live Game Information Card
function LiveGameInfoCard(props) {
  // add states
  const [tournamentName, setTournamentName] = useState("-");
  const [venueName, setVenueName] = useState("-");

  // props destructures
  const { tournament_id, venue_id, date, handlePostTimeApiCall } = props;

  // custom hooks - useLongPress
  const longPress = useLongPress(() => {
    handlePostTimeApiCall(3);
  }, 1000);

  // side effect
  useEffect(() => {
    // api call for getting tournament data
    axios
      .get(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_TOURNAMENTS_API_URL}/${tournament_id}`
      )
      .then((res) => {
        console.log(res);
        setTournamentName(res.data.data?.tournament_name || "-");
      })
      .catch((err) => {
        console.log(err);
      });

    // api call for getting venue data
    axios
      .get(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_VENUES_API_URL}/${venue_id}`
      )
      .then((res) => {
        console.log(res);
        setVenueName(res.data.data?.venue_name || "-");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [tournament_id, venue_id]);

  // render
  return (
    <React.Fragment>
      <Card className="game-info-card" {...longPress}>
        <Card.Body>
          <Card.Title style={titleStyle}>Tournament:</Card.Title>
          <Card.Text>{tournamentName}</Card.Text>
          <Card.Title style={titleStyle}>Venue:</Card.Title>
          <Card.Text>{venueName}</Card.Text>
          <Card.Title style={titleStyle}>Date:</Card.Title>
          <Card.Text>{date}</Card.Text>
        </Card.Body>
      </Card>
    </React.Fragment>
  );
}

export default LiveGameInfoCard;
