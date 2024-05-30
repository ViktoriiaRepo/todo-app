import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useTodos } from '../TodosProvider';
import { TodoItem } from '../TodoItem';

export const TodoList: React.FC = React.memo(function TodoList() {
  const { filteredTodos, tempTodo } = useTodos();

  return (
    <TransitionGroup>
      {filteredTodos.map(todo => (
        <CSSTransition key={todo.id} timeout={300} classNames="item">
          <TodoItem key={todo.id} todo={todo} />
        </CSSTransition>
      ))}
      {tempTodo && (
        <CSSTransition key={tempTodo.id} timeout={300} classNames="item">
          <TodoItem key={tempTodo.id} todo={tempTodo} />
        </CSSTransition>
      )}
    </TransitionGroup>
  );
});
