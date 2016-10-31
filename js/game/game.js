class Game {
  constructor() {
    this.player = new Player();
    this.opponent = new Opponent();
    this.players = [this.opponent, this.player];
  }

  play() {
    this.switchPlayers();
    this.playTurn();
  }

  won() {
    return false;
  }

  currentPlayer() {
    return this.players[0];
  }

  playTurn() {
    this.currentPlayer().playTurn();
  }

  switchPlayers() {
    this.players = [this.players[1], this.players[0]];
  }
}
