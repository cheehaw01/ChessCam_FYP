import React, { useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { CreateFormContext } from "./AdminTable";
import axios from "axios";

// Create Admin Form
function AdminCreateForm() {
  // add states
  const [createFail, setCreateFail] = useState(false);
  const [failMsg, setFailMsg] = useState("Create Unsuccessful.");

  // read and subscribe to context
  const formContext = useContext(CreateFormContext);

  // for managing form
  const form = useForm();
  const { register, handleSubmit, formState, watch } = form;
  const { errors } = formState;

  // watch form field
  const watchPassword = watch("password");
  const watchConfirmPassword = watch("password_confirm");

  // function - close form modal
  const handleClose = () => {
    formContext.setShowForm(false);
  };

  // function - handle form submission
  const onSubmit = (data) => {
    // authentication api
    axios
      .post(`${process.env.REACT_APP_AUTHENTICATION_API_URL}/register`, data)
      .then((res) => {
        if (res.data.success === 0) {
          setFailMsg(res.data.message);
          setCreateFail(true);
          return;
        }
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
          <Modal.Title>Create Admin</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Admin Name:</Form.Label>
              <Form.Control
                className="mb-1"
                placeholder="name"
                {...register("name", {
                  required: "Name is required",
                })}
              ></Form.Control>

              <Form.Text className="text-danger">
                {errors.name?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                className="mb-1"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  validate: (fieldValue) => {
                    return (
                      fieldValue === watchConfirmPassword ||
                      "Must be same as Confirm Password"
                    );
                  },
                })}
              ></Form.Control>

              <Form.Text className="text-danger">
                {errors.password?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password_confirm">
              <Form.Label>Confirm Password:</Form.Label>
              <Form.Control
                className="mb-1"
                type="password"
                {...register("password_confirm", {
                  required: "Confirm Password is required",
                  validate: (fieldValue) => {
                    return (
                      fieldValue === watchPassword || "Must be same as Password"
                    );
                  },
                })}
              ></Form.Control>

              <Form.Text className="text-danger">
                {errors.password_confirm?.message}
              </Form.Text>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Form.Text className="text-danger">
              {createFail && failMsg}
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

export default AdminCreateForm;
