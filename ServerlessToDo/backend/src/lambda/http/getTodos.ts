import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { getToDos } from '../../businessLogic/todos'
import { getUserId } from '../utils'

const logger = createLogger('getTodos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  const userId = getUserId(event)
  logger.info(`Get todo items for user ${userId} with event: ${event}`)

  const todoItems = await getToDos(userId)
  const todoItemsWithoutUserId = todoItems.map(item => {
    delete item.userId
    return item
  })
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({items: todoItemsWithoutUserId})
  }
}
