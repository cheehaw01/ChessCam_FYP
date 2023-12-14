import React, { useState, useEffect, useContext } from "react";
import { Chessboard } from "react-chessboard";
import { LiveContext } from "./Live";
import axios from "axios";

// A container that holds the chessboard
function ChessboardHolder(props) {
  // add states
  const [position, setPosition] = useState([]);
  const [length, setLength] = useState(0);

  // read and subscribe to context
  const liveContext = useContext(LiveContext);

  // side effect
  useEffect(() => {
    // retrieve live data every second
    const positionReader = setInterval(() => {
      if (liveContext.live) {
        axios
          .get(
            `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_LIVE_POSITIONS_API_URL}`
          )
          .then((res) => {
            setPosition(res.data);
            console.log(res.data);
            setLength(position.length - 1);
          })
          .catch((err) => console.log(err));
      }
    }, 1000);

    return () => {
      clearInterval(positionReader);
    };
  }, [position, liveContext]);

  return (
    <div className="m-1">
      <Chessboard
        boardWidth={props.width - 200}
        // position={position[length]}
        position={position[length]?.fen}
      />
    </div>
  );
}

export default ChessboardHolder;
