import React from 'react';
import ColorBlindCard from '../../atoms/color-blind-card/color-blind-card.jsx';

export default class ColorBlindCards extends React.Component {
  constructor(props) {
    super(props);
    this.cardsClassWidth = 'col s6 m3 l3';
    this.listOfColorBlindness = [
      'protanopia','protanomaly','deuteranomaly', 'deuteranopia',
      'tritanomaly','tritanopia', 'achromatomaly', 'achromatopsia'
    ]
  }
  render() {
    const originalColor = this.props.color || '';
    const listOfCards = this.listOfColorBlindness.map((colorBlindType, i) => {
      return <div key={i} className={this.cardsClassWidth}> <ColorBlindCard  originalColor={originalColor} colorBlindType={colorBlindType}/> </div>
    });
    return(
      <div className = 'row'>
        {listOfCards}
      </div>
    )
  }
}
