import React, {
  createContext,
  useContext,
  FC,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { Todo } from '../../types/Todo';
import { FilterStatus } from '../../types/FilterStatus';
import * as todoService from '../../api/todos';
import { errorMessages } from '../ErrorNotification';
import { TodosContextType } from '../../types/contextTypes';
import {
  initialFilterStatus,
  initialTodos,
} from '../../types/initialContextValues';
import { getFilteredTodos } from '../../utils/getFilteredTodos';
import {
  addTodo,
  getAll,
  removeAll,
  removeTodo,
  updateOneTodo,
} from '../../api/todos';

interface Props {
  children: React.ReactNode;
}

const TodosContext = createContext<TodosContextType>({
  todos: initialTodos,
  setTodos: () => {},
  filterStatus: initialFilterStatus,
  setFilterStatus: () => {},
  filteredTodos: [],
  isLoading: false,
  errorMessage: '',
  setErrorMessage: () => {},
  setIsLoading: () => {},
  selectedTodoIds: [],
  setSelectedTodoIds: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  createNewTodo: () => {},
  newTodoTitle: '',
  setNewTodoTitle: () => {},
  deleteTodo: () => {},
  clearCompletedTodos: () => {},
  updateTodo: () => {},
});

export const useTodos = () => useContext(TodosContext);

export const TodosProvider: FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const [filterStatus, setFilterStatus] =
    useState<FilterStatus>(initialFilterStatus);

  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const filteredTodos = getFilteredTodos(todos, filterStatus);

  useEffect(() => {
    setIsLoading(true);

    getAll()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        setErrorMessage(errorMessages.unableToLoadTodos);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const createNewTodo = useCallback(async (title: string) => {
    try {
      setIsLoading(true);
      setSelectedTodoIds(prevIds => [...prevIds, todoService.USER_ID]);

      const newTodo: Todo = await addTodo(title);

      setTempTodo({ ...newTodo });

      setNewTodoTitle('');
      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch (error) {
      setErrorMessage(errorMessages.unableToAddTodo);
    } finally {
      setSelectedTodoIds(prevIds =>
        prevIds.filter(id => id !== todoService.USER_ID),
      );
      setIsLoading(false);
      setTempTodo(null);
    }
  }, []);

  const deleteTodo = useCallback(async (todoId: number) => {
    setErrorMessage('');

    try {
      setSelectedTodoIds(currentIds => [...currentIds, todoId]);

      await removeTodo(todoId);

      getAll().then(setTodos);
    } catch (error) {
      setSelectedTodoIds(ids => ids.filter(id => id !== todoId));

      setErrorMessage(errorMessages.unableToDeleteTodo);
      throw error;
    } finally {
      setSelectedTodoIds(ids => ids.filter(id => id !== todoId));
    }
  }, []);

  const clearCompletedTodos = useCallback(async () => {
    try {
      await removeAll(todos.filter(todo => todo.completed));
      const newTodos = await getAll();

      setTodos(newTodos);
    } catch (error) {
      setErrorMessage(errorMessages.unableToDeleteTodo);
    }
  }, [todos]);

  const updateTodo = useCallback(async (updatingTodo: Todo) => {
    try {
      setSelectedTodoIds(currentIds => [updatingTodo.id, ...currentIds]);
      await updateOneTodo(updatingTodo);

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === updatingTodo.id ? updatingTodo : todo,
        ),
      );
    } catch (error) {
      setErrorMessage(errorMessages.unableToUpdateTodo);
      throw error;
    } finally {
      setSelectedTodoIds(ids => ids.filter(id => id !== updatingTodo.id));
    }
  }, []);

  return (
    <TodosContext.Provider
      value={{
        isLoading,
        setIsLoading,
        todos,
        setTodos,
        filterStatus,
        setFilterStatus,
        filteredTodos,
        errorMessage,
        setErrorMessage,
        selectedTodoIds,
        setSelectedTodoIds,
        tempTodo,
        setTempTodo,
        createNewTodo,
        newTodoTitle,
        setNewTodoTitle,
        deleteTodo,
        clearCompletedTodos,
        updateTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
