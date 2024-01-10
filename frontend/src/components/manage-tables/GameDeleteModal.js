import React, { useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { DeleteModalContext } from "./GameTable";
import axios from "axios";

// Delete Game Modal
function GameDeleteModal() {
  // add states
  const [deleteFail, setDeleteFail] = useState(false);

  // read and subscribe to context
  const modalContext = useContext(DeleteModalContext);

  // function - handle game delete
  const handleDelete = () => {
    console.log(modalContext.deleteId);

    // api call to delete game data
    axios
      .delete(`${process.env.REACT_APP_GAMES_API_URL}/${modalContext.deleteId}`)
      .then((res) => {
        console.log(res);

        // api call to delete position record data
        axios
          .delete(
            `${process.env.REACT_APP_RECORD_POSITIONS_API_URL}/${modalContext.deleteId}`
          )
          .then((res) => {
            console.log(res);

            // api call to delete move record data
            axios
              .delete(
                `${process.env.REACT_APP_RECORD_MOVES_API_URL}/${modalContext.deleteId}`
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
          })
          .catch((err) => {
            setDeleteFail(true);
            console.log(err);
          });
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
          <Modal.Title>Delete Game - id: {modalContext.deleteId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Delete record with game_id {modalContext.deleteId} from 'game'
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

export default GameDeleteModal;
