import { S3Access } from "../dataLayer/s3Access";
import { ImageAccess } from "../dataLayer/imageAccess";

const s3Access = new S3Access();
const imageAccess = new ImageAccess();

export async function getImageSignedUrl(imageId: string): Promise<string> {
  const signedUrl = await s3Access.generateSignedUrl(imageId);
  return signedUrl;
}

export async function getImageVisitUrl(imageId: string): Promise<string> {
  return s3Access.generateVisitUrl(imageId);
}

export async function deleteImage(imageId: string, userId: string) {
  // If the image has an owner then only owner should have access to delete it
  const findOwnerId = await imageAccess.getImageOwnerId(imageId)
  if (userId !== findOwnerId) {
    throw new Error ("No access to do")
  }
  s3Access.deleteImage(imageId);
}
