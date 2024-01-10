import React, { useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { CreateFormContext } from "./PlayerTable";
import axios from "axios";

// Create Player Form
function PlayerCreateForm() {
  // add states
  const [createFail, setCreateFail] = useState(false);

  // read and subscribe to context
  const formContext = useContext(CreateFormContext);

  // for managing form
  const form = useForm({
    defaultValues: {
      win_count: 0,
      lose_count: 0,
    },
  });
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  // function - close create form
  const handleClose = () => {
    formContext.setShowForm(false);
  };

  // function - handle form submission
  const onSubmit = (data) => {
    console.log(data);
    // api call to create new player data
    axios
      .post(`${process.env.REACT_APP_PLAYERS_API_URL}`, data)
      .then((res) => {
        console.log(res);
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

  // render
  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={formContext.showForm} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Player</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="player">
              <Form.Label>Player Name:</Form.Label>
              <Form.Control
                className="mb-1"
                placeholder="new player name"
                {...register("player_name", {
                  required: "Player name is required",
                })}
              ></Form.Control>

              <Form.Text className="text-danger">
                {errors.player_name?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="win_count">
              <Form.Label>Win Count:</Form.Label>
              <Form.Control
                className="mb-1"
                type="number"
                {...register("win_count", {
                  valueAsNumber: true,
                  required: "Win count is required",
                })}
              ></Form.Control>

              <Form.Text className="text-danger">
                {errors.win_count?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="lose_count">
              <Form.Label>Lose Count:</Form.Label>
              <Form.Control
                className="mb-1"
                type="number"
                {...register("lose_count", {
                  valueAsNumber: true,
                  required: "Lose count is required",
                })}
              ></Form.Control>

              <Form.Text className="text-danger">
                {errors.lose_count?.message}
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

export default PlayerCreateForm;
