import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { deleteMoment } from '../../businessLogic/moment'
import { getUserId } from '../utils'

const logger = createLogger('deleteMoment')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const momentId = event.pathParameters.momentId
  const userId = getUserId(event)
  logger.info(`delete a todo item for user ${userId} with event ${event}`)

  await deleteMoment(momentId, userId)
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
  }
}
