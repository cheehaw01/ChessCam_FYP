import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

// Card on Home Page
function HomeCard(props) {
  const { title, children, width, bg } = props;

  // styling
  const cardStyle = {
    width: width,
    background: bg,
  };

  return (
    <React.Fragment>
      <Card style={cardStyle} className="m-3">
        <Card.Body>
          <Card.Title> {title} </Card.Title>
          <Card.Text> {children} </Card.Text>
        </Card.Body>
        <Button className="m-2" variant="primary" href={props.to}>
          Go
        </Button>
      </Card>
    </React.Fragment>
  );
}

export default HomeCard;
