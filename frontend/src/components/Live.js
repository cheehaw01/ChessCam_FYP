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
import LivePromotionModal from "./LivePromotionModal";
import LiveIllegalMoveModal from "./LiveIllegalMoveModal";
import axios from "axios";

// create react context
export const LiveContext = React.createContext();
export const LiveFormContext = React.createContext();
export const LiveModalContext = React.createContext();
export const LivePromotionModalContext = React.createContext();
export const LiveIllegalMoveModalContext = React.createContext();

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
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [showIllegalMoveModal, setShowIllegalMoveModal] = useState(false);
  const [curGameId, setCurGameId] = useState();
  const [timerStatus, setTimerStatus] = useState(0);
  const [defaultTimerValues, setDefaultTimerValues] = useState(["20", "00"]);
  const [cameraStart, setCameraStart] = useState(false);
  const [timerClicked, setTimerClicked] = useState(false);
  const [auth, setAuth] = useState(false);

  // cross-site Access-Control requests with credentials
  axios.defaults.withCredentials = true;

  // function - call api to update input instruction
  const handleInputApiCall = () => {
    // Call API for updating input instruction
    axios
      .patch(`${process.env.REACT_APP_INPUT_API_URL}/1`)
      .then((res) => {
        console.log(res.data);
        setTimeout(() => {
          setTimerClicked(false);
        }, 600);
      })
      .catch((err) => console.log(err));
  };

  // function - call api to update time values
  const handlePostTimeApiCall = (turn) => {
    if (auth) {
      // Api call for changing the timer status
      axios
        .post(`${process.env.REACT_APP_LIVE_TIMER_API_URL}/${turn}`)
        .then((res) => {
          console.log(res.data);
          if (turn === 3) {
            // Api call for changing the time value
            axios
              .post(
                `${process.env.REACT_APP_LIVE_TIMER_API_URL}/${turn}`,
                turn === 3
                  ? {
                      time: defaultTimerValues,
                    }
                  : {}
              )
              .then((res) => {
                console.log(res.data);
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    }
  };

  // function - toggle timer
  const handleTimerClick = () => {
    if (cameraStart && !timerClicked) {
      setTimerClicked(true);

      // Call API for updating capture image instruction
      // axios
      //   .patch(`${process.env.REACT_APP_CAMERA_API_URL}/image/1`)
      //   .then((res) => {
      //     console.log(res.data);
      //   })
      //   .catch((err) => console.log(err));

      // 0 - both stop, can start white
      // 1 - black start, white stop
      // 2 - white start, black stop
      // 3 - both stop, can start white
      // 4 - both stop, can start black
      switch (timerStatus) {
        case 3:
        case 0:
          handleInputApiCall();
          handlePostTimeApiCall(1);
          break;
        case 4:
        case 1:
          handleInputApiCall();
          handlePostTimeApiCall(2);
          break;
        case 2:
          handleInputApiCall();
          handlePostTimeApiCall(1);
          break;
        default:
          break;
      }
    }
  };

  // function - handle timer pause
  const handlePause = () => {
    console.log(timerStatus);
    if (timerStatus === 1) {
      handlePostTimeApiCall(4);
    } else if (timerStatus === 2) {
      handlePostTimeApiCall(0);
    }
  };

  // function - handle timer play
  const handlePlay = () => {
    if (timerStatus === 0) {
      handlePostTimeApiCall(2);
    } else if (timerStatus === 4) {
      handlePostTimeApiCall(1);
    }
  };

  // function - handle the white side timer click
  const handleWhiteTimerClick = () => {
    return timerStatus === 0 || timerStatus === 2 || timerStatus === 3
      ? handleTimerClick
      : undefined;
  };

  // function - handle the black side timer click
  const handleBlackTimerClick = () => {
    return timerStatus !== 0 && (timerStatus === 1 || timerStatus === 4)
      ? handleTimerClick
      : undefined;
  };

  // side effect
  useEffect(() => {
    // Keep track the status of live and status of timer for every 1 second
    const liveCheck = setInterval(() => {
      // Call API to read live status
      axios
        .get(`${process.env.REACT_APP_LIVE_STATUS_API_URL}`)
        .then((res) => {
          setLive(res.data.onLive);
        })
        .catch((err) => console.log(err));

      // Call API to read the live time values
      axios
        .get(`${process.env.REACT_APP_LIVE_TIMER_API_URL}`)
        .then((res) => {
          setTimerStatus(res.data.turn);
        })
        .catch((err) => console.log(err));

      // Call API to read live interaction for event trigger
      axios
        .get(`${process.env.REACT_APP_LIVE_INTERACTION_API_URL}`)
        .then((res) => {
          if (res.data.illegalMove) {
            setShowIllegalMoveModal(true);
          } else if (res.data.promotion) {
            setShowPromotionModal(true);
          }
          setCameraStart(res.data.cameraStart);
        })
        .catch((err) => console.log(err));
    }, 1000);

    // Authentication API call
    axios
      .get(`${process.env.REACT_APP_AUTHENTICATION_API_URL}`)
      .then((res) => {
        if (res.data.success === 1) {
          setAuth(true);
        } else {
          setAuth(false);
        }
      })
      .catch((err) => {
        setAuth(false);
        console.log(err);
      });

    // API to retrieve information if a game is on live
    axios
      .get(`${process.env.REACT_APP_LIVE_STATUS_API_URL}`)
      .then((res) => {
        setLive(res.data.onLive);
        setCurGameId(res.data.game_id);

        // Api call to get the game information
        axios
          .get(`${process.env.REACT_APP_GAMES_API_URL}/${res.data.game_id}`)
          .then((res) => {
            console.log("game:", res.data.data);
            setCurTournamentId(res.data.data?.tournament_id);
            setCurVenueId(res.data.data?.venue_id);
            setCurDate(res.data.data?.date && res.data.data?.date.slice(0, 10));
          })
          .catch((err) => console.log(err));

        // Api call to get the player pair information
        axios
          .get(`${process.env.REACT_APP_PAIRS_API_URL}/${res.data.game_id}`)
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
                    title={curBlackPlayerId}
                    timerClick={handleBlackTimerClick}
                    clickable={
                      timerStatus !== 0 &&
                      timerStatus !== 2 &&
                      timerStatus !== 3 &&
                      (timerStatus === 1 || timerStatus === 4) &&
                      cameraStart
                    }
                    auth={auth}
                    timerClicked={timerClicked}
                  >
                    <LiveTimer side="black" />
                  </LivePlayerInfoCard>
                  {/* </button> */}
                </Row>
                <Row className="p-1">
                  <LiveGameInfoCard
                    tournament_id={curTournamentId}
                    venue_id={curVenueId}
                    date={curDate}
                    handlePostTimeApiCall={handlePostTimeApiCall}
                  />
                </Row>
                <Row className="p-1">
                  {/* <button onClick={handleWhiteTimerClick()}> */}
                  <LivePlayerInfoCard
                    title={curWhitePlayerId}
                    timerClick={handleWhiteTimerClick}
                    clickable={
                      (timerStatus === 0 ||
                        timerStatus === 2 ||
                        timerStatus === 3) &&
                      cameraStart
                    }
                    auth={auth}
                    timerClicked={timerClicked}
                  >
                    <LiveTimer side="white" />
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
            handlePostTimeApiCall: handlePostTimeApiCall,
          }}
        >
          <LiveModalContext.Provider
            value={{
              showStopModal: showStopModal,
              setShowStopModal: setShowStopModal,
              curGameId: curGameId,
              setCurGameId: setCurGameId,
              handlePostTimeApiCall: handlePostTimeApiCall,
            }}
          >
            <LiveIllegalMoveModalContext.Provider
              value={{
                showIllegalMoveModal: showIllegalMoveModal,
                setShowIllegalMoveModal: setShowIllegalMoveModal,
                auth: auth,
                handlePlay: handlePlay,
              }}
            >
              <LivePromotionModalContext.Provider
                value={{
                  showPromotionModal: showPromotionModal,
                  setShowPromotionModal: setShowPromotionModal,
                  auth: auth,
                  handlePlay: handlePlay,
                }}
              >
                <LiveController
                  auth={auth}
                  timerStatus={timerStatus}
                  setDefaultTimerValues={setDefaultTimerValues}
                  handlePostTimeApiCall={handlePostTimeApiCall}
                />
                <LiveForm />
                <LiveStopModal />
                <LivePromotionModal
                  showPromotionModal={showPromotionModal}
                  handlePause={handlePause}
                />
                <LiveIllegalMoveModal
                  showIllegalMoveModal={showIllegalMoveModal}
                  handlePause={handlePause}
                />
              </LivePromotionModalContext.Provider>
            </LiveIllegalMoveModalContext.Provider>
          </LiveModalContext.Provider>
        </LiveFormContext.Provider>
      </LiveContext.Provider>
    </React.Fragment>
  );
}

export default Live;
