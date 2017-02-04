import React from 'react';
import Axios from 'axios';
import style  from './moviecard.scss';

export default class MovieCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      movieQuery: ''
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
      self.setState({data:response.data.results});
    })
    .catch(function (error) {
    });
  }

  handleQueryChange = (e) => {
   this.setState({movieQuery: e.target.value});
   this.getMovies();
  }

  componentDidMount= () => {
  }

  render() {
    let self = this;
    let movies = this.state.data.map(function(movie) {
      let poster;
      if (!!movie.poster_path) {
        poster = <img src={self.setMoviePoster(movie.poster_path)}/>
      } else {
        poster = '';
      }
      return (
        <div key={movie.id}>
        <div><b>Title</b>: {movie.title}</div>
        <div><b>Descripiton</b>: {movie.overview}</div>
        {poster}
        </div>
      );
    });

    return(
      <div>
        <input
          className = "movie-id-input"
          type="text"
          placeholder="busca"
          onChange={this.handleQueryChange}
          value={this.state.movieQuery}
        />
        {movies}
      </div>
    )
  }
}
