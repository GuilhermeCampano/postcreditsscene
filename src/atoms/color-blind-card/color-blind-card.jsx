import React from 'react';
import style from './color-blind-card.scss';
const blinder = require('color-blind');

export default class ColorBlindCard extends React.Component {
  constructor(props) {
    super(props);
  }
  getColorBlind = (originalColor,colorBlindType) => {
    if (originalColor && colorBlindType && originalColor.length == 7) {
      return blinder[colorBlindType](originalColor);
    } else {
      return '';
    }
  }
  capitalizeFirstLetter = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  getTextColor = (background) => {
    if(!background) {
      return 'white';
    }
    return (parseInt(background.replace('#', ''), 16) > 0xffffff / 2) ? '#000' : '#fff';
  }
  render() {
    const background = this.getColorBlind(this.props.originalColor, this.props.colorBlindType);
    const text = this.capitalizeFirstLetter(this.props.colorBlindType);
    const textColor = this.getTextColor(background);
    return(
        <div className={'card-panel ' + style.colorBlindCard}
          style={{background: background}}>
          <span className= "white-text" style={{color:textColor}}>
            {text}
          </span>
        </div>
    )
  }
}
