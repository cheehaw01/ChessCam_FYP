import React, { useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { DeleteModalContext } from "./TournamentTable";
import axios from "axios";

// Delete Tournament Modal
function TournamentDeleteModal() {
  // add states
  const [deleteFail, setDeleteFail] = useState(false);

  // read and subscribe to context
  const modalContext = useContext(DeleteModalContext);

  // function - handle tournament delete
  const handleDelete = () => {
    console.log(modalContext.deleteId);

    // api call to delete tournament data
    axios
      .delete(
        `${process.env.REACT_APP_TOURNAMENTS_API_URL}/${modalContext.deleteId}`
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
          <Modal.Title>
            Delete Tournament - id: {modalContext.deleteId}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Delete record with tournament_id {modalContext.deleteId} from
            'tournament' table?
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

export default TournamentDeleteModal;
