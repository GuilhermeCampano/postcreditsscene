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
  componentDidMount() {
    $(document).ready(function() {
      Materialize.updateTextFields();
    });
  }

  setMoviePoster = (endUrl) => {
    return !!endUrl ? 'http://image.tmdb.org/t/p/w185'+endUrl : false;
  }

  handleSearchValueChange = (e) => {
    this.setState({searchValue:e.target.value});
  }

  handleClickSearchButton = () =>{
    this.executeSearch();
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.executeSearch();
    }
  }

  executeSearch = () => {
    let searchValue = this.state.searchValue.toUpperCase();
    return MovieActions.getMovies(searchValue);
  }

  setVoteCounter = (postCredits, key) => {
    if(postCredits && postCredits[key]){
      return postCredits[key];
    } else {
      return '-';
    }
  }

  handleVoteClick = (event, movie, voteType) => {
    event.preventDefault();
    movie.post_credits = {
      no:0,
      yes:0
    }
    switch (voteType) {
      case 'YES':
        movie.post_credits.yes = 1;
        break;
      case 'NO':
        movie.post_credits.no = 1;
        break;
      default:
    }
    return MovieActions.votePoll(movie);
  }

  render() {
    let movies = this.state.data.map((movie) => {
      return (
        <div className="col s12 m6" key={movie.id}>
          <div className="card medium">
            <div className="card-image">
              <img className={style.cardImage} src={this.setMoviePoster(movie.poster_path)}/>
              <span className="card-title">{movie.title}</span>
            </div>
            <div className="card-content">
              <p>
              <strong className={style.voteButton} onClick={() => this.handleVoteClick(event,movie,'YES')}>YES:</strong>
                {this.setVoteCounter(movie.post_credits,'yes')}
              <strong className={style.voteButton} onClick={() => this.handleVoteClick(event,movie,'NO')}>NO:</strong>
                {this.setVoteCounter(movie.post_credits,'no')}
              </p>
              <p>{movie.overview}</p>
            </div>
          </div>
        </div>
      );
    });

    return(
      <div>
        <div className="input-field col s6">
          <i className={"material-icons prefix "+ style.searchButton}
            onClick= {() => this.handleClickSearchButton}
          >search</i>
          <input
            id = "serch-movie"
            className = "movie-id-input"
            type="text"
            placeholder="movie title"
            onChange={this.handleSearchValueChange}
            onKeyPress={this.handleKeyPress}
            value={this.searchValue}
          />
          <label htmlFor="search-movie">Search movie by title</label>
        </div>

        <div className="row">
        {movies}
        </div>

      </div>
    )
  }
}
