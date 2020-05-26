import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Image } from "../models/image"

const XAWS = AWSXRay.captureAWS(AWS)

export class ImageAccess {
    private readonly docClient: DocumentClient = createDynamoDBClient()
    private readonly imageTable: string = process.env.IMAGE_TABLE
    private readonly userIdIndex: string = process.env.USER_ID_INDEX

    async getImagesOfMoment(momentId: string, userId: string) : Promise<Image[]> {
        const result = await this.docClient.query({
            TableName: this.imageTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'momentId = :momentId, userId = :userId',
            ExpressionAttributeValues: {
                ":momentId": momentId,
                ":userId": userId
            }
        }).promise()

        return result.Items as Image[]
    }

    async createImage(imageItem: Image): Promise<Image> {
        await this.docClient.put({
            TableName: this.imageTable,
            Item: imageItem
        }).promise()

        return imageItem
    }

    async deleteImage(imageId: string) {
        return this.docClient.delete({
            TableName: this.imageTable,
            Key: {
                imageId
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