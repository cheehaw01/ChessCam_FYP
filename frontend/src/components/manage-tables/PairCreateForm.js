import React, { useState, useEffect, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { CreateFormContext } from "./PairTable";
import axios from "axios";

// Create Pair Form
function PairCreateForm() {
  // add states
  const [createFail, setCreateFail] = useState(false);
  const [gamesData, setGamesData] = useState([]);
  const [playersData, setPlayersData] = useState([]);

  // read and subscribe to context
  const formContext = useContext(CreateFormContext);

  // for managing form
  const form = useForm();
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  // function - close create form
  const handleClose = () => {
    formContext.setShowForm(false);
  };

  // function - handle form submission
  const onSubmit = (data) => {
    console.log(data);
    // api call to create new pair data
    axios
      .post(`${process.env.REACT_APP_PAIRS_API_URL}`, data)
      .then((res) => {
        console.log(res);
        if (res.data?.success === 0) {
          alert(res.data?.message);
        }
        setCreateFail(false);
        handleClose();
      })
      .catch((err) => {
        setCreateFail(true);
        console.log(err);
      });
  };

  // function - handle form errors
  const onError = (errors) => {
    console.log("Form Error", errors);
  };

  // side effect
  useEffect(() => {
    // api call to get game data
    axios
      .get(`${process.env.REACT_APP_GAMES_API_URL}/raw`)
      .then((res) => {
        setGamesData(res.data.data);
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
  }, [createFail]);

  // render
  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={formContext.showForm} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Pair</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="game_id">
              <Form.Label>Game Id:</Form.Label>
              <Form.Select
                className="mb-1"
                {...register("game_id", {
                  valueAsNumber: true,
                  required: "Game Id is required",
                })}
              >
                {gamesData.map((data) => (
                  <option value={data.game_id} key={data.game_id}>
                    {data.game_id}
                  </option>
                ))}
              </Form.Select>

              <Form.Text className="text-danger">
                {errors.game_id?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="player_id">
              <Form.Label>Player Name:</Form.Label>
              <Form.Select
                className="mb-1"
                {...register("player_id", {
                  valueAsNumber: true,
                  required: "Player Name is required",
                })}
              >
                {playersData.map((data) => (
                  <option value={data.player_id} key={data.player_id}>
                    {data.player_name}
                  </option>
                ))}
              </Form.Select>

              <Form.Text className="text-danger">
                {errors.player_id?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="side">
              <Form.Label>Side:</Form.Label>
              <Form.Select
                className="mb-1"
                {...register("side", {
                  required: "Player Side is required",
                })}
              >
                <option>white</option>
                <option>black</option>
              </Form.Select>

              <Form.Text className="text-danger">
                {errors.side?.message}
              </Form.Text>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Form.Text className="text-danger">
              {createFail && "Create Unsuccessful."}
            </Form.Text>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Create
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default PairCreateForm;
