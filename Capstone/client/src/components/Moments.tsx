import React, { useState, useEffect } from "react";
import { History } from "history";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Auth from "../auth/Auth";
import { getMoments } from "../api/moment-api";
import { Moment } from "../types/MomentType";
import Card from "react-bootstrap/Card";
import { deleteMoment } from "../api/moment-api";
import { Edit, Trash2 } from "react-feather";

interface MomentsProps {
  auth: Auth;
  history: History;
  momentState: [Moment[], React.Dispatch<React.SetStateAction<Moment[]>>];
}

export function Moments(props: MomentsProps) {
  const [moments, setMoments] = props.momentState;
  const idToken = props.auth.getIdToken();
  const history = props.history

  useEffect(() => {
    const fetchData = async () => {
      if (idToken) {
        const moments = await getMoments(idToken);
        setMoments(moments);
      } else {
        history.push("/");
      }
    };
    try {
      fetchData();
    } catch (e) {
      alert(`Failed to fetch todos: ${e.message}`);
    }
  }, []);

  const momentDisplay = moments.map((m) => {
    return (
      <MomentDisplay
        key={m.id}
        moment={m}
        idToken={idToken}
        momentState={props.momentState}
        history={history}
      />
    );
  });
  return (
    <>
      <div>
        <Button variant="success" onClick={() => props.history.push("create")}>
          Create new moment
        </Button>
        {momentDisplay}
        {/* <div>{moments}</div> */}
      </div>
    </>
  );
}

export function MomentDisplay(props: {
  moment: Moment;
  idToken: string | null;
  momentState: [Moment[], React.Dispatch<React.SetStateAction<Moment[]>>];
  history: History;
}): JSX.Element {
  const { moment, idToken } = props;
  const [moments, setMoments] = props.momentState;

  const deleteMomentHandler = async () => {
    try {
      await deleteMoment(idToken as string, moment.id);
      const index = moments.findIndex((m) => m.id === moment.id);
      const aux = [...moments];
      aux.splice(index, 1);
      setMoments(aux);
    } catch (e) {
      alert("failed to delete the moment");
    }
  };
  return (
    <Card className="my-2">
      <Card.Body>
        <Card.Title>
          <Row noGutters className="justify-content-md-between">
            <span>{moment.content}</span>
            <div>
              <Button
                variant="outline-dark"
                size="sm"
                className="mr-2"
                onClick={() => {props.history.push(`/update/${moment.id}`)}}
              >
                <Edit size={16} />
                Edit
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={deleteMomentHandler}
              >
                <Trash2 size={16} />
                Delete
              </Button>
            </div>
          </Row>
        </Card.Title>
        <Card.Subtitle>
          <span>{`Updated at ${dateFormat(moment.postedAt)}`}</span>
        </Card.Subtitle>

        <Row>
          {moment.images.map((image) => {
            return (
              <Col lg={4} key={image.imageId}>
                <Image src={image.imageUrl} rounded style={{ width: "100%" }} />
              </Col>
            );
          })}
        </Row>
      </Card.Body>
    </Card>
  );
}

function dateFormat(isoDate: string) {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const dt = date.getDate();

  return `${dt < 10 ? "0" : ""}${dt}/${month < 10 ? "0" : ""}${month}/${year}`;
}
