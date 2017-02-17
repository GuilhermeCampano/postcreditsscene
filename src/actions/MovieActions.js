import Dispatcher from '../modules/dispatcher';

export function getMovies (query) {
  Dispatcher.dispatch({
    type:"GET_MOVIES",
    value:query
  })
}

export function votePoll (movieId, voteType) {
  Dispatcher.dispatch({
    type:"VOTE_POLL",
    value:{
      id: movieId,
      vote_type: voteType
    }
  })
}
