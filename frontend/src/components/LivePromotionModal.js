import React, { useContext, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { LivePromotionModalContext } from "./Live";
import axios from "axios";

// Form for input pawn promotion
function LivePromotionModal(props) {
  // destructure props
  const { showPromotionModal, handlePause } = props;

  // constant
  const promotionPieces = ["Queen", "Rook", "Bishop", "Knight"];

  // read and subscribe to contexts
  const promotionModalContext = useContext(LivePromotionModalContext);

  // for managing form
  const form = useForm();
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  // function - to close the form modal
  const handleClose = () => {
    promotionModalContext.setShowPromotionModal(false);
  };

  // function - for handling form submission
  const onSubmit = (data) => {
    console.log("Submitted data", data);
    axios
      .patch(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_LIVE_INTERACTION_API_URL}`,
        {
          pawnPromotion: data.pawnPromotion,
          moveCorrection: "",
        }
      )
      .then((res) => {
        console.log(res.data);
        promotionModalContext.handlePlay();
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
  }, [showPromotionModal]); // eslint-disable-line react-hooks/exhaustive-deps

  // render
  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal
        show={
          promotionModalContext.showPromotionModal && promotionModalContext.auth
        }
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Pawn Promotion</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="pawnPromotion">
              <Form.Label>New Piece:</Form.Label>
              <Form.Select
                className="mb-1"
                {...register("pawnPromotion", {
                  required: "New piece is required",
                })}
              >
                {promotionPieces.map((data, index) => (
                  <option key={index} value={data}>
                    {data}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-danger">
                {errors.pawnPromotion?.message}
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

export default LivePromotionModal;
