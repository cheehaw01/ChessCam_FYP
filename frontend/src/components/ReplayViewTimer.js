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
  const { minute, second } = props;

  // side effect
  useEffect(() => {
    // Call API to retrieve the time values
    setMinutes(minute);
    setSeconds(second);
    // to be develop
  }, [minute, second]);

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
