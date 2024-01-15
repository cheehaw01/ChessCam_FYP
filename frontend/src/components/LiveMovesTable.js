import axios from "axios";
import React, { useState, useEffect, useContext, useRef } from "react";
import DataTable from "react-data-table-component";
import { LiveContext } from "./Live";

// Live Chess Move Table
function LiveMovesTable(props) {
  // add states
  const [moves, setMoves] = useState([]);
  const [trackMove, setTrackMove] = useState(true);

  // reference to the bottom element
  const bottomRef = useRef(null);

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
            if (trackMove) {
              bottomRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }, 1000);

    return () => {
      clearInterval(moveReader);
    };
  }, [moves, trackMove, liveContext]);

  // table column definition
  const columns = [
    {
      name: "#",
      selector: (row) => <div ref={bottomRef}>{row.step}</div>,
      conditionalCellStyles: [
        {
          when: (row) => row.step === moves.length,
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
        maxHeight: props.height - 30,
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

  const handleTrackMoveChange = (e) => {
    setTrackMove(e.target.checked);
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
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          value={trackMove}
          id="trackMoveCheck"
          defaultChecked={trackMove}
          onChange={handleTrackMoveChange}
        ></input>
        <label class="form-check-label" for="trackMoveCheck">
          Track New Move
        </label>
      </div>
    </div>
  );
}

export default React.memo(LiveMovesTable);
