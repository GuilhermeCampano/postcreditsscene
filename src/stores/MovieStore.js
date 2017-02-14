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
    let moviesApiResponse = [];
    let postCreditsApiResponse = [];
    let movieIds = [];
    const url = Config.moviesAPI+'search/movie';
    const config = {
      params: {
        api_key: Config.apiKey,
        query: query,
      }
    };
    if(!query) {
      return false;
    }

    Axios.get(url,config) // Get Movies
    .then((response) => {
      moviesApiResponse = response.data.results;
      movieIds= this.getMovieIds(moviesApiResponse);
      return Axios.post(Config.postCreditsAPI+'movies/filter',{
        movie_ids: movieIds
      });
    })
    .then((response) => { // Get postcredits
      postCreditsApiResponse = response.data;
      this.movies = this.mergeApiResponses(moviesApiResponse,postCreditsApiResponse);
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

  getMovieIds = (moviesList) => {
    let movieIds = [];
    if(moviesList.length){
      for (let movie of moviesList)  {
        movieIds.push(movie.id);
      };
    }
    return movieIds;
  }

  mergeApiResponses = (list1, list2) => {
    for(let list1Item of list1) {
      for(let list2Item of list2) {
        if(list1Item.id == list2Item.moviedbid){
          list1Item = Object.assign(list1Item, list2Item);
          break;
        }
      }
    }
    return list1;
  }

}

const movieStore = new MovieStore();
Dispatcher.register(movieStore.handleActions.bind(movieStore));
export default movieStore;
