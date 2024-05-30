import axios from 'axios';
import { Todo } from '../types/Todo';

export const USER_ID = 0;

axios.defaults.baseURL = 'https://node-server-todo.onrender.com';

export async function getAll(): Promise<Todo[]> {
  return axios.get('./todos').then(res => res.data);
}

export function updateAll(items: Todo[]): Promise<Todo[]> {
  const promise = axios
    .patch('./todos?action=update', { items })
    .then(res => res.data);

  return promise;
}

export async function removeAll(items: Todo[]): Promise<Todo[]> {
  return axios
    .patch('./todos?action=delete', { ids: items.map(item => item.id) })
    .then(res => res.data);
}

export async function getOne(todoId: string): Promise<Todo> {
  const response = await axios.get(`./todos/${todoId}`);

  return response.data;
}

export async function addTodo(title: string): Promise<Todo> {
  const response = await axios.post('./todos', { title });

  return response.data;
}

export async function removeTodo(todoId: number): Promise<string> {
  const response = await axios.delete(`./todos/${todoId}`);

  return response.statusText;
}

export async function updateOneTodo({
  title,
  completed,
  id,
}: Todo): Promise<Todo> {
  const response = await axios.put(`./todos/${id}`, { title, completed });

  return response.data;
}
