import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";
import { createLogger } from "../../utils/logger";
import { getUserId } from "../utils";
import { deleteImage } from "../../businessLogic/s3";

const logger = createLogger("deleteImage");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const imageId = event.pathParameters.imageId;
    const userId = getUserId(event);
    logger.info(`Delete image of id ${imageId} for user ${userId}`);
    await deleteImage(imageId, userId);

    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: "",
    };
  } catch (e) {
    logger.error(e);
    return {
      statusCode: 403,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: e,
    };
  }
};
