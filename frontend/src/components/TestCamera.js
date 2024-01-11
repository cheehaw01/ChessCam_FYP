import React, { useCallback, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";

// Test Camera
function TestCamera() {
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: { min: 960 },
    height: { min: 720 },
    facingMode: "environment",
  };

  const capture = useCallback(
    (e) => {
      e.preventDefault();
      const imageSrc = webcamRef.current.getScreenshot();

      axios
        .post(`${process.env.REACT_APP_CAMERA_API_URL}`, { image: imageSrc })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          throw err;
        });
    },
    [webcamRef]
  );

  return (
    <div className="d-flex flex-row justify-content-center">
      <Webcam
        audio={false}
        width={960}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
      <button onClick={capture}>Capture photo</button>
    </div>
  );
}

export default TestCamera;
