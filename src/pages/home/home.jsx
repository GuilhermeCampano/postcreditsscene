import React from 'react';
import ColorBlindCards from '../../organisms/color-blind-cards/color-blind-cards.jsx';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: '#a13f3f',
    }
  }
  setColor = (newColor) => {
    if(newColor.length == 7){
      this.setState({
        color: newColor,
      });
    }
  }
  handleColorChange = (e) => {
    let userInputColor = e.target.value;
    this.setColor(userInputColor);
  }
  componentDidMount = () => {}
  render() {
    return(
      <div className="home">
        <input type="color"
          placeholder="color"
          maxLength="7"
          onChange={this.handleColorChange}
          value={this.state.color}
        />
        <ColorBlindCards color={this.state.color}/>
      </div>
    )
  }
}
