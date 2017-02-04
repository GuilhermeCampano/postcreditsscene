import React from 'react';
import { render } from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'
import Navbar  from './templates/navbar/navbar.jsx';
import Home from './pages/home/home.jsx';
import About from './pages/about/about.jsx';
import style from './app.scss'

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={style.appContainer}>
        <Navbar/>
        <div className={style.mainContainer}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="home" component={Home}/>
      <Route path="about" component={About}/>
    </Route>
  </Router>
), document.getElementById('app'))
