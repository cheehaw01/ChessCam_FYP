import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ReplayViewChessboardHolder from "./ReplayViewChessboardHolder";
import ReplayViewMovesTable from "./ReplayViewMovesTable";
import ReplayViewPlayerInfoCard from "./ReplayViewPlayerInfoCard";
import ReplayViewGameInfoCard from "./ReplayGameInfoCard";
import ReplayViewTimer from "./ReplayViewTimer";
import ReplayController from "./ReplayController";
import axios from "axios";

// create context
export const GameIdContext = React.createContext();
export const StepCountContext = React.createContext();

// Page for Viewing the Replay
function ReplayView() {
  // get params from URL
  const params = useParams();
  const gameId = params.id;

  // to track the chessboard size
  const refCol = useRef();

  // add states
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [step, setStep] = useState(0);
  const [totalStep, setTotalStep] = useState(0);
  const [tournamentId, setTournamentId] = useState();
  const [venueId, setVenueId] = useState();
  const [date, setDate] = useState();
  const [whiteId, setWhiteId] = useState();
  const [blackId, setBlackId] = useState();
  const [whiteTime, setWhiteTime] = useState([["20", "00"]]);
  const [blackTime, setBlackTime] = useState([["20", "00"]]);

  // side effect
  useEffect(() => {
    // api call for getting game data
    axios
      .get(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_GAMES_API_URL}/${gameId}`
      )
      .then((res) => {
        setTournamentId(res.data.data?.tournament_id);
        setVenueId(res.data.data?.venue_id);
        setDate(res.data.data?.date && res.data.data?.date.slice(0, 10));
      })
      .catch((err) => console.log(err));

    // api call for getting player pair data
    axios
      .get(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_PAIRS_API_URL}/${gameId}`
      )
      .then((res) => {
        res.data.data &&
          res.data.data.map((item) => {
            if (item.side === "white") {
              setWhiteId(item.player_id);
            }
            if (item.side === "black") {
              setBlackId(item.player_id);
            }
            return item.player_id;
          });
        console.log(res);
      })
      .catch((err) => console.log(err));

    // api call for getting timer records
    axios
      .get(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_RECORD_POSITIONS_API_URL}/time/${gameId}`
      )
      .then((res) => {
        setWhiteTime(
          res.data.map((item) => {
            return item.white;
          })
        );
        setBlackTime(
          res.data.map((item) => {
            return item.black;
          })
        );
      })
      .catch((err) => console.log(err));

    // set width and height according to reference
    setWidth(refCol.current.offsetWidth);
    setHeight(refCol.current.offsetHeight);
  }, [width, gameId]);

  // render
  return (
    <React.Fragment>
      <GameIdContext.Provider value={gameId}>
        <StepCountContext.Provider
          value={{
            step: step,
            setStep: setStep,
            totalStep: totalStep,
            setTotalStep: setTotalStep,
          }}
        >
          <Container fluid>
            <Row className="justify-content-md-center">
              <Col
                lg="3"
                style={{
                  maxHeight: height,
                  minHeight: height,
                  overflowY: "auto",
                  display: "table",
                }}
              >
                <div
                  style={{
                    display: "table-cell",
                    verticalAlign: "middle",
                  }}
                >
                  <Row className="p-1">
                    <ReplayViewPlayerInfoCard title={whiteId}>
                      <ReplayViewTimer
                        minute={blackTime[step][0]}
                        second={blackTime[step][1]}
                      />
                    </ReplayViewPlayerInfoCard>
                  </Row>
                  <Row className="p-1">
                    <ReplayViewGameInfoCard
                      tournament_id={tournamentId}
                      venue_id={venueId}
                      date={date}
                    />
                  </Row>
                  <Row className="p-1">
                    <ReplayViewPlayerInfoCard title={blackId}>
                      <ReplayViewTimer
                        minute={whiteTime[step][0]}
                        second={whiteTime[step][1]}
                      />
                    </ReplayViewPlayerInfoCard>
                  </Row>
                </div>
              </Col>

              <Col
                className="d-flex justify-content-center rounded"
                style={{ background: "grey" }}
                ref={refCol}
              >
                <ReplayViewChessboardHolder width={width} />
              </Col>

              <Col lg="3 m-1">
                <ReplayViewMovesTable height={height} />
              </Col>
            </Row>
          </Container>
          <ReplayController />
          {/* <div>Cur step: {step}</div>
          <div>Total step: {totalStep}</div> */}
        </StepCountContext.Provider>
      </GameIdContext.Provider>
    </React.Fragment>
  );
}

export default ReplayView;
