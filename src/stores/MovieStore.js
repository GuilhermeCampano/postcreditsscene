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
      case "VOTE_POLL":
        this.patchMovie(action.value);
        break;
      default:
        break;
    }
  }

  patchMovie = (moviePayload) => {
    if(!moviePayload) {
      return false;
    }
    return Axios.post(Config.postCreditsAPI+'movies/'+moviePayload.id, moviePayload)
    .then((response) =>{
      console.log(response);
      return true;
    })
    .catch((error) =>{
      console.log(error);
      return false;
    });
  }
  getMovies = (query) => {
    let moviesApiResponse = [];
    let postCreditsApiResponse = [];
    let movieIds = [];
    const config = {
      params: {
        api_key: Config.apiKey,
        query: query,
      }
    };
    if(!query) {
      return false;
    }
    Axios.get(Config.moviesAPI+'search/movie',config) // Get Movies
    .then((response) => {
      moviesApiResponse = response.data.results;
      movieIds= this.getMovieIds(moviesApiResponse);
      return Axios.post(Config.postCreditsAPI+'movies/filter',{ movie_ids: movieIds});
    })
    .then((postMoviesFilterResponse) => {
      postCreditsApiResponse = postMoviesFilterResponse.data;
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
        if(list1Item.id == list2Item.id){
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
