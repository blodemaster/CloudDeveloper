import 'source-map-support/register'

import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { setAttachmentUrl } from '../../businessLogic/todos'

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const logger = createLogger('generateUploadUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  logger.info(`Generate upload url with event ${event} for user ${userId}`)

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const signedUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })
  logger.info("Generated url is ", signedUrl)

  const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`
  await setAttachmentUrl(todoId, userId, attachmentUrl)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({uploadUrl: signedUrl})
  }
}
