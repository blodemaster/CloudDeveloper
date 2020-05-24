import * as uuid from 'uuid'
import { TodoAccess } from '../dataLayer/todoAccess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todoAccess = new TodoAccess()

export async function getToDos(userId: string): Promise<TodoItem[]> {
    return await todoAccess.getTodoItems(userId);
}

export async function createTodo(createTodo: CreateTodoRequest, userId: string): Promise<TodoItem> {
    const itemId = uuid.v4();
    const item = {
        userId,
        todoId: itemId,
        createdAt: new Date().toISOString(),
        done: false,
        ...createTodo
    }

    return await todoAccess.createTodoItem(item)
}

export async function updateTodo(todoId: string, toUpdate: UpdateTodoRequest, userId: string ) {
    return await todoAccess.updateTodoItem(todoId, toUpdate, userId)
}

export async function deleteTodo(todoId: string, userId: string) {
    return await todoAccess.deleteTodoItem(todoId, userId)
}

export async function setAttachmentUrl(todoId: string, userId: string, url: string) {
    return await todoAccess.setAttachmentUrl(todoId, userId, url)
}