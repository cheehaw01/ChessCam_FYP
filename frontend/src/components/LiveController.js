import React, { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import { LiveContext, LiveFormContext, LiveModalContext } from "./Live";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Container that hold input elements for live
function LiveController() {
  // add states
  const [auth, setAuth] = useState(false);

  // read and subsribe to contexts
  const liveContext = useContext(LiveContext);
  const formContext = useContext(LiveFormContext);
  const modalContext = useContext(LiveModalContext);

  // use to navigate page
  const navigate = useNavigate();

  // function - show form for starting live
  const handleOpen = () => {
    formContext.setShowForm(true);
  };

  // function - show modal for stopping live
  const handleStop = () => {
    modalContext.setShowStopModal(true);
  };

  // function - navigate to login page
  const handleLogin = () => {
    navigate("/login");
  };

  // side effect
  useEffect(() => {
    // authentication api call
    axios
      .get(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_AUTHENTICATION_API_URL}`
      )
      .then((res) => {
        if (res.data.success === 1) {
          setAuth(true);
        } else {
          setAuth(false);
        }
      })
      .catch((err) => {
        setAuth(false);
        console.log(err);
      });
  }, []);

  return (
    <Container fluid>
      <Row
        className="m-2 p-3 border border-2 rounded-2 border-secondary"
        style={{ background: "#818286" }}
      >
        <Col
          className="text-center"
          xs={{ span: 3 }}
          md={{ span: 2, offset: 5 }}
        >
          {auth ? (
            <React.Fragment>
              {liveContext.live === false && (
                <React.Fragment>
                  <h5>No Live Now</h5>
                  <Button
                    variant="primary"
                    onClick={handleOpen}
                    className="border-black"
                  >
                    Start
                  </Button>
                </React.Fragment>
              )}
              {liveContext.live && (
                <Button
                  variant="danger"
                  onClick={handleStop}
                  className="border-black"
                >
                  Stop
                </Button>
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {liveContext.live === false && (
                <React.Fragment>
                  <h5>No Live Now</h5>
                </React.Fragment>
              )}
              {liveContext.live && (
                <React.Fragment>
                  <h5>Live Now</h5>
                </React.Fragment>
              )}
              <Button
                variant="success"
                onClick={handleLogin}
                className="border-black"
              >
                Login
              </Button>
            </React.Fragment>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default LiveController;
