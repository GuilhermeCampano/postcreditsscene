import {EventEmitter} from 'events';
import Axios from 'axios';
import Dispatcher from '../modules/dispatcher';
import * as Utils  from '../modules/utils';

class MovieStore extends EventEmitter {
  constructor() {
    super();
    this.self = this;
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
    let url = 'https://api.themoviedb.org/3/search/movie';
    let apiKey = '?api_key=10c95faa22afc9b0a480f4f77cd3a6d1';
    let params = '&query='+query;
    let completeUrl = url+apiKey+params;
    if(!query) {
      return false;
    }
    Utils.makeRequest('GET', completeUrl)
    .then( (response) => {
      let parsedResponse = JSON.parse(response);
      this.movies = parsedResponse.results;
      this.emit('change');
      return true;
    })
    .catch( (err) => {
      console.log(err);
    });
    // let config = {
    //   params: {
    //     api_key: '10c95faa22afc9b0a480f4f77cd3a6d1',
    //     query: query,
    //     callback:'test'
    //   }
    // };
    //
    // Axios.get(url,config)
    // .then((response) => {
    //   self.movies = response.data.results;
    //   self.emit("change");
    // })
    // .catch((error) =>{});
  }

  getAll() {
    return this.movies;
  }

}

const movieStore = new MovieStore();
Dispatcher.register(movieStore.handleActions.bind(movieStore));
export default movieStore;
