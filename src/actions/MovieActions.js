import Dispatcher from '../dispatcher';

export function getMovies (query) {
  Dispatcher.dispatch({
    type:"GET_MOVIES",
    value:query
  })
}
