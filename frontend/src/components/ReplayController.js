import React, { useContext } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import backButtonImg from "../assets/back-button-bg.png";
import backwardButtonImg from "../assets/backward-button-bg.png";
import forwardButtonImg from "../assets/forward-button-bg.png";
import nextButtonImg from "../assets/next-button-bg.png";
import { StepCountContext } from "./ReplayView";

// Replay Page Controller
function ReplayController() {
  // read and subscribe to context
  const control = useContext(StepCountContext);

  // function - set step to initial step
  const backButtonHandler = () => {
    control.setStep(0);
  };

  // function - set step to previous step
  const backwardButtonHandler = () => {
    if (control.step > 0) control.setStep(control.step - 1);
  };

  // function - set step to next step
  const forwardButtonHandler = () => {
    if (control.step < control.totalStep) control.setStep(control.step + 1);
  };

  // function - set step to last step
  const nextButtonHandler = () => {
    control.setStep(control.totalStep);
  };

  // render
  return (
    <Container fluid>
      <Row
        className="m-2 p-3 border border-2 rounded-2 border-secondary"
        style={{ background: "#818286" }}
      >
        <Col xs={{ span: 3 }} md={{ span: 1, offset: 4 }}>
          <Image
            className="control-button rounded-2"
            src={backButtonImg}
            width="30%"
            onClick={backButtonHandler}
          />
        </Col>
        <Col xs={{ span: 3 }} md={{ span: 1 }}>
          <Image
            className="control-button rounded-2"
            src={backwardButtonImg}
            width="30%"
            onClick={backwardButtonHandler}
          />
        </Col>
        <Col xs={{ span: 3 }} md={{ span: 1 }}>
          <Image
            className="control-button rounded-2"
            src={forwardButtonImg}
            width="30%"
            onClick={forwardButtonHandler}
          />
        </Col>
        <Col xs={{ span: 3 }} md={{ span: 1 }}>
          <Image
            className="control-button rounded-2"
            src={nextButtonImg}
            width="30%"
            onClick={nextButtonHandler}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default ReplayController;
