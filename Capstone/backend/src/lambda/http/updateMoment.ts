import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { createLogger } from '../../utils/logger'

import { getUserId } from '../utils'
import { UpdateMomentRequest } from '../../request/UpdateMomentRequest'
import { updateMoment } from '../../businessLogic/moment'

const logger = createLogger('updateMoment')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const momentId = event.pathParameters.momentId
  const userId = getUserId(event)
  logger.info(`update moment ${momentId} for user ${userId} with event: ${event}`)

  const toUpdateData: UpdateMomentRequest = JSON.parse(event.body)

  await updateMoment(momentId, userId, toUpdateData)

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
  }
}
