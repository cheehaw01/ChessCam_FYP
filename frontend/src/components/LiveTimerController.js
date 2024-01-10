import React, { useState } from "react";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import resetButtonImg from "../assets/refresh-arrow-button.png";
import timerButtonImg from "../assets/stopwatch.png";
import pauseButtonImg from "../assets/pause.png";
import playButtonImg from "../assets/play.png";
import axios from "axios";

// Timer Controller for Live
function LiveTimerController(props) {
  // add state
  const [minute, setMinute] = useState(20);

  // destructure props
  const { auth, timerStatus, setDefaultTimerValues, handlePostTimeApiCall } =
    props;

  // function - handle input change to capture value and avoid number < 0 or > 60
  const handleInputChange = (e) => {
    if (e.target.value > 60) {
      e.target.value = 60;
      setMinute(e.target.value);
    } else if (e.target.value <= 0) {
      e.target.value = 0;
      setMinute(e.target.value);
    } else {
      setMinute(e.target.value.replace(/^0+/, ""));
    }
  };

  // function - set new default value and call api to reset timer with new value
  const handleSetDuration = () => {
    if (auth) {
      setDefaultTimerValues([minute, "00"]);

      // Api call for changing the timer status
      axios
        .post(`${process.env.REACT_APP_LIVE_TIMER_API_URL}/0`)
        .then((res) => {
          console.log(res.data);
          // Api call for changing new minute value
          axios
            .post(`${process.env.REACT_APP_LIVE_TIMER_API_URL}/3`, {
              time: [minute, "00"],
            })
            .then((res) => {
              console.log(res.data);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }
  };

  // function - handle pause and stop
  const handlePausePlay = () => {
    console.log(timerStatus);
    if (timerStatus === 1) {
      handlePostTimeApiCall(4);
    } else if (timerStatus === 2) {
      handlePostTimeApiCall(0);
    } else if (timerStatus === 0) {
      handlePostTimeApiCall(2);
    } else if (timerStatus === 4) {
      handlePostTimeApiCall(1);
    }
  };

  // render
  return (
    <div>
      <Card className="p-1 d-flex flex-row">
        <h2 className="p-1 d-flex align-items-center">Timer: </h2>
        <div className="d-flex align-items-center justify-content-end">
          <input
            id="set_duration"
            type="number"
            min={0}
            max={60}
            onChange={(e) => {
              handleInputChange(e);
            }}
          ></input>
          <span>min</span>
          <Image
            className="m-1 control-button rounded-2"
            src={timerButtonImg}
            width="15%"
            onClick={() => {
              handleSetDuration();
            }}
          />
          <Image
            className="m-1 control-button rounded-2"
            src={resetButtonImg}
            width="15%"
            onClick={() => {
              handlePostTimeApiCall(3);
            }}
          />
          <Image
            className="m-1 control-button rounded-2"
            src={
              timerStatus === 0 || timerStatus === 4
                ? playButtonImg
                : pauseButtonImg
            }
            width="15%"
            onClick={() => {
              handlePausePlay();
            }}
          />
        </div>
      </Card>
    </div>
  );
}

export default LiveTimerController;
