import React, { useState, useEffect, useContext } from "react";
import { Chessboard } from "react-chessboard";
import axios from "axios";
import { GameIdContext } from "./ReplayView";
import { StepCountContext } from "./ReplayView";

// Container for holding the Chessboard
function ReplayViewChessboardHolder(props) {
  // add states
  const [position, setPosition] = useState([]);
  const [firstRender, setFirstRender] = useState(true);

  // read and subscribe to contexts
  const gameId = useContext(GameIdContext);
  const control = useContext(StepCountContext);

  // side effect
  useEffect(() => {
    // api call to get position record data
    axios
      .get(`${process.env.REACT_APP_RECORD_POSITIONS_API_URL}/${gameId}`)
      .then((res) => {
        setPosition(res.data);
        console.log(res.data);
        control.setTotalStep(res.data.length - 1);
        if (firstRender) {
          setFirstRender(false);
        }
      })
      .catch((err) => console.log(err));
  }, [gameId, firstRender]); // eslint-disable-line react-hooks/exhaustive-deps

  // render
  return (
    <div className="m-1">
      <Chessboard
        boardWidth={props.width - 200}
        // position={position[control.step]}
        position={position[control.step]?.fen}
      />
    </div>
  );
}

export default ReplayViewChessboardHolder;
