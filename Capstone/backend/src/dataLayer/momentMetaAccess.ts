import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { MomentMeta } from "../models/moment"
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('MomentMeta')

export class MomentMetaAccess {
    private readonly docClient: DocumentClient = createDynamoDBClient()
    private readonly momentTable: string = process.env.MOMENT_TABLE
    private readonly userIdIndex: string = process.env.USER_ID_INDEX

    async getMomentsMeta(userId: string) : Promise<MomentMeta[]> {
        logger.info(`Get moments of user ${userId}`)
        const result = await this.docClient.query({
            TableName: this.momentTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ":userId": userId
            }
        }).promise()

        return result.Items as MomentMeta[]
    }

    async createMomentMeta(momentMeta: MomentMeta): Promise<MomentMeta> {
        logger.info(`Create moment with ${momentMeta}`)
        await this.docClient.put({
            TableName: this.momentTable,
            Item: momentMeta
        }).promise()

        return momentMeta
    }

    async updateMomentMeta(toUpdate: MomentMeta) {
        logger.info(`Update the moment meta with ${toUpdate}`)
        return this.docClient.update({
            TableName: this.momentTable,
            Key: {
                id: toUpdate.id,
                userId: toUpdate.userId,
            },
            UpdateExpression: "set content = :content, postedAt = :postedAt",
            ExpressionAttributeValues: {
                ":content": toUpdate.content,
                ":postedAt": toUpdate.postedAt
            },
        }).promise()
    }

    async deleteMomentMeta(momentId: string, userId: string) {
        logger.info(`Delete moment meta ${momentId} for user ${userId}`)
        return this.docClient.delete({
            TableName: this.momentTable,
            Key: {
                id: momentId,
                userId,
            }
        }).promise() 
    }
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        return new XAWS.DynamoDB.DocumentClient({
          region: 'localhost',
          endpoint: 'http://localhost:8000'
        })
      }
    
      return new XAWS.DynamoDB.DocumentClient()
}