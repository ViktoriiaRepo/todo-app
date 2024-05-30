import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import { useTodos } from '../TodosProvider';
import { errorMessages } from '../ErrorNotification';
import { updateAll } from '../../api/todos';

export const TodoCreatingForm: React.FC = () => {
  const {
    newTodoTitle,
    setNewTodoTitle,
    createNewTodo,
    setErrorMessage,
    tempTodo,
    todos,
    isLoading,
    setTodos,
  } = useTodos();

  const inputRef = useRef<HTMLInputElement>(null);

  const trimmedTodo = newTodoTitle.trim();

  useEffect(() => {
    if (inputRef.current && !inputRef.current.disabled) {
      inputRef.current.focus();
    }
  }, [todos, tempTodo]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewTodoTitle(event.target.value);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmedTodo) {
      setErrorMessage(errorMessages.titleShouldNotBeEmpty);

      return;
    }

    try {
      createNewTodo(trimmedTodo);
    } catch (error) {
      setErrorMessage(errorMessages.unableToAddTodo);
    }
  };

  const allTodoCompleted = todos.every(todo => todo.completed);

  const handleToggleAllClick = async () => {
    try {
      const updatedTodos = todos.map(todo => ({
        ...todo,
        completed: !allTodoCompleted,
      }));

      setTodos(updatedTodos);
      await updateAll(updatedTodos);
    } catch (error) {
      setErrorMessage(errorMessages.unableToUpdateTodos);

      setTodos(prevTodos =>
        prevTodos.map(todo => ({
          ...todo,
          completed: !allTodoCompleted,
        })),
      );
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allTodoCompleted })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAllClick}
        />
      )}

      <form onSubmit={handleSubmit} autoFocus>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
