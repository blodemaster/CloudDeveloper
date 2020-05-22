import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from "../models/TodoItem"
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const XAWS = AWSXRay.captureAWS(AWS)

export class TodoAccess {
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient
    private readonly todosTable: string = process.env.TODOS_TABLE
    private readonly userIdIndex: string = process.env.USER_ID_INDEX

    async getTodoItems(userId: string) : Promise<TodoItem[]> {
        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId =: userId',
            ExpressionAttributeValues: {
                ":userId": userId
            }
        }).promise()
        return result.Items as TodoItem[]
    }

    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        })

        return todoItem
    }

    async updateTodoItem(todoId: string, toUpdate: UpdateTodoRequest, userId: string) {
        return await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId,
            },
            UpdateExpression: "set name = :n, dueDate = :due, done = :done",
            ExpressionAttributeValues: {
                ":n": toUpdate.name,
                ":due": toUpdate.dueDate,
                ":done": toUpdate.done
            }
        })
    }

    async deleteTodoItem(todoId: string, userId: string) {
        return await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId,
            }
        }) 
    }
}