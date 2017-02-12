import {EventEmitter} from 'events';
import Axios from 'axios';
import Dispatcher from '../modules/dispatcher';
import * as Utils  from '../modules/utils';
import * as Config from '../modules/config';

class MovieStore extends EventEmitter {
  constructor() {
    super();
    this.self = this;
    this.movies = [];
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
    const url = Config.apiEntryPoint+'search/movie';
    const config = {
      params: {
        api_key: Config.apiKey,
        query: query,
      }
    };
    if(!query) {
      return false;
    }
    Axios.get(url,config)
    .then((response) => {
      this.movies = response.data.results;
      this.emit('change');
      return true;
    })
    .catch((error) =>{
      console.log(error);
      return false;
    });
  }

  getAll() {
    return this.movies;
  }

}

const movieStore = new MovieStore();
Dispatcher.register(movieStore.handleActions.bind(movieStore));
export default movieStore;
