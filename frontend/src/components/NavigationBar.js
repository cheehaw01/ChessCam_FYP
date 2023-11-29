import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

// Navigation Bar
function NavigationBar() {
  // add states
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState(false);

  // current location object
  const location = useLocation();

  // for navigate programmatically
  const navigate = useNavigate();

  // cross-site Access-Control requests with credentials
  axios.defaults.withCredentials = true;

  // function - handle login
  const handleLogin = () => {
    navigate("/login");
  };

  // function - handle logout
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
    // api for authentication
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
  }, [location]);

  // render
  return (
    <Navbar collapseOnSelect expand="lg" className="navbar-bg">
      <Container>
        <Navbar.Brand className="fs-4 navbar-brand" href="/">
          CamChess
        </Navbar.Brand>
        <Navbar.Toggle
          className="border border-light"
          aria-controls="responsive-navbar-nav"
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="m-auto fs-5" activeKey={location.pathname}>
            <Nav.Link className="navbar-link" href="/">
              Home
            </Nav.Link>
            <Nav.Link className="navbar-link" href="/live">
              Live
            </Nav.Link>
            <Nav.Link className="navbar-link" href="/replay">
              Replay
            </Nav.Link>
            <Nav.Link className="navbar-link" href="/manage">
              Manage
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        {auth ? (
          <div>
            <div className="badge bg-info text-wrap mx-2">{name}</div>
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <Button variant="success" onClick={handleLogin}>
            Login
          </Button>
        )}
      </Container>
    </Navbar>
  );

  // return (
  //   <nav>
  //     <Link to="/">Home</Link>
  //     <Link to="live">Live</Link>
  //     <Link to="replay">Replay</Link>
  //     <Link to="manage">Manage</Link>
  //   </nav>
  // );
}

export default NavigationBar;
