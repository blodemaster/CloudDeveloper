import { S3Access } from '../dataLayer/s3Access'

const s3Access = new S3Access()

export async function getImageSignedUrl(imageId: string): Promise<string> {
    const signedUrl = await s3Access.generateSignedUrl(imageId)
    return signedUrl
}
