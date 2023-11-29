import React, { useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { LiveContext, LiveModalContext } from "./Live";
import axios from "axios";

// Modal to Stop Live
function LiveStopModal() {
  // add states
  const [saveFail, setSaveFail] = useState(false);

  // read and subscribe to contexts
  const modalContext = useContext(LiveModalContext);
  const liveContext = useContext(LiveContext);

  // for mananing form
  const form = useForm();
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  // function - handle form submission
  const onSubmit = (data) => {
    console.log(data);
    console.log(modalContext.curGameId);

    // Stop Live
    axios
      .get(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_LIVE_STATUS_API_URL}/pid`
      )
      .then((res) => {
        // api to stop detection process
        axios
          .post(
            `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_DETECTION_API_URL}/stop`,
            res.data
          )
          .then((res) => {
            console.log(res.data);

            // api to reset the live status
            axios
              .delete(
                `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_LIVE_STATUS_API_URL}`
              )
              .then((res) => {
                console.log(res.data);
              })
              .catch((err) => console.log(err));

            // Update game
            axios
              .patch(
                `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_GAMES_API_URL}/${modalContext.curGameId}`,
                {
                  tournament_id: liveContext.curTournamentId,
                  venue_id: liveContext.curVenueId,
                  date: liveContext.curDate,
                  winning_side: data.winning_side,
                }
              )
              .then((res) => {
                console.log(res);
                setSaveFail(false);
                handleClose();
              })
              .catch((err) => {
                setSaveFail(true);
                console.log(err);
              });

            // Update player win count
            axios
              .get(
                `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_PAIRS_API_URL}/${modalContext.curGameId}`
              )
              .then((res) => {
                console.log("pair", res.data.data);
                res.data.data.map((item) => {
                  if (item.side === data.winning_side) {
                    // api call to get player data
                    axios
                      .get(
                        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_PLAYERS_API_URL}/${item.player_id}`
                      )
                      .then((res) => {
                        // api call to update player win count
                        axios
                          .patch(
                            `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_PLAYERS_API_URL}/${item.player_id}`,
                            {
                              player_name: res.data.data.player_name,
                              win_count: res.data.data.win_count + 1,
                              lose_count: res.data.data.lose_count,
                            }
                          )
                          .then((res) => {
                            console.log(res);
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  } else {
                    // api call to get player data
                    axios
                      .get(
                        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_PLAYERS_API_URL}/${item.player_id}`
                      )
                      .then((res) => {
                        // api call to update player lose count
                        axios
                          .patch(
                            `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_PLAYERS_API_URL}/${item.player_id}`,
                            {
                              player_name: res.data.data.player_name,
                              win_count: res.data.data.win_count,
                              lose_count: res.data.data.lose_count + 1,
                            }
                          )
                          .then((res) => {
                            console.log(res);
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }
                  return item.side;
                });
              })
              .catch((err) => {
                console.log(err);
              });

            // Stop Live Timer
            modalContext.setTimerStatus(0);

            // Save Record - position
            axios
              .get(
                `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_LIVE_POSITIONS_API_URL}`
              )
              .then((res) => {
                axios
                  .post(
                    `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_RECORD_POSITIONS_API_URL}/${modalContext.curGameId}`,
                    res.data
                  )
                  .then((res) => {
                    console.log(res.data);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => console.log(err));

            // Save Record - move
            axios
              .get(
                `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_LIVE_MOVES_API_URL}`
              )
              .then((res) => {
                axios
                  .post(
                    `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_RECORD_MOVES_API_URL}/${modalContext.curGameId}`,
                    res.data
                  )
                  .then((res) => {
                    console.log(res.data);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));

    liveContext.setLive(false);
    handleClose();
  };

  // function - handle for error
  const onError = (errors) => {
    console.log("Form Error", errors);
  };

  // function - to close the modal
  const handleClose = () => {
    modalContext.setShowStopModal(false);
  };

  // render
  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={modalContext.showStopModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Save Game?</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="winning_side">
              <Form.Label>Winning Side:</Form.Label>
              <Form.Select
                className="mb-1"
                {...register("winning_side", {
                  required: "Winning side is required",
                })}
              >
                <option>white</option>
                <option>black</option>
              </Form.Select>
              <Form.Text className="text-danger">
                {errors.winning_side?.message}
              </Form.Text>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <p className="text-danger">{saveFail && "Save Unsuccessful."}</p>
            <Button variant="danger" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Stop & Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default LiveStopModal;
