import React from 'react';
import style  from './moviecard.scss';
import MovieStore from '../../stores/MovieStore';
import * as MovieActions from '../../actions/MovieActions';

export default class MovieCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: MovieStore.getAll(),
      searchValue: ''
    }
  }

  componentWillMount () {
    MovieStore.on('change', () => {
      let moviesData = MovieStore.getAll()
      if(!!moviesData && moviesData.length){
        this.setState({data:moviesData});
      }
    })
  }

  setMoviePoster = (endUrl) => {
    return !!endUrl ? 'http://image.tmdb.org/t/p/w185/'+endUrl : false;
  }

  searchValueChange = (e) => {
    this.setState({searchValue:e.target.value});
    MovieActions.getMovies(this.state.searchValue);
  }

  render() {
    let self = this;
    let movies = this.state.data.map(function(movie) {
      return (
        <div className="col s12 m6" key={movie.id}>
          <div className="card medium">
            <div className="card-image">
              <img className={style.cardImage} src={self.setMoviePoster(movie.poster_path)}/>
              <span className="card-title">{movie.title}</span>
            </div>
            <div className="card-content">
              <p>{movie.overview}</p>
            </div>
          </div>
        </div>
      );
    });

    return(
      <div>
        <input
          className = "movie-id-input"
          type="text"
          placeholder="busca"
          onChange={this.searchValueChange}
          value={this.searchValue}
        />
        <div className="row">
        {movies}
        </div>

      </div>
    )
  }
}
