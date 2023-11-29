// import axios from "axios";
import React, { useState, useEffect } from "react";

// Timer on Viewing Replay Page
function ReplayViewTimer(props) {
  // default timer values
  const defaultMinute = "20";
  const defaultSecond = "00";

  // add states
  const [minutes, setMinutes] = useState(defaultMinute);
  const [seconds, setSeconds] = useState(defaultSecond);

  // props destructure
  const { turn, step } = props;

  // side effect
  useEffect(() => {
    // Call API to retrieve the time values
    console.log(turn);
    console.log(step);
    setMinutes(defaultMinute);
    setSeconds(defaultSecond);
    // to be develop
  }, [turn, step]);

  return (
    <div>
      <h1>
        {minutes}:{seconds}
      </h1>
      {/* <button onClick={() => startTimer()}>start</button>
      <button onClick={() => stopTimer()}>stop</button>
      <button onClick={() => resetTimer()}>reset</button> */}
    </div>
  );
}

export default ReplayViewTimer;
