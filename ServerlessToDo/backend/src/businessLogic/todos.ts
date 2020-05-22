import * as uuid from 'uuid'
import { TodoAccess } from '../dataLayer/todoAccess'
import { parseUserId } from '../auth/utils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'


const todoAccess = new TodoAccess()

export async function getToDos(jwtToken: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken)
    return await todoAccess.getTodoItems(userId);
}

export async function createTodo(createTodo: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
    const itemId = uuid.v4();
    const userId = parseUserId(jwtToken)

    const item = {
        userId,
        todoId: itemId,
        createdAt: new Date().toISOString(),
        done: false,
        ...createTodo
    }

    return await todoAccess.createTodoItem(item)
}

export async function updateTodo(todoId: string, toUpdate: UpdateTodoRequest, jwtToken: string ) {
    const userId = parseUserId(jwtToken)
    return await todoAccess.updateTodoItem(todoId, toUpdate, userId)
}

export async function deleteTodo(todoId: string, jwtToken: string) {
    const userId = parseUserId(jwtToken)
    return await todoAccess.deleteTodoItem(todoId, userId)
}