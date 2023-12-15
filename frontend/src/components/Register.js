import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Register Page
function Register() {
  // add states
  const [createFail, setCreateFail] = useState(false);
  const [failMsg, setFailMsg] = useState("Create Unsuccessful.");

  // for navigate programmatically
  const navigate = useNavigate();

  // for managing form
  const form = useForm();
  const { register, handleSubmit, formState, watch } = form;
  const { errors } = formState;

  // watch form field
  const watchPassword = watch("password");
  const watchConfirmPassword = watch("password_confirm");

  // function - handle form submission
  const onSubmit = (data) => {
    // api call for number of admin
    axios
      .get(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_ADMINS_API_URL}/count`
      )
      .then((res) => {
        // only allow register with this method if no admin exist
        if (res.data.data < 1) {
          // authentication api for register
          axios
            .post(
              `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_AUTHENTICATION_API_URL}/register`,
              data
            )
            .then((res) => {
              if (res.data.success === 0) {
                setFailMsg(res.data.message);
                setCreateFail(true);
                return;
              }
              console.log(res);
              setCreateFail(false);
              navigate("/login");
            })
            .catch((err) => {
              setCreateFail(true);
              console.log(err);
            });
        } else {
          setFailMsg("Not allow to register, admin exist");
          setCreateFail(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // function - handle form error
  const onError = (errors) => {
    console.log("Form Error", errors);
  };

  // side effect
  useEffect(() => {
    // api call for number of admin
    axios
      .get(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_ADMINS_API_URL}/count`
      )
      .then((res) => {
        if (res.data.data > 0) {
          // navigate to register page if no admin
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [navigate]);

  // render
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 pb-5 responsive-login-container bg-grey-1">
      <div className="p-3 mb-5 rounded-3 responsive-login bg-grey-2">
        <React.Fragment>
          <h1 className="d-flex justify-content-center">Register</h1>
          <Form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                {...register("name", {
                  required: "Name is required",
                })}
              />
              <Form.Text className="text-red fw-bold">
                {errors.name?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  validate: (fieldValue) => {
                    return (
                      fieldValue === watchConfirmPassword ||
                      "Must be same as Confirm Password"
                    );
                  },
                })}
              />
              <Form.Text className="text-red fw-bold">
                {errors.password?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPasswordConfirm">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                {...register("password_confirm", {
                  required: "Confirm Password is required",
                  validate: (fieldValue) => {
                    return (
                      fieldValue === watchPassword || "Must be same as Password"
                    );
                  },
                })}
              />
              <Form.Text className="text-red fw-bold">
                {errors.password?.message}
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-start">
              <Form.Text className="text-red fw-bold">
                {createFail && failMsg}
              </Form.Text>
            </div>

            <div className="d-flex justify-content-end">
              <Button variant="success" type="submit">
                Register
              </Button>
            </div>
          </Form>
        </React.Fragment>
      </div>
    </div>
  );
}

export default Register;
