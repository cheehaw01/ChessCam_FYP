import React, { useState, useEffect, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { EditFormContext } from "./PlayerTable";
import axios from "axios";

// Edit Player Form
function PlayerEditForm() {
  // add states
  const [editFail, setEditFail] = useState(false);

  // read and subscribe to context
  const formContext = useContext(EditFormContext);

  // for managing form
  const form = useForm();
  const { register, handleSubmit, formState, setValue } = form;
  const { errors } = formState;

  // function - close edit form
  const handleClose = () => {
    formContext.setShowForm(false);
  };

  // function - handle form submission
  const onSubmit = (data) => {
    console.log(data);
    // api call to update player data
    axios
      .patch(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_PLAYERS_API_URL}/${formContext.editId}`,
        data
      )
      .then((res) => {
        console.log(res);
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
    // api call to get player data
    axios
      .get(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_PLAYERS_API_URL}/${formContext.editId}`
      )
      .then((res) => {
        setValue("player_name", res.data.data?.player_name);
        setValue("win_count", res.data.data?.win_count);
        setValue("lose_count", res.data.data?.lose_count);
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
          <Modal.Title>
            Edit Player Record - id: {formContext.editId}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="venue">
              <Form.Label>Player name:</Form.Label>
              <Form.Control
                className="mb-1"
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

export default PlayerEditForm;
