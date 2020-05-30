import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";
import { createLogger } from "../../utils/logger";
import { getUserId } from "../utils";
import { getImageSignedUrl, getImageVisitUrl } from "../../businessLogic/image";

const logger = createLogger("generateUploadUrl");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event);
  logger.info(`Generate upload url with event ${event} for user ${userId}`);

  const imageId = event.pathParameters.imageId;
  const signedUrl = await getImageSignedUrl(imageId);
  const visitUrl = await getImageVisitUrl(imageId);
  logger.info("Generated url is ", signedUrl);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      uploadUrl: signedUrl,
      visitUrl,
    }),
  };
};
