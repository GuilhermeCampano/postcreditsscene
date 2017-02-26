import Dispatcher from '../modules/dispatcher';

export function getMovies (query) {
  Dispatcher.dispatch({
    type:"GET_MOVIES",
    value:query
  })
}

export function votePoll (movie, voteType) {
  Dispatcher.dispatch({
    type:"VOTE_POLL",
    value: { movie, voteType }
  })
}
