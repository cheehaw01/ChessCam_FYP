import React from "react";
import HomeCard from "./HomeCard";
import axios from "axios";

// Home Page
function Home() {
  axios.defaults.withCredentials = true;
  return (
    <div className="d-flex flex-row justify-content-center">
      <HomeCard title="Live" width="30rem" bg="#a6a6a6" to="live">
        View chessboard live. <br />
        Using object recognition and image processing on videos capture by cam
        to identify the position of chess pieces on normal chessboard.
      </HomeCard>
      <HomeCard title="Replay" width="30rem" bg="#a6a6a6" to="replay">
        Replay saved chess games. The chess games that is saved into database
        can be review.
      </HomeCard>
    </div>
  );
}

export default Home;
