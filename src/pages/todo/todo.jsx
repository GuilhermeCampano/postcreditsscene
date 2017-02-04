import React from 'react';

export default class Todo extends React.Component {
  render() {
    return(
      <div className="todo">
        <h2 className="todoTitle">
          {this.props.title}
        </h2>
        {this.props.children}
      </div>
    )
  }
}
