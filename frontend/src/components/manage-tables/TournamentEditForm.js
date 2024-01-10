import React, { useState, useEffect, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { EditFormContext } from "./TournamentTable";
import axios from "axios";

// Edit Tournament Form
function TournamentEditForm() {
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
    axios
      .patch(
        `${process.env.REACT_APP_TOURNAMENTS_API_URL}/${formContext.editId}`,
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
    // api call to get tournament data
    axios
      .get(`${process.env.REACT_APP_TOURNAMENTS_API_URL}/${formContext.editId}`)
      .then((res) => {
        setValue("tournament_name", res.data.data?.tournament_name);
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
            Edit Tournament Record - id: {formContext.editId}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="tournament">
              <Form.Label>Tournament name:</Form.Label>
              <Form.Control
                className="mb-1"
                {...register("tournament_name", {
                  required: "Tournament name is required",
                })}
              ></Form.Control>

              <Form.Text className="text-danger">
                {errors.tournament_name?.message}
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

export default TournamentEditForm;
