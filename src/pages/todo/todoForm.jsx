import React from 'react';
export default class TodoForm extends React.Component {
  constructor(props) {
   super(props);
   this.state = {
     title:'',
     descripiton:''
   }
  }
  handleTitleChange = (e) => {
   this.setState({title: e.target.value});
  }
  handleDescripitonChange = (e) => {
   this.setState({descripiton: e.target.value});
  }
  handleSubmit = (e) => {
    e.preventDefault();
    var title = this.state.title.trim();
    var descripiton = this.state.descripiton.trim();
    if (!descripiton || !title) {
      return;
    }
    this.props.onTodoSubmit({title: title, descripiton: descripiton});
    this.setState({title: '', descripiton: ''});
  }
  render() {
    return (
      <form className="todoForm" onSubmit={this.handleSubmit}>
        {this.state.title} | {this.state.descripiton}
        <br/>
        <input type="text"
          placeholder="title"
          onChange={this.handleTitleChange}
          value={this.state.title}
        />
        <input type="text"
          placeholder="producer"
          onChange={this.handleDescripitonChange}
          value={this.state.descripiton}
        />
        <input type="submit" value="Post" />
      </form>
    )
  }
}
