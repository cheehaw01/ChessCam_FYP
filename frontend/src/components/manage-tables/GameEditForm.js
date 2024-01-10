import React, { useState, useEffect, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { EditFormContext } from "./GameTable";
import axios from "axios";

// Edit Game Form
function GameEditForm() {
  // add states
  const [tournamentsData, setTournamentsData] = useState([]);
  const [venuesData, setVenuesData] = useState([]);
  const [playersData, setPlayersData] = useState([]);
  const [editFail, setEditFail] = useState(false);
  const [game, setGame] = useState({});
  const [pair, setPair] = useState([]);
  const [pairWhiteId, setPairWhiteId] = useState([]);
  const [pairBlackId, setPairBlackId] = useState([]);

  // read and subscribe to context
  const formContext = useContext(EditFormContext);

  // for managing form
  const form = useForm();
  const { register, handleSubmit, formState, watch, setValue } = form;
  const { errors } = formState;

  // watch edit form fields
  const watchPlayerWhite = watch("playerWhite_id");
  const watchPlayerBlack = watch("playerBlack_id");

  // function - close edit form
  const handleClose = () => {
    formContext.setShowForm(false);
  };

  // function - handle form submission
  const onSubmit = (data) => {
    console.log(data);

    // api call to update game data
    axios
      .patch(
        `${process.env.REACT_APP_GAMES_API_URL}/${formContext.editId}`,
        data
      )
      .then((res) => {
        console.log(res);
        // api call to update pair data
        axios
          .patch(
            `${process.env.REACT_APP_PAIRS_API_URL}/${formContext.editId}`,
            {
              player_id: pairWhiteId,
              new_player_id: data.playerWhite_id,
              side: "white",
            }
          )
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });

        // api call to update pair data
        axios
          .patch(
            `${process.env.REACT_APP_PAIRS_API_URL}/${formContext.editId}`,
            {
              player_id: pairBlackId,
              new_player_id: data.playerBlack_id,
              side: "black",
            }
          )
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });

        setEditFail(false);
        handleClose();
      })
      .catch((err) => {
        setEditFail(true);
        console.log(err);
      });
  };

  // function - handle form errors
  const onError = (errors) => {
    console.log("Form Error", errors);
  };

  // side effect
  useEffect(() => {
    // api call to get tournament data
    axios
      .get(`${process.env.REACT_APP_TOURNAMENTS_API_URL}`)
      .then((res) => {
        setTournamentsData(res.data.data);
        console.log(res);
      })
      .catch((err) => console.log(err));

    // api call to get venue data
    axios
      .get(`${process.env.REACT_APP_VENUES_API_URL}`)
      .then((res) => {
        setVenuesData(res.data.data);
        console.log(res);
      })
      .catch((err) => console.log(err));

    // api call to get players data
    axios
      .get(`${process.env.REACT_APP_PLAYERS_API_URL}`)
      .then((res) => {
        setPlayersData(res.data.data);
        console.log(res);
      })
      .catch((err) => console.log(err));

    // api call to get game data
    axios
      .get(`${process.env.REACT_APP_GAMES_API_URL}/${formContext.editId}`)
      .then((res) => {
        // set form values for current game
        setGame(res.data.data);
        setValue("tournament_id", game?.tournament_id);
        setValue("venue_id", game?.venue_id);
        setValue("date", game?.date && game?.date.slice(0, 10));
        setValue("winning_side", game?.winning_side);
        console.log(res);
      })
      .catch((err) => console.log(err));

    // api call to get pair data
    axios
      .get(`${process.env.REACT_APP_PAIRS_API_URL}/${formContext.editId}`)
      .then((res) => {
        setPair(res.data.data);
        pair &&
          pair.map((item) => {
            if (item.side === "white") {
              setPairWhiteId(item.player_id);
              setValue("playerWhite_id", item.player_id);
            }
            if (item.side === "black") {
              setPairBlackId(item.player_id);
              setValue("playerBlack_id", item.player_id);
            }
            return item.player_id;
          });
        console.log(res);
      })
      .catch((err) => console.log(err));
  }, [editFail, formContext]); // eslint-disable-line react-hooks/exhaustive-deps

  // render
  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={formContext.showForm} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Game Record - id: {formContext.editId}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="tournament">
              <Form.Label>Tournament:</Form.Label>
              <Form.Select
                className="mb-1"
                {...register("tournament_id", {
                  valueAsNumber: true,
                  required: "Tournament name is required",
                })}
              >
                {tournamentsData.map((data) => (
                  <option value={data.tournament_id} key={data.tournament_id}>
                    {data.tournament_name}
                  </option>
                ))}
              </Form.Select>

              <Form.Text className="text-danger">
                {errors.tournament_id?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="venue">
              <Form.Label>Venue:</Form.Label>
              <Form.Select
                className="mb-1"
                {...register("venue_id", {
                  valueAsNumber: true,
                  required: "Venue name is required",
                })}
              >
                {venuesData.map((data) => (
                  <option value={data.venue_id} key={data.venue_id}>
                    {data.venue_name}
                  </option>
                ))}
              </Form.Select>

              <Form.Text className="text-danger">
                {errors.venue_id?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="date">
              <Form.Label>Date:</Form.Label>
              <Form.Control
                type="date"
                className="mb-1"
                {...register("date", {
                  required: "date is required",
                })}
              ></Form.Control>
              <Form.Text className="text-danger">
                {errors.date?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="player1">
              <Form.Label>Player White:</Form.Label>
              <Form.Select
                className="mb-1"
                {...register("playerWhite_id", {
                  valueAsNumber: true,
                  required: "Player name is required",
                  validate: (fieldValue) => {
                    return (
                      fieldValue !== watchPlayerBlack ||
                      "Players should not be the same"
                    );
                  },
                })}
              >
                {playersData.map((data) => (
                  <option value={data.player_id} key={data.player_id}>
                    {data.player_name}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-danger">
                {errors.playerWhite_id?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="player2">
              <Form.Label>Player Black:</Form.Label>
              <Form.Select
                className="mb-1"
                {...register("playerBlack_id", {
                  valueAsNumber: true,
                  required: "Player name is required",
                  validate: (fieldValue) => {
                    return (
                      fieldValue !== watchPlayerWhite ||
                      "Players should not be the same"
                    );
                  },
                })}
              >
                {playersData.map((data) => (
                  <option value={data.player_id} key={data.player_id}>
                    {data.player_name}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-danger">
                {errors.playerBlack_id?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="winning_side">
              <Form.Label>Winning Side:</Form.Label>
              <Form.Select
                className="mb-1"
                {...register("winning_side", {
                  required: "Winning side is required",
                })}
              >
                <option>black</option>
                <option>white</option>
              </Form.Select>
              <Form.Text className="text-danger">
                {errors.winning_side?.message}
              </Form.Text>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Form.Text className="text-danger">
              {editFail && "Update Unsuccessful."}
            </Form.Text>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Apply
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default GameEditForm;
