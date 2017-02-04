import React from 'react';
import Axios from 'axios';
import style  from './moviecard.scss';

export default class MovieCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      movieQuery: null
    }
  }

  setMoviePoster = (endUrl) => {
    return 'http://image.tmdb.org/t/p/w185/'+endUrl;
  }

  getMovies = () => {
    let self = this;
    // Axios.get('https://api.themoviedb.org/3/movie/'+this.state.movieQuery+'?api_key=10c95faa22afc9b0a480f4f77cd3a6d1')
     Axios.get('https://api.themoviedb.org/3/search/movie/?api_key=10c95faa22afc9b0a480f4f77cd3a6d1&query='+this.state.movieQuery)
    .then(function (response) {
      self.setState({data:response.data.results[0]});
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  handleQueryChange = (e) => {
   this.setState({movieQuery: e.target.value});
   this.getMovies();
  }

  componentDidMount= () => {
  }

  render() {
    let poster;
    if (!!this.state.movieQuery) {
      poster = <img src={this.setMoviePoster(this.state.data.poster_path)}/>
    } else {
      poster = '';
    }
    return(
      <div className="movie-card">
        <input
          className = "movie-id-input"
          type="text"
          placeholder="busca"
          onChange={this.handleQueryChange}
          value={this.state.movieQuery}
        />
        <div><b>Title</b>: {this.state.data.title}</div>
        <div><b>Descripiton</b>: {this.state.data.overview}</div>
        {poster}
      </div>
    )
  }
}
