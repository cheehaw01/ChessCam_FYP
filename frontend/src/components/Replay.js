import React from "react";
import ReplayTable from "./ReplayTable";
import axios from "axios";

// Replay Page
function Replay() {
  // cross-site Access-Control requests with credentials
  axios.defaults.withCredentials = true;

  // render
  return (
    <div className="rounded m-2 p-1 bg-grey-1">
      <ReplayTable />
    </div>
  );
}

export default Replay;
