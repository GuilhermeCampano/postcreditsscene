import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Axios from 'axios';
import TodoForm from './todoForm';
import TodoList from './todoList';

class TodoBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
  loadTodoFromServer = () => {
    let self = this;
    Axios.get(this.props.url)
    .then(function (response) {
      self.setState({data:response.data.results});
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  handleTodoSubmit = (todo) => {
    console.info('new todo', todo);
    let newData = this.state.data;
    newData.push({
      title:todo.title,
      descripiton:todo.descripiton,
      created:new Date()
    });
    this.setState({data:newData});
  }
  componentDidMount = () => {
    // this.loadCommentsFromServer();
  }
  displayTodoList() {
    return this.state.data.length > 0 ?
     <TodoList data={this.state.data}/>
     : <h2>Ops vazio</h2>;
  }
  render() {
    return (
      <div className="todoBox">
        <TodoForm onTodoSubmit={this.handleTodoSubmit} />
        <hr/>
          {this.displayTodoList()}
      </div>
    )
  }
}

export default TodoBox;
