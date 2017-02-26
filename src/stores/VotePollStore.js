import _ from 'lodash';

class votePollStore {
  constructor() {
    if(!localStorage.getItem('votePoll')){
      localStorage.setItem('votePoll',JSON.stringify([]));
    }
    this.votePoll = JSON.parse(localStorage.getItem('votePoll'));
  }

  getAll(){
    return this.votePoll;
  }

  getById(id){
    return _.find(this.votePoll, function(item) {
      return item.id === id;
    });
  }

  getIndexById(id){
    return _.findIndex(this.votePoll, function(item) {
      return item.id === id;
    });
  }

  setMovie(id,voteType){
    const movie = this.getById(id);
    if( !movie || _.isEmpty(movie) ){ //If the user not voted for this movie yet
      this.createVotePollItem(id,voteType);
      return true;
    } else {
      if( movie.type == voteType.toUpperCase() ){ //Does't allow the same votetype
        return false;
      } else {
        this.updateVotePollItem(id,voteType); // Changes vote type
        return true;
      }
    }
    localStorage.setItem('votePoll',JSON.stringify(this.votePoll));
    return true;
  }

  createVotePollItem(id,voteType) {
    console.log('creating a new item');
    this.votePoll.push({
      id:parseInt(id),
      type:voteType.toUpperCase(),
      date: new Date().getTime()
    });
    localStorage.setItem('votePoll',JSON.stringify(this.votePoll));
  }

  updateVotePollItem(id,voteType) {
    console.log('updating an item');
    const index = this.getIndexById(id);
    this.votePoll[index].type = voteType.toUpperCase();
    this.votePoll[index].date = new Date().getTime();
    localStorage.setItem('votePoll',JSON.stringify(this.votePoll));
  }

  clearVotePoll(){
    localStorage.setItem('votePoll',JSON.stringify([]));
    this.votePoll = [];
  }
}

export let VotePollStore = new votePollStore();
