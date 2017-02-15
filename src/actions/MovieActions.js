import Dispatcher from '../modules/dispatcher';

export function getMovies (query) {
  Dispatcher.dispatch({
    type:"GET_MOVIES",
    value:query
  })
}

export function patchPoll (movieId, postCredits) {
  console.log(movieId, postCredits)
  Dispatcher.dispatch({
    type:"GET_MOVIES",
    value:{
      movieId,
      postCredits
    }
  })
}
