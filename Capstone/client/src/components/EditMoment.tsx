import React, { useState, useEffect } from "react";
import * as uuid from "uuid";
import { History } from "history";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Trash2, Upload, HelpCircle } from "react-feather";
import {
  getUploadAndVisitUrl,
  uploadFile,
  deleteImage,
  createMoment,
  updateMoment,
} from "../api/moment-api";
import Auth from "../auth/Auth";
import { ImageType, Moment } from "../types/MomentType";
import { CreateMomentRequest } from "../types/CreateMomentRequest";
import { UpdateMomentRequest } from "../types/UpdateMomentRequest";

type NewImage = Pick<ImageType, "imageId" | "imageUrl">;

interface EditMomentProps {
  auth: Auth;
  mode: "create" | "update";
  history: History;
  moment?: Moment;
}

export function EditMoment(props: EditMomentProps): JSX.Element {
  const { auth, mode, history } = props;
  const [content, setContent] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [uploadedImages, setUploadedImages] = useState<NewImage[]>([]);
  const [toDeleteImageIds, setToDeleteImageIds] = useState<string[]>([]);

  useEffect(() => {
    if (props.moment && uploadedImages.length === 0 && content === "") {
      setContent(props.moment.content);
      if (props.moment.images) {
        const images = props.moment.images.map((image) => {
          return { imageId: image.imageId, imageUrl: image.imageUrl };
        });
        setUploadedImages(images);
      }
    }
  });

  const idToken = auth.getIdToken();
  const addImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const file = files[0];
    setNewImage(file);
    console.log(file);
  };

  const imageUploadHandler = async () => {
    try {
      if (newImage === null) {
        alert("File should be selected");
        return;
      }

      if (!idToken) {
        throw new Error("No token");
      }

      const imageId = uuid.v4();
      const { uploadUrl, visitUrl } = await getUploadAndVisitUrl(
        idToken,
        imageId
      );
      console.log(uploadUrl);

      await uploadFile(uploadUrl, newImage);
      setUploadedImages([...uploadedImages, { imageId, imageUrl: visitUrl }]);

      alert("File was uploaded!");
      setNewImage(null);
    } catch (e) {
      alert("Could not upload a file: " + e.message);
    } finally {
    }
  };

  const createMomentEvent = async () => {
    const toAddImageIds = uploadedImages.map((image) => image.imageId);
    const payload: CreateMomentRequest = {
      content,
      imageIds: toAddImageIds,
    };
    if (!idToken) {
      throw new Error("No token");
    }
    console.log(payload);
    await createMoment(idToken, payload);
    history.push("/");
  };

  const updateMomentEvent = async () => {
    const toAddImageIds = uploadedImages.map((image) => image.imageId);
    const payload: UpdateMomentRequest = {
      content,
      toAddImageIds,
      toDeleteImageIds,
    };
    console.log(payload);
    await updateMoment(idToken as string, props.moment?.id as string, payload);
    history.push("/");
  };

  const deleteUploadedImage = async (imageId: string) => {
    try {
      const images = [...uploadedImages];
      const index = images.findIndex((image) => image.imageId === imageId);
      setToDeleteImageIds([...toDeleteImageIds, imageId]);
      images.splice(index, 1);
      setUploadedImages(images);

      if (mode === "create") {
        if (!idToken) {
          throw new Error("No token");
        }
        console.log(imageId);
        await deleteImage(idToken, imageId);
      }
    } catch (e) {
      alert("Could not delete a file: " + e.message);
    }
  };

  const imagesDisplay = uploadedImages.map((image) => {
    return (
      <ImageDisplay
        key={image.imageId}
        image={image}
        onClick={() => deleteUploadedImage(image.imageId)}
      />
    );
  });

  const submitButton =
    mode === "create" ? (
      <div className="float-right">
        <Button variant="outline-success" onClick={createMomentEvent}>
          Create Moment
        </Button>
      </div>
    ) : (
      <div className="float-right">
        <Button variant="outline-success" onClick={updateMomentEvent}>
          Update Moment
        </Button>
      </div>
    );

  return (
    <Row className="justify-content-md-center">
      <Col lg="6">
        <Card>
          <Card.Body>
            <Form>
              <Form.Group controlId="momentContent">
                <Form.Label>Moment Text</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  onChange={(e) => {
                    setContent(e.target.value);
                  }}
                  value={content}
                />
              </Form.Group>
            </Form>
            <Form>
              <Form.Label>
                Upload images (Maximum 3 images)
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="tooltip">
                      click the blue button to upload the image
                    </Tooltip>
                  }
                >
                  <HelpCircle size={16} />
                </OverlayTrigger>
              </Form.Label>
              {imagesDisplay}
              {uploadedImages.length < 3 && (
                <Row className="my-2">
                  <Col lg={10}>
                    <Form.File
                      id="custom-file"
                      label={newImage?.name || "select image"}
                      custom
                      onChange={addImage}
                      className="mb-2"
                    />
                  </Col>
                  <Col className="float-right">
                    <Button
                      className="mr-2"
                      variant="outline-primary"
                      onClick={imageUploadHandler}
                    >
                      <Upload color="blue" size={16} />
                    </Button>
                  </Col>
                </Row>
              )}
            </Form>
            {submitButton}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

function ImageDisplay(props: {
  image: NewImage;
  onClick: () => void;
}): JSX.Element {
  const { image, onClick } = props;
  return (
    <>
      <Row key={image.imageId} className="my-2">
        <Col lg={10}>
          <Image src={image.imageUrl} rounded style={{ width: "100%" }} />
        </Col>
        <Col>
          <Button
            style={{ height: "40px" }}
            variant="outline-danger"
            onClick={onClick}
          >
            <Trash2 color="red" size={16} />
          </Button>
        </Col>
      </Row>
    </>
  );
}

export function CreateMoment(props: {
  auth: Auth;
  history: History;
}): JSX.Element {
  return <EditMoment {...props} mode="create" />;
}

export function UpdateMoment(props: {
  auth: Auth;
  history: History;
  moment: Moment;
}): JSX.Element {
  console.log(props);
  return <EditMoment {...props} mode="update" />;
}
