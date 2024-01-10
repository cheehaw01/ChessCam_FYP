import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import DataTable from "react-data-table-component";
import { LiveContext } from "./Live";

// Live Chess Move Table
function LiveMovesTable(props) {
  // add states
  const [moves, setMoves] = useState([]);

  // read and subscribe to context
  const liveContext = useContext(LiveContext);

  // side effect
  useEffect(() => {
    // read chess moves every 1s
    const moveReader = setInterval(() => {
      if (liveContext.live) {
        axios
          .get(`${process.env.REACT_APP_LIVE_MOVES_API_URL}`)
          .then((res) => {
            setMoves(res.data);
            console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }, 1000);

    return () => {
      clearInterval(moveReader);
    };
  }, [moves, liveContext]);

  // table column definition
  const columns = [
    {
      name: "#",
      selector: (row) => row.step,
    },
    {
      name: "white",
      selector: (row) => row.white,
    },
    {
      name: "black",
      selector: (row) => row.black,
    },
  ];

  // table style
  const tableStyles = {
    table: {
      style: {
        maxHeight: props.height,
      },
    },
    headCells: {
      style: {
        fontSize: 18,
      },
    },
    rows: {
      style: {
        fontSize: 16,
      },
    },
  };

  // render
  return (
    <div
      className="p-1 rounded border border-2 border-dark-subtle"
      style={{ background: "#bcbdc1" }}
    >
      <DataTable
        columns={columns}
        data={moves}
        keyField="step"
        fixedHeader
        customStyles={tableStyles}
      ></DataTable>
    </div>
  );
}

export default React.memo(LiveMovesTable);
