import React from 'react';
import Todo from './todo';

export default class TodoList extends React.Component {
  render() {
    let data = this.props.data;
    let todoNodes = data.map(function(todo) {
      return (
        <Todo title={todo.title} key={todo.created}>
          {todo.descripiton}
        </Todo>
      );
    });
    return (
      <div className="todoList">
        {todoNodes}
      </div>
    )
  }
}
