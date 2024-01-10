import React, { useCallback, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";

// Live Camera
function LiveCamera() {
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: { min: 480 },
    height: { min: 720 },
    facingMode: "environment",
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();

    axios
      .post(`${process.env.REACT_APP_CAMERA_API_URL}`, { image: imageSrc })
      .then((res) => {
        console.log(res.data);
        // Call API for updating capture image instruction
        axios
          .patch(`${process.env.REACT_APP_CAMERA_API_URL}/image/0`)
          .then((res) => {
            console.log(res.data);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        throw err;
      });
  }, [webcamRef]);

  useEffect(() => {
    const captureCheck = setInterval(() => {
      axios
        .get(`${process.env.REACT_APP_CAMERA_API_URL}/image`)
        .then((res) => {
          console.log(res.data.captureImg);
          if (res.data.captureImg) {
            capture();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }, 900);

    return () => {
      clearInterval(captureCheck);
    };
  });

  return (
    <>
      <div className="d-flex flex-row justify-content-center">
        <Webcam
          audio={false}
          width={480}
          height={720}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
      </div>
      <button
        onClick={() => {
          capture();
        }}
      >
        Capture
      </button>
    </>
  );
}

export default LiveCamera;
