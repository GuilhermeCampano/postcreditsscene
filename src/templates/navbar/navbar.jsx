import React from 'react';
import { Link } from 'react-router';
import style  from './navbar.scss';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.links = ['Home', 'About'];
    this.linksHtml = this.links.map((link,index) => {
      return <li key={index}><Link to={link.toLowerCase()}>{link}</Link></li>;
    });
  }
  componentDidMount= () => {
    $('.button-collapse').sideNav({
      menuWidth: 300,
      edge: 'left',
      closeOnClick: true
    });
  }
  render() {
    return(
    <nav className="lighten-3">
      <div className="nav-wrapper grey lighten-4">
        <li href="#!" className="brand-logo"><Link to='home'>Colorblind</Link></li>
        <a href="#" data-activates="mobile-demo" className="button-collapse"><i className="material-icons">menu</i></a>
        <ul className="right hide-on-med-and-down">
          {this.linksHtml}
        </ul>
        <ul className="side-nav" id="mobile-demo">
          {this.linksHtml}
        </ul>
      </div>
    </nav>
    )
  }
}
