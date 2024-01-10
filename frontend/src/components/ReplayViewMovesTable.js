import React, { useState, useEffect, useContext } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { GameIdContext } from "./ReplayView";
import { StepCountContext } from "./ReplayView";

// Viewing Replay Page's Table for Chess Move
function ReplayViewMovesTable(props) {
  // add states
  const [moves, setMoves] = useState([]);

  // read and subscribe to contexts
  const gameId = useContext(GameIdContext);
  const control = useContext(StepCountContext);

  // side effect
  useEffect(() => {
    // api call to get move record data
    axios
      .get(`${process.env.REACT_APP_RECORD_MOVES_API_URL}/${gameId}`)
      .then((res) => {
        setMoves(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [gameId]);

  // table column definition
  const columns = [
    {
      name: "#",
      selector: (row) => row.step,
      conditionalCellStyles: [
        {
          when: (row) => row.step === Math.floor((control.step - 1) / 2) + 1,
          style: {
            backgroundColor: "#cccccc",
            transform: "scale(1.1, 1.1)",
            transition: "0.2s",
          },
        },
      ],
    },
    {
      name: "white",
      selector: (row) => row.white,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.step === Math.floor((control.step - 1) / 2) + 1 &&
            control.step % 2 !== 0,
          style: {
            backgroundColor: "#d9d9d9",
            transform: "scale(1.1, 1.1)",
            transition: "0.2s",
          },
        },
      ],
    },
    {
      name: "black",
      selector: (row) => row.black,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.step === Math.floor((control.step - 1) / 2) + 1 &&
            control.step % 2 === 0,
          style: {
            backgroundColor: "#d9d9d9",
            transform: "scale(1.1, 1.1)",
            transition: "0.2s",
          },
        },
      ],
    },
  ];

  // table styling
  const tableStyles = {
    table: {
      style: {
        maxHeight: props.height,
        overflowX: "hidden",
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

export default ReplayViewMovesTable;
