import Axios from "axios";

import { apiEndpoint } from "../config";
import { CreateMomentRequest } from "../types/CreateMomentRequest";
import { UpdateMomentRequest } from "../types/UpdateMomentRequest";
import { Moment } from "../types/MomentType";
import { stringify } from "querystring";

export async function getMoments(idToken: string): Promise<Moment[]> {
  const response = await Axios.get(`${apiEndpoint}/moments`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });
  console.log("moments:", response.data);
  return response.data.items;
}

export async function createMoment(
  idToken: string,
  newMoment: CreateMomentRequest
): Promise<Moment> {
  const response = await Axios.post(
    `${apiEndpoint}/moments`,
    JSON.stringify(newMoment),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return response.data.item;
}

export async function updateMoment(
  idToken: string,
  momentId: string,
  updatedMoment: UpdateMomentRequest
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/moments/${momentId}`,
    JSON.stringify(updatedMoment),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
}

export async function deleteMoment(
  idToken: string,
  momentId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/moments/${momentId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });
}

export async function getUploadAndVisitUrl(
  idToken: string,
  imageId: string
): Promise<{ uploadUrl: string; visitUrl: string }> {
  const response = await Axios.post(
    `${apiEndpoint}/moments/images/${imageId}`,
    "",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return response.data;
}

export async function uploadFile(
  uploadUrl: string,
  file: Buffer | File
): Promise<void> {
  await Axios.put(uploadUrl, file);
}

export async function deleteImage(idToken: string, imageId: string) {
  await Axios.delete(`${apiEndpoint}/moments/images/${imageId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });
}
