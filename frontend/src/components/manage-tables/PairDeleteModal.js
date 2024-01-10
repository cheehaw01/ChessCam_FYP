import React, { useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { DeleteModalContext } from "./PairTable";
import axios from "axios";

// Delete Pair Form
function PairDeleteModal() {
  // add states
  const [deleteFail, setDeleteFail] = useState(false);

  // read and subscribe to context
  const modalContext = useContext(DeleteModalContext);

  // function - handle pair delete
  const handleDelete = () => {
    console.log(modalContext.deleteId);

    // api call to delete pair data
    axios
      .delete(
        `${process.env.REACT_APP_PAIRS_API_URL}/${modalContext.deleteId.game_id}`,
        { data: { player_id: modalContext.deleteId.player_id } }
      )
      .then((res) => {
        console.log(res);
        if (res.data?.success === 0) {
          alert(res.data?.message);
        }
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
            Delete Pair - game_id: {modalContext.deleteId.game_id} & player_id:{" "}
            {modalContext.deleteId.player_id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Delete record with game_id {modalContext.deleteId.game_id} &
            player_id {modalContext.deleteId.player_id} from 'pair' table?
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

export default PairDeleteModal;
