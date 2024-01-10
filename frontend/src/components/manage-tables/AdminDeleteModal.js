import React, { useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { DeleteModalContext } from "./AdminTable";
import axios from "axios";

// Delete Admin Modal
function AdminDeleteModal() {
  // add states
  const [deleteFail, setDeleteFail] = useState(false);

  // read and subscribe to context
  const modalContext = useContext(DeleteModalContext);

  // for managing form
  const form = useForm();
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  // function - handle form submission
  const onSubmit = (data) => {
    // api call to delete admin data
    axios
      .delete(
        `${process.env.REACT_APP_ADMINS_API_URL}/${modalContext.deleteId}`,
        { data: data }
      )
      .then((res) => {
        if (res.data.success === 0) {
          setDeleteFail(true);
          return;
        }
        console.log(res);
        setDeleteFail(false);
        handleClose();
      })
      .catch((err) => {
        setDeleteFail(true);
        console.log(err);
      });
  };

  // function - handle form errors
  const onError = (errors) => {
    console.log("Form Error", errors);
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
          <Modal.Title>Delete Admin - id: {modalContext.deleteId}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <Modal.Body>
            <h5>Enter Password of this Admin to Delete</h5>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                className="mb-1"
                type="password"
                {...register("password", {
                  required: "Password is required",
                })}
              ></Form.Control>

              <Form.Text className="text-danger">
                {errors.password?.message}
              </Form.Text>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Form.Text className="text-danger">
              {deleteFail && "Delete Unsuccessful"}
            </Form.Text>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="danger" type="submit">
              Delete
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default AdminDeleteModal;
