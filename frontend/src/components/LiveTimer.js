import axios from "axios";
import React, { useState, useEffect } from "react";

// Timer for Live
function LiveTimer(props) {
  // default timer values
  const defaultMinute = "20";
  const defaultSecond = "00";

  // add states
  const [minutes, setMinutes] = useState(defaultMinute);
  const [seconds, setSeconds] = useState(defaultSecond);

  // props destructure
  const { side } = props;

  // side effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Call API to read the live time values
      axios
        .get(`${process.env.REACT_APP_LIVE_TIMER_API_URL}`)
        .then((res) => {
          if (side === "white") {
            setMinutes(res.data.white[0]);
            setSeconds(res.data.white[1]);
          } else if (side === "black") {
            setMinutes(res.data.black[0]);
            setSeconds(res.data.black[1]);
          }
        })
        .catch((err) => console.log(err));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [minutes, seconds, side]);

  // render
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

export default LiveTimer;
