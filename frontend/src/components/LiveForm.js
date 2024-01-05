import React, { useState, useEffect, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
// import { DevTool } from "@hookform/devtools";
import { LiveContext, LiveFormContext, LiveModalContext } from "./Live";
import axios from "axios";

// Form for starting a live
function LiveForm() {
  // add states
  const [tournamentsData, setTournamentsData] = useState([]);
  const [venuesData, setVenuesData] = useState([]);
  const [playersData, setPlayersData] = useState([]);
  const [createFail, setCreateFail] = useState(false);

  // read and subscribe to contexts
  const formContext = useContext(LiveFormContext);
  const liveContext = useContext(LiveContext);
  const modalContext = useContext(LiveModalContext);

  // for managing form
  const form = useForm();
  const { register, handleSubmit, formState, watch } = form;
  const { errors } = formState;

  // function - to close the form modal
  const handleClose = () => {
    formContext.setShowForm(false);
  };

  // Create Promises
  // promise for adding new tournament
  const newTournamentPromise = (
    tournamentCheck,
    tournament_name,
    tournament_id
  ) => {
    return new Promise((resolve, reject) => {
      if (tournamentCheck) {
        axios
          .post(
            `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_TOURNAMENTS_API_URL}`,
            {
              tournament_name: tournament_name,
            }
          )
          .then((res) => {
            console.log(res);
            resolve(res.data.data.tournament_id); // fulfilled
          })
          .catch((err) => {
            console.log(err);
            reject(); // rejected
          });
      } else {
        resolve(tournament_id);
      }
    });
  };

  // promise for adding new venue
  const newVenuePromise = (venueCheck, venue_name, venue_id) => {
    return new Promise((resolve, reject) => {
      if (venueCheck) {
        axios
          .post(
            `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_VENUES_API_URL}`,
            {
              venue_name: venue_name,
            }
          )
          .then((res) => {
            console.log(res);
            resolve(res.data.data.venue_id); // fulfilled
          })
          .catch((err) => {
            console.log(err);
            reject(); // rejected
          });
      } else {
        resolve(venue_id);
      }
    });
  };

  // promise for adding new player
  const newPlayerPromise = (playerCheck, player_name, player_id) => {
    return new Promise((resolve, reject) => {
      if (playerCheck) {
        axios
          .post(
            `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_PLAYERS_API_URL}`,
            {
              player_name: player_name,
              win_count: 0,
              lose_count: 0,
            }
          )
          .then((res) => {
            console.log(res);
            resolve(res.data.data.player_id); // fulfilled
          })
          .catch((err) => {
            console.log(err);
            reject(); // rejected
          });
      } else {
        resolve(player_id);
      }
    });
  };

  // function - for handling form submission
  const onSubmit = (data) => {
    // console.log("Submitted data", data);

    Promise.all([
      newTournamentPromise(
        data.tournamentCheck,
        data.tournament,
        data.tournamentSelect
      ),
      newVenuePromise(data.venueCheck, data.venue, data.venueSelect),
      newPlayerPromise(data.player1Check, data.player1, data.player1Select),
      newPlayerPromise(data.player2Check, data.player2, data.player2Select),
    ])
      .then((values) => {
        console.log(values);
        var curDate = new Date().toJSON().slice(0, 10);
        console.log(curDate);
        // set the information for display
        liveContext.setCurTournamentId(values[0]);
        liveContext.setCurVenueId(values[1]);
        liveContext.setCurWhitePlayerId(values[2]);
        liveContext.setCurBlackPlayerId(values[3]);
        liveContext.setCurDate(curDate);

        // Reset Live Timer
        formContext.handlePostTimeApiCall(3);

        // Reset Temp Live Position
        axios
          .delete(
            `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_LIVE_POSITIONS_API_URL}`
          )
          .then((res) => {
            console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
          });

        // Reset Temp Live Move
        axios
          .delete(
            `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_LIVE_MOVES_API_URL}`
          )
          .then((res) => {
            console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
          });

        // Create Input Instruction
        axios
          .post(
            `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_INPUT_API_URL}`
          )
          .then((res) => {
            console.log(res.data);
          })
          .catch((err) => console.log(err));

        // Reset Live Interaction
        axios
          .post(
            `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_LIVE_INTERACTION_API_URL}`
          )
          .then((res) => {
            console.log(res.data);
          })
          .catch((err) => console.log(err));

        // Create game
        axios
          .post(
            `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_GAMES_API_URL}`,
            {
              tournament_id: values[0],
              venue_id: values[1],
              date: curDate,
              winning_side: "live",
            }
          )
          .then((res) => {
            console.log(res);
            modalContext.setCurGameId(res.data.data.game_id);

            // Create Pairs
            axios
              .post(
                `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_PAIRS_API_URL}`,
                {
                  game_id: res.data.data.game_id,
                  player_id: values[2],
                  side: "white",
                }
              )
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              });
            axios
              .post(
                `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_PAIRS_API_URL}`,
                {
                  game_id: res.data.data.game_id,
                  player_id: values[3],
                  side: "black",
                }
              )
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              });

            // Run Python for detection
            axios
              .post(
                `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_DETECTION_API_URL}`,
                {
                  game_id: res.data.data.game_id,
                  camera_angle: data.cameraAngle,
                  camera_ip: data.cameraIP,
                }
              )
              .then((res) => {
                console.log(res.data);
                // simulate api set onLive true
              })
              .catch((err) => console.log(err));

            setCreateFail(false);
            handleClose();
          })
          .catch((err) => {
            setCreateFail(true);
            console.log(err);
          });

        handleClose();
        liveContext.setLive(true);
      })
      .catch(() => {
        setCreateFail(true);
        console.log("Promises error");
      });
  };

  // function - form error handling
  const onError = (errors) => {
    console.log("Form Error", errors);
  };

  // watch form condition
  const watchTournamentCheck = watch("tournamentCheck");
  const watchVenueCheck = watch("venueCheck");
  const watchPlayer1Check = watch("player1Check");
  const watchPlayer2Check = watch("player2Check");
  const watchPlayer1Select = watch("player1Select");
  const watchPlayer2Select = watch("player2Select");

  // side effect
  useEffect(() => {
    // api call for getting tournament data
    axios
      .get(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_TOURNAMENTS_API_URL}`
      )
      .then((res) => {
        setTournamentsData(res.data.data);
        console.log(res);
      })
      .catch((err) => console.log(err));

    // api call for getting venue data
    axios
      .get(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_VENUES_API_URL}`
      )
      .then((res) => {
        setVenuesData(res.data.data);
        console.log(res);
      })
      .catch((err) => console.log(err));

    // api call for getting player data
    axios
      .get(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_PLAYERS_API_URL}`
      )
      .then((res) => {
        setPlayersData(res.data.data);
        console.log(res);
      })
      .catch((err) => console.log(err));
  }, [formContext]);

  // render
  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={formContext.showForm} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Live Information</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="tournament">
              <Form.Label>Tournament:</Form.Label>
              <Form.Select
                className="mb-1"
                // disabled={watchTournamentCheck}
                {...register("tournamentSelect", {
                  required: "Tournament name is required",
                  valueAsNumber: true,
                  disabled: watchTournamentCheck,
                })}
              >
                {tournamentsData.map((data) => (
                  <option key={data.tournament_id} value={data.tournament_id}>
                    {data.tournament_name}
                  </option>
                ))}
              </Form.Select>
              <Form.Check
                type="checkbox"
                label="New Tournament Name"
                {...register("tournamentCheck")}
              />
              {watchTournamentCheck && (
                <Form.Control
                  type="text"
                  placeholder="Enter tournament name"
                  {...register("tournament", {
                    required: "Tournament name is required",
                  })}
                />
              )}
              <Form.Text className="text-danger">
                {errors.tournament?.message}
                {errors.tournamentSelect?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="venue">
              <Form.Label>Venue:</Form.Label>
              <Form.Select
                className="mb-1"
                // disabled={watchVenueCheck}
                {...register("venueSelect", {
                  required: "Venue name is required",
                  valueAsNumber: true,
                  disabled: watchVenueCheck,
                })}
              >
                {venuesData.map((data) => (
                  <option key={data.venue_id} value={data.venue_id}>
                    {data.venue_name}
                  </option>
                ))}
              </Form.Select>
              <Form.Check
                type="checkbox"
                label="New Venue Name"
                {...register("venueCheck")}
              />
              {watchVenueCheck && (
                <Form.Control
                  type="text"
                  placeholder="Enter venue name"
                  {...register("venue", {
                    required: "Venue name is required",
                  })}
                />
              )}
              <Form.Text className="text-danger">
                {errors.venue?.message}
                {errors.venueSelect?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="player1">
              <Form.Label>Player (white):</Form.Label>
              <Form.Select
                className="mb-1"
                // disabled={watchPlayer1Check}
                {...register("player1Select", {
                  required: "Player name is required",
                  valueAsNumber: true,
                  disabled: watchPlayer1Check,
                  validate: (fieldValue) => {
                    return (
                      fieldValue !== watchPlayer2Select ||
                      "Players should not be the same"
                    );
                  },
                })}
              >
                {playersData.map((data) => (
                  <option key={data.player_id} value={data.player_id}>
                    {data.player_name}
                  </option>
                ))}
              </Form.Select>
              <Form.Check
                type="checkbox"
                label="New Player Name"
                {...register("player1Check")}
              />
              {watchPlayer1Check && (
                <Form.Control
                  type="text"
                  placeholder="Enter white piece player name"
                  {...register("player1", {
                    required: "Player name is required",
                  })}
                />
              )}
              <Form.Text className="text-danger">
                {errors.player1?.message}
                {errors.player1Select?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="player2">
              <Form.Label>Player (black):</Form.Label>
              <Form.Select
                className="mb-1"
                // disabled={watchPlayer2Check}
                {...register("player2Select", {
                  required: "Player name is required",
                  valueAsNumber: true,
                  disabled: watchPlayer2Check,
                  validate: (fieldValue) => {
                    return (
                      fieldValue !== watchPlayer1Select ||
                      "Players should not be the same"
                    );
                  },
                })}
              >
                {playersData.map((data) => (
                  <option key={data.player_id} value={data.player_id}>
                    {data.player_name}
                  </option>
                ))}
              </Form.Select>
              <Form.Check
                type="checkbox"
                label="New Player Name"
                {...register("player2Check")}
              />
              {watchPlayer2Check && (
                <Form.Control
                  type="text"
                  placeholder="Enter black piece player name"
                  {...register("player2", {
                    required: "Player name is required",
                  })}
                />
              )}
              <Form.Text className="text-danger">
                {errors.player2?.message}
                {errors.player2Select?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="cameraAngle">
              <Form.Label>Camera Angle:</Form.Label>
              <Form.Select
                className="mb-1"
                // disabled={watchPlayer2Check}
                {...register("cameraAngle", {
                  required: "Camera angle is required",
                })}
              >
                <option key={0}>Top</option>
                <option key={1}>Side</option>
              </Form.Select>
              <Form.Text className="text-danger">
                {errors.cameraAngle?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="cameraIP">
              <Form.Label>Camera IP address:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter camera IP address."
                {...register("cameraIP", {
                  required: "Camera IP address is required",
                  pattern: {
                    value:
                      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                    message: "invalid ip address",
                  },
                })}
              />
              <Form.Text className="text-danger">
                {errors.cameraIP?.message}
              </Form.Text>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Form.Text className="text-danger">
              {createFail && "Failed to Create Record"}
            </Form.Text>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Start
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* <DevTool control={control} /> */}
    </div>
  );
}

export default LiveForm;
