import React from 'react';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { TodoCreatingForm } from './components/TodoCreatingForm';
import { ErrorNotification } from './components/ErrorNotification';
import { useTodos } from './components/TodosProvider';

export const App: React.FC = () => {
  const { todos } = useTodos();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoCreatingForm />

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList />
        </section>

        {!!todos.length && <Footer />}
      </div>

      <ErrorNotification />
    </div>
  );
};
