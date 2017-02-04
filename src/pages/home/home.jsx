import React from 'react';
import MovieCard from '../../components/moviecard/moviecard.jsx';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
  }
  render() {
    return(
      <div className="home">
        <MovieCard/>
      </div>
    )
  }
}
