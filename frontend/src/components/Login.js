import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Login Page
function Login() {
  // add states
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState("");
  const [loginMsg, setloginMsg] = useState("");
  const [loginProblem, setloginProblem] = useState("");
  const [loggedIn, SetLoggedIn] = useState(false);

  // for navigate programmatically
  const navigate = useNavigate();

  // for managing form
  const form = useForm();
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  // cross-site Access-Control requests with credentials
  axios.defaults.withCredentials = true;

  // function - handle form submission
  const onSubmit = (data) => {
    // api call for login
    axios
      .post(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_AUTHENTICATION_API_URL}/login`,
        data
      )
      .then((res) => {
        console.log(res);
        if (res.data.success === 1) {
          SetLoggedIn(true);
          navigate(-1);
        } else {
          setloginProblem(res.data.reason);
          setloginMsg(res.data.message);
          alert(res.data.message);
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

  // function - handle logout process
  const handleLogout = () => {
    // api call for logout
    axios
      .get(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_AUTHENTICATION_API_URL}/logout`
      )
      .then((res) => {
        window.location.reload(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // side effect
  useEffect(() => {
    // api call for authentication
    axios
      .get(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_AUTHENTICATION_API_URL}`
      )
      .then((res) => {
        if (res.data.success === 1) {
          setAuth(true);
          setName(res.data.name);
        } else {
          setAuth(false);
        }
      })
      .catch((err) => {
        setAuth(false);
        console.log(err);
      });
  }, [loggedIn]);

  // render
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 pb-5 responsive-login-container bg-grey-1">
      <div className="p-3 mb-5 rounded-3 responsive-login bg-grey-2">
        {auth ? (
          <React.Fragment>
            <h1>You Logged In as - {name}</h1>
            <div className="p-2 d-flex justify-content-center">
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <h1 className="d-flex justify-content-center">Login</h1>
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
                  {loginProblem === "name" && loginMsg}
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <Form.Text className="text-red fw-bold">
                  {errors.password?.message}
                  {loginProblem === "password" && loginMsg}
                </Form.Text>
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button variant="success" type="submit">
                  Login
                </Button>
              </div>
            </Form>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default Login;
