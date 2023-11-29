import React, { useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { CreateFormContext } from "./VenueTable";
import axios from "axios";

// Create Venue Form
function VenueCreateForm() {
  // add states
  const [createFail, setCreateFail] = useState(false);

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

    // api call to create new venue data
    axios
      .post(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_VENUES_API_URL}`,
        data
      )
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
          <Modal.Title>Create New Venue</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="tournament">
              <Form.Label>Venue Name:</Form.Label>
              <Form.Control
                className="mb-1"
                placeholder="new venue name"
                {...register("venue_name", {
                  required: "Venue name is required",
                })}
              ></Form.Control>

              <Form.Text className="text-danger">
                {errors.venue_name?.message}
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

export default VenueCreateForm;
