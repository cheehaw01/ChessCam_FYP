import React, { useState, useEffect, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { EditFormContext } from "./PairTable";
import axios from "axios";

// Edit Pair Form
function PairEditForm() {
  // add states
  const [editFail, setEditFail] = useState(false);
  const [playersData, setPlayersData] = useState([]);

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
    // api call to update pair data
    axios
      .patch(
        `${process.env.REACT_APP_PAIRS_API_URL}/${formContext.editId.game_id}`,
        { ...data, player_id: formContext.editId.player_id }
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
    // api call to get pair data
    axios
      .get(
        `${process.env.REACT_APP_PAIRS_API_URL}/${formContext.editId.game_id}`
      )
      .then((res) => {
        setValue("new_player_id", formContext.editId.player_id);
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
            Edit Pair Record - id: {formContext.editId.game_id}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="new_player_id">
              <Form.Label>Player Name:</Form.Label>
              <Form.Select
                className="mb-1"
                {...register("new_player_id", {
                  valueAsNumber: true,
                  required: "Player name is required",
                })}
              >
                {playersData.map((data) => (
                  <option value={data.player_id} key={data.player_id}>
                    {data.player_name}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-danger">
                {errors.new_player_id?.message}
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

export default PairEditForm;
