import "source-map-support/register";

import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { createLogger } from "../utils/logger";

const XAWS = AWSXRay.captureAWS(AWS);
const s3 = new XAWS.S3({
  signatureVersion: "v4",
});

const logger = createLogger("S3");

export class S3Access {
  private readonly bucket: string = process.env.IMAGES_S3_BUCKET;
  private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION;

  async generateSignedUrl(imageId: string) {
    logger.info("Generate signed url for image ", imageId);
    return s3.getSignedUrl("putObject", {
      Bucket: this.bucket,
      Key: imageId,
      Expires: parseInt(this.urlExpiration),
    });
  }

  async generateVisitUrl(imageId: string) {
    logger.info("Generate visit url for image ", imageId);
    return `https://${this.bucket}.s3.amazonaws.com/${imageId}`;
  }

  async deleteImage(imageId: string) {
    logger.info(`Delete image of id ${imageId}`);
    return s3.deleteObject({
      Bucket: this.bucket,
      Key: imageId,
    });
  }
}
