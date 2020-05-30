import React, { Component, useState } from "react";
import { Link, Route, Router, Switch } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

import Auth from "./auth/Auth";
import { Moments } from "./components/Moments";
import { LogIn } from "./components/LogIn";
import { NotFound } from "./components/NotFound";
import {
  EditMoment,
  CreateMoment,
  UpdateMoment,
} from "./components/EditMoment";
import { Moment } from "./types/MomentType";

export interface AppProps {
  auth: Auth;
  history: any;
}

export default function App(props: AppProps) {
  const { auth, history } = props;
  const momentState = useState<Moment[]>([]);
  const [moments, setMoments] = momentState;

  const generateMenu = () => {
    return (
      <>
        <Navbar bg="light" variant="light" className="mb-4">
          <Navbar.Brand href="">Moment</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>
          </Nav>
          <Nav>{logInLogOutButton()}</Nav>
        </Navbar>
      </>
    );
  };

  const logInLogOutButton = () => {
    if (auth.isAuthenticated()) {
      return (
        <Button variant="light" onClick={() => auth.logout()}>
          Logout
        </Button>
      );
    } else {
      return (
        <Button variant="light" onClick={() => auth.login()}>
          Login
        </Button>
      );
    }
  };

  const generateCurrentPage = () => {
    if (!auth.isAuthenticated()) {
      return <LogIn auth={auth} />;
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={(props) => {
            return (
              <Moments
                auth={auth}
                history={history}
                momentState={momentState}
              />
            );
          }}
        />

        <Route
          path="/create"
          exact
          render={(props) => {
            return <CreateMoment auth={auth} history={history} />;
          }}
        />

        <Route
          path="/update/:momentId"
          exact
          render={(props) => {
            const momentId = props.match.params.momentId;
            const moment = moments.find((m) => m.id === momentId);
            if (moment !== undefined) {
              return (
                <UpdateMoment
                  {...props}
                  auth={auth}
                  history={history}
                  moment={moment}
                />
              );
            } else {
              history.push("/");
            }
          }}
        />

        <Route component={NotFound} />
      </Switch>
    );
  };

  return (
    <Router history={history}>
      <Container>
        {generateMenu()}
        {generateCurrentPage()}
      </Container>
    </Router>
  );
}
