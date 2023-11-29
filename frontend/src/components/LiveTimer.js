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
  const [deadline, setDeadline] = useState(new Date());
  const [start, setStart] = useState(false);
  const [firstRender, setFirstRender] = useState(true);

  // props destructure
  const {
    turn,
    side,
    setTimerStatus,
    timerResetTrigger,
    setTimerResetTrigger,
  } = props;

  // function - start the timer
  const startTimer = () => {
    setDeadline(new Date());
    setStart(true);
  };

  // function - stop the timer
  const stopTimer = () => {
    setStart(false);
  };

  // function - reset the timer
  const resetTimer = () => {
    // Call API to reset
    axios
      .delete(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_LIVE_TIMER_API_URL}`
      )
      .then((res) => {
        console.log(res.data);
        stopTimer();
        setTimerStatus(0);
        setMinutes(defaultMinute);
        setSeconds(defaultSecond);
      })
      .catch((err) => console.log(err));
  };

  // function - to calculate the time passed
  const getRemainingTime = (deadline) => {
    const totalMinus = Date.parse(deadline) - Date.parse(new Date());
    const total =
      (parseInt(minutes, 10) * 60 + parseInt(seconds, 10)) * 1000 + totalMinus;
    const newMinutes = Math.floor((total / 1000 / 60) % 60);
    const newSeconds = Math.floor((total / 1000) % 60);
    return { newMinutes, newSeconds };
  };

  // side effect
  useEffect(() => {
    // during first render
    if (firstRender) {
      // Call API to read the live time values
      axios
        .get(
          `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_LIVE_TIMER_API_URL}`
        )
        .then((res) => {
          if (side === "white") {
            setMinutes(res.data.white[0]);
            setSeconds(res.data.white[1]);
          } else if (side === "black") {
            setMinutes(res.data.black[0]);
            setSeconds(res.data.black[1]);
          }
          setTimerStatus(res.data.turn);
          setFirstRender(false);
        })
        .catch((err) => console.log(err));
    }

    // perform condition checking, set the minutes and seconds to be render, and save live time values every 1s
    const interval = setInterval(() => {
      if (timerResetTrigger) {
        resetTimer();
        setTimerResetTrigger(false);
      }

      if (start) {
        // find and set values for remaining time
        let { newMinutes, newSeconds } = getRemainingTime(deadline);
        if (newMinutes < 0 && newSeconds < 0) {
          stopTimer();
          console.log("stop");
        } else {
          setMinutes(newMinutes > 9 ? "" + newMinutes : "0" + newMinutes);
          setSeconds(newSeconds > 9 ? "" + newSeconds : "0" + newSeconds);
        }

        // Call API to save the live time values
        axios
          .post(
            `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_LIVE_TIMER_API_URL}/${turn}`,
            {
              time: [minutes, seconds],
            }
          )
          .then((res) => {
            console.log(res.data);
          })
          .catch((err) => console.log(err));
      }

      // start/stop toggle
      if (props.status && !start) {
        startTimer();
      } else {
        stopTimer();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [start, props.status, timerResetTrigger]); // eslint-disable-line react-hooks/exhaustive-deps

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
