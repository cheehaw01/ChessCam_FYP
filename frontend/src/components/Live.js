import React, { useRef, useState, useEffect } from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import LiveChessboardHolder from "./LiveChessboardHolder";
import LiveMovesTable from "./LiveMovesTable";
import LivePlayerInfoCard from "./LivePlayerInfoCard";
import LiveGameInfoCard from "./LiveGameInfoCard";
import LiveController from "./LiveController";
import LiveTimer from "./LiveTimer";
import LiveForm from "./LiveForm";
import LiveStopModal from "./LiveStopModal";
import axios from "axios";

// create react context
export const LiveContext = React.createContext();
export const LiveFormContext = React.createContext();
export const LiveModalContext = React.createContext();

// Live Page
function Live() {
  // to track the chessboard size
  const refCol = useRef();

  // add states
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [live, setLive] = useState(false);
  const [curTournamentId, setCurTournamentId] = useState();
  const [curVenueId, setCurVenueId] = useState();
  const [curWhitePlayerId, setCurWhitePlayerId] = useState();
  const [curBlackPlayerId, setCurBlackPlayerId] = useState();
  const [curDate, setCurDate] = useState();
  const [showForm, setShowForm] = useState(false);
  const [showStopModal, setShowStopModal] = useState(false);
  const [curGameId, setCurGameId] = useState();
  const [timerStatus, setTimerStatus] = useState(0);
  const [timerResetTrigger, setTimerResetTrigger] = useState(false);

  // cross-site Access-Control requests with credentials
  axios.defaults.withCredentials = true;

  // function - toggle timer
  const handleTimerClick = () => {
    // 0 - both stop
    // 1 - black start, white stop
    // 2 - white start, black stop
    switch (timerStatus) {
      case 0:
        setTimerStatus(1);
        break;
      case 1:
        setTimerStatus(2);
        break;
      case 2:
        setTimerStatus(1);
        break;
      default:
        break;
    }

    // api call for changing the timer status
    axios
      .post(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_LIVE_TIMER_API_URL}/${timerStatus}`
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };

  // function - handle the white side timer click
  const handleWhiteTimerClick = () => {
    return timerStatus === 0 || timerStatus === 2
      ? handleTimerClick
      : undefined;
  };

  // function - handle the black side timer click
  const handleBlackTimerClick = () => {
    return timerStatus !== 0 && timerStatus === 1
      ? handleTimerClick
      : undefined;
  };

  // side effect
  useEffect(() => {
    // Keep track the status of live for every 1 second
    const liveCheck = setInterval(() => {
      axios
        .get(
          `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_LIVE_STATUS_API_URL}`
        )
        .then((res) => {
          setLive(res.data.onLive);
        })
        .catch((err) => console.log(err));
    }, 1000);

    // retrieve information if a game is on live
    axios
      .get(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_LIVE_STATUS_API_URL}`
      )
      .then((res) => {
        setLive(res.data.onLive);
        setCurGameId(res.data.game_id);

        // api call to get the game information
        axios
          .get(
            `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_GAMES_API_URL}/${res.data.game_id}`
          )
          .then((res) => {
            console.log("game:", res.data.data);
            setCurTournamentId(res.data.data?.tournament_id);
            setCurVenueId(res.data.data?.venue_id);
            setCurDate(res.data.data?.date && res.data.data?.date.slice(0, 10));
          })
          .catch((err) => console.log(err));

        // api call to get the player pair information
        axios
          .get(
            `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_PAIRS_API_URL}/${res.data.game_id}`
          )
          .then((res) => {
            res.data.data &&
              res.data.data.map((item) => {
                if (item.side === "white") {
                  setCurWhitePlayerId(item.player_id);
                }
                if (item.side === "black") {
                  setCurBlackPlayerId(item.player_id);
                }
                return item.player_id;
              });
            console.log(res);
          })
          .catch((err) => console.log(err));

        console.log(res);
      })
      .catch((err) => console.log(err));

    // set the width & height of chessboard depend on the holder size
    setWidth(refCol.current.offsetWidth);
    setHeight(refCol.current.offsetHeight);

    return () => {
      clearInterval(liveCheck);
    };
  }, [width]);

  return (
    <React.Fragment>
      <LiveContext.Provider
        value={{
          live: live,
          setLive: setLive,
          curTournamentId: curTournamentId,
          setCurTournamentId: setCurTournamentId,
          curVenueId: curVenueId,
          setCurVenueId: setCurVenueId,
          curWhitePlayerId: curWhitePlayerId,
          setCurWhitePlayerId: setCurWhitePlayerId,
          curBlackPlayerId: curBlackPlayerId,
          setCurBlackPlayerId: setCurBlackPlayerId,
          curDate: curDate,
          setCurDate: setCurDate,
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
                  {/* <button onClick={handleBlackTimerClick()}> */}
                  <LivePlayerInfoCard
                    title={curWhitePlayerId}
                    timerClick={handleBlackTimerClick}
                  >
                    <LiveTimer
                      status={timerStatus === 1}
                      turn={timerStatus}
                      setTimerStatus={setTimerStatus}
                      timerResetTrigger={timerResetTrigger}
                      setTimerResetTrigger={setTimerResetTrigger}
                      side="black"
                    />
                  </LivePlayerInfoCard>
                  {/* </button> */}
                </Row>
                <Row className="p-1">
                  <LiveGameInfoCard
                    tournament_id={curTournamentId}
                    venue_id={curVenueId}
                    date={curDate}
                    setTimerResetTrigger={setTimerResetTrigger}
                  />
                </Row>
                <Row className="p-1">
                  {/* <button onClick={handleWhiteTimerClick()}> */}
                  <LivePlayerInfoCard
                    title={curBlackPlayerId}
                    timerClick={handleWhiteTimerClick}
                  >
                    <LiveTimer
                      status={timerStatus === 2}
                      turn={timerStatus}
                      setTimerStatus={setTimerStatus}
                      timerResetTrigger={timerResetTrigger}
                      setTimerResetTrigger={setTimerResetTrigger}
                      side="white"
                    />
                  </LivePlayerInfoCard>
                  {/* </button> */}
                </Row>
              </div>
            </Col>

            <Col
              className="d-flex justify-content-center rounded"
              style={{ background: "grey" }}
              ref={refCol}
            >
              <LiveChessboardHolder width={width} />
            </Col>

            <Col lg="3 m-1">
              <LiveMovesTable height={height} />
            </Col>
          </Row>
        </Container>
        <LiveFormContext.Provider
          value={{
            showForm: showForm,
            setShowForm: setShowForm,
            setTimerResetTrigger: setTimerResetTrigger,
          }}
        >
          <LiveModalContext.Provider
            value={{
              showStopModal: showStopModal,
              setShowStopModal: setShowStopModal,
              curGameId: curGameId,
              setCurGameId: setCurGameId,
              setTimerStatus: setTimerStatus,
            }}
          >
            <LiveController />
            <LiveForm />
            <LiveStopModal />
          </LiveModalContext.Provider>
        </LiveFormContext.Provider>
      </LiveContext.Provider>
    </React.Fragment>
  );
}

export default Live;
