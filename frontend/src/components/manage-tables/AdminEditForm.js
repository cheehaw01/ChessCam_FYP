import React, { useState, useEffect, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { EditFormContext } from "./AdminTable";
import axios from "axios";

// Edit Admin Form
function AdminEditForm() {
  // add states
  const [editFail, setEditFail] = useState(false);
  const [failMsg, setFailMsg] = useState("Update Unsuccessful.");

  // read and subscribe to context
  const formContext = useContext(EditFormContext);

  // for managing form
  const form = useForm();
  const { register, handleSubmit, formState, watch, setValue } = form;
  const { errors } = formState;

  // watch form field
  const watchNewPassword = watch("new_password");
  const watchConfirmNewPassword = watch("new_password_confirm");

  // function - close the edit form
  const handleClose = () => {
    formContext.setShowForm(false);
  };

  // function - handle form submission
  const onSubmit = (data) => {
    console.log(data);
    // api call to update admin data
    axios
      .patch(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_ADMINS_API_URL}/${formContext.editId}`,
        data
      )
      .then((res) => {
        if (res.data.success === 0) {
          setEditFail(true);
          setFailMsg(res.data.message);
          return;
        }
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
    // api call to get admin data
    axios
      .get(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_ADMINS_API_URL}/${formContext.editId}`
      )
      .then((res) => {
        setValue("name", res.data.data?.name);
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
          <Modal.Title>Edit Admin</Modal.Title>
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

            <Form.Group className="mb-3" controlId="old_password">
              <Form.Label>Old Password:</Form.Label>
              <Form.Control
                className="mb-1"
                type="password"
                {...register("old_password", {
                  required: "Old Password is required",
                })}
              ></Form.Control>

              <Form.Text className="text-danger">
                {errors.old_password?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="new_password">
              <Form.Label>New Password:</Form.Label>
              <Form.Control
                className="mb-1"
                type="password"
                {...register("new_password", {
                  required: "New Password is required",
                  validate: (fieldValue) => {
                    return (
                      fieldValue === watchConfirmNewPassword ||
                      "Must be same as Confirm New Password"
                    );
                  },
                })}
              ></Form.Control>

              <Form.Text className="text-danger">
                {errors.new_password?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="new_password_confirm">
              <Form.Label>Confirm New Password:</Form.Label>
              <Form.Control
                className="mb-1"
                type="password"
                {...register("new_password_confirm", {
                  required: "Confirm Password is required",
                  validate: (fieldValue) => {
                    return (
                      fieldValue === watchNewPassword ||
                      "Must be same as New Password"
                    );
                  },
                })}
              ></Form.Control>

              <Form.Text className="text-danger">
                {errors.new_password_confirm?.message}
              </Form.Text>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Form.Text className="text-danger">{editFail && failMsg}</Form.Text>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Edit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default AdminEditForm;
