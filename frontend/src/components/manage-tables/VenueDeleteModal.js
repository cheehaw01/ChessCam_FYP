import React, { useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { DeleteModalContext } from "./VenueTable";
import axios from "axios";

// Delete Venue Modal
function VenueDeleteModal() {
  // add states
  const [deleteFail, setDeleteFail] = useState(false);

  // read and subscribe to context
  const modalContext = useContext(DeleteModalContext);

  // function - handle venue delete
  const handleDelete = () => {
    console.log(modalContext.deleteId);
    // api call to delete venue data
    axios
      .delete(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_VENUES_API_URL}/${modalContext.deleteId}`
      )
      .then((res) => {
        console.log(res);
        setDeleteFail(false);
        handleClose();
      })
      .catch((err) => {
        setDeleteFail(true);
        console.log(err);
      });
  };

  // function - close delete modal
  const handleClose = () => {
    modalContext.setShowModal(false);
  };

  // render
  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={modalContext.showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Venue - id: {modalContext.deleteId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Delete record with venue_id {modalContext.deleteId} from 'venue'
            table?
          </p>
        </Modal.Body>

        <Modal.Footer>
          <p className="text-danger">{deleteFail && "Delete Unsuccessful."}</p>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default VenueDeleteModal;
