import React, { useContext, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { LiveIllegalMoveModalContext } from "./Live";
import axios from "axios";

// Form for starting a live
function LiveIllegalMoveModal(props) {
  // destructure props
  const { showIllegalMoveModal, handlePause } = props;

  // read and subscribe to contexts
  const illegalMoveModalContext = useContext(LiveIllegalMoveModalContext);

  // for managing form
  const form = useForm();
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  // function - to close the form modal
  const handleClose = () => {
    illegalMoveModalContext.setShowIllegalMoveModal(false);
  };

  // function - for handling form submission
  const onSubmit = (data) => {
    console.log("Submitted data", data);
    axios
      .patch(`${process.env.REACT_APP_LIVE_INTERACTION_API_URL}`, {
        pawnPromotion: "",
        moveCorrection: data.moveCorrection,
      })
      .then((res) => {
        console.log(res.data);
        illegalMoveModalContext.handlePlay();
        handleClose();
      })
      .catch((err) => console.log(err));
  };

  // function - form error handling
  const onError = (errors) => {
    console.log("Form Error", errors);
  };

  useEffect(() => {
    handlePause();
  }, [showIllegalMoveModal]); // eslint-disable-line react-hooks/exhaustive-deps

  // render
  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal
        show={
          illegalMoveModalContext.showIllegalMoveModal &&
          illegalMoveModalContext.auth
        }
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Move Correction</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="moveCorrection">
              <Form.Label>Correct Move:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter correct move in uci. e.g.: c2c4"
                {...register("moveCorrection", {
                  required: "Correct move is required",
                })}
              />
              <Form.Text className="text-danger">
                {errors.moveCorrection?.message}
              </Form.Text>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Confirm
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default LiveIllegalMoveModal;
