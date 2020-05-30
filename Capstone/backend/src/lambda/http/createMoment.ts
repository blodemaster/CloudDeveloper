import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { CreateMomentRequest } from '../../request/CreateMomentRequest'
import { createMoment } from '../../businessLogic/moment'

const logger = createLogger('CreateMoment')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newMoment: CreateMomentRequest = JSON.parse(event.body)
  const userId = getUserId(event)

  logger.info(`Create new moment for user ${userId} with event ${event}`)

  const newItem = await createMoment(newMoment, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      "item": newItem
    })
  }
}
