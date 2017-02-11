import {EventEmitter} from 'events';
import Axios from 'axios';
import Dispatcher from '../dispatcher';

class MovieStore extends EventEmitter {
  constructor() {
    super();
    this.movies = [
      {
        id:1,
        title:'title',
        overview: 'overview'
      }
    ];
  }

  handleActions(action) {
    switch (action.type) {
      case "GET_MOVIES":
        this.getMovies(action.value);
        break;
      default:
        break;
    }
  }

  getMovies = (query) => {
    let self = this;
    let config = {
      params: {
        api_key: '10c95faa22afc9b0a480f4f77cd3a6d1',
        query: query
      }
    };
    let url = 'https://api.themoviedb.org/3/search/movie/';
    Axios.get(url,config)
    .then((response) => {
      self.movies = response.data.results;
      self.emit("change");
    })
    .catch((error) =>{});
  }

  getAll() {
    return this.movies;
  }

}

const movieStore = new MovieStore();
Dispatcher.register(movieStore.handleActions.bind(movieStore));
export default movieStore;
