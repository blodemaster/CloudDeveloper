import * as React from "react";
import Auth from "../auth/Auth";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";

interface LogInProps {
  auth: Auth;
}

export function LogIn(props: LogInProps) {
  return (
    <Row className="justify-content-md-center p-4">
      <Card className="text-center align-items-center w-50">
        <Card.Body>
          <Card.Title>Welcome to the Moment App</Card.Title>
          <Button variant="primary" onClick={props.auth.login}>
            Log in
          </Button>
        </Card.Body>
      </Card>
    </Row>
  );
}
